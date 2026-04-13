import React, { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import {
  Title,
  Card,
  CardTitle,
  CardBody,
  Spinner,
  Alert,
  Button,
  TextInput,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Pagination
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td
} from '@patternfly/react-table';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

const GET_CLUSTERS = gql`
  query Clusters {
    clusters_v1 {
      path
      name
      description
      consoleUrl
      kibanaUrl
      prometheusUrl
      grafanaUrl
      jumpHost {
        hostname
      }
      namespaces {
        path
        name
        description
        grafanaUrl
        cluster {
          name
          path
        }
      }
      spec {
        version
        channel
        id
        external_id
        hypershift
      }
      upgradePolicy {
        schedule
        workloads
        conditions {
          soakDays
        }
      }
    }
    apps_v1 {
      name
      path
      parentApp {
        name
      }
      namespaces {
        cluster {
          path
        }
      }
    }
  }
`;

interface ClustersData {
  clusters_v1: Array<{
    path: string;
    name: string;
    description?: string;
    consoleUrl?: string;
    kibanaUrl?: string;
    prometheusUrl?: string;
    grafanaUrl?: string;
    jumpHost?: {
      hostname: string;
    };
    namespaces?: Array<{
      path: string;
      name: string;
      description?: string;
      grafanaUrl?: string;
      cluster: {
        name: string;
        path: string;
      };
    }>;
    spec?: {
      version?: string;
      channel?: string;
      id?: string;
      external_id?: string;
      hypershift?: boolean;
    };
    upgradePolicy?: {
      schedule?: string;
      workloads?: string | string[];
      conditions?: {
        soakDays?: number;
      };
    };
  }>;
  apps_v1: Array<{
    name: string;
    path: string;
    parentApp?: {
      name: string;
    };
    namespaces?: Array<{
      cluster: {
        path: string;
      };
    }>;
  }>;
}


const Clusters: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const { loading, error, data } = useQuery<ClustersData>(GET_CLUSTERS);

  // Get apps per cluster with improved logic
  const clustersWithApps = useMemo(() => {
    if (!data?.clusters_v1 || !data?.apps_v1) return [];

    const clusterApps = data.apps_v1.reduce((acc, app) => {
      if (app.parentApp == null && app.namespaces) {
        app.namespaces.forEach(ns => {
          if (ns.cluster.path in acc) {
            const existingApp = acc[ns.cluster.path].find(existingApp => existingApp.name === app.name);
            if (!existingApp) {
              acc[ns.cluster.path].push({ name: app.name, path: app.path });
            }
          } else {
            acc[ns.cluster.path] = [{ name: app.name, path: app.path }];
          }
        });
      }
      return acc;
    }, {} as Record<string, Array<{ name: string; path: string }>>);

    const clusters = data.clusters_v1.map(cluster => {
      if (cluster.path in clusterApps) {
        return { ...cluster, apps: clusterApps[cluster.path] };
      } else {
        return { ...cluster, apps: [] };
      }
    });

    return clusters;
  }, [data]);

  const { openShiftClusters, externalClusters } = useMemo(() => {
    if (!clustersWithApps.length) return { openShiftClusters: [], externalClusters: [] };

    const openShift = clustersWithApps.filter(cluster => cluster.spec);
    const external = clustersWithApps.filter(cluster => !cluster.spec);

    return {
      openShiftClusters: openShift.filter((cluster) =>
        cluster.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cluster.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cluster.spec?.version?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
      externalClusters: external.filter((cluster) =>
        cluster.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cluster.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    };
  }, [clustersWithApps, searchTerm]);

  const paginatedOpenShiftClusters = useMemo(() => {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    return openShiftClusters.slice(startIndex, endIndex);
  }, [openShiftClusters, page, perPage]);

  const paginatedExternalClusters = useMemo(() => {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    return externalClusters.slice(startIndex, endIndex);
  }, [externalClusters, page, perPage]);


  const onSetPage = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPage: number) => {
    setPage(newPage);
  };

  const onPerPageSelect = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPerPage: number,
    newPage: number
  ) => {
    setPerPage(newPerPage);
    setPage(newPage);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <Spinner size="lg" />
        <p style={{ marginTop: '1rem' }}>Loading clusters...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" title="Error loading clusters">
        {error.message}
      </Alert>
    );
  }

  return (
    <div>
      <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
        Clusters
      </Title>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Search Toolbar */}
        <Card>
          <CardBody>
            <Toolbar>
              <ToolbarContent>
                <ToolbarItem>
                  <TextInput
                    name="clusterSearch"
                    id="clusterSearch"
                    type="search"
                    aria-label="Search clusters"
                    placeholder="Search by name, description, or version..."
                    value={searchTerm}
                    onChange={(_event, value) => setSearchTerm(value)}
                  />
                </ToolbarItem>
                <ToolbarItem align={{ default: 'alignEnd' }}>
                  <span style={{ color: 'var(--pf-v6-global--Color--200)' }}>
                    {openShiftClusters.length + externalClusters.length} cluster{(openShiftClusters.length + externalClusters.length) !== 1 ? 's' : ''} found
                    ({openShiftClusters.length} OpenShift, {externalClusters.length} External)
                  </span>
                </ToolbarItem>
              </ToolbarContent>
            </Toolbar>
          </CardBody>
        </Card>

        {/* OpenShift Clusters */}
        <Card>
          <CardTitle>OpenShift Clusters</CardTitle>
          <CardBody>
            <Table aria-label="OpenShift Clusters table">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Description</Th>
                <Th>Version</Th>
                <Th>Apps</Th>
                <Th>Hypershift</Th>
                <Th>Upgrade Schedule</Th>
                <Th>Upgrade Workloads</Th>
                <Th>Upgrade Soak Days</Th>
                <Th>Cluster ID</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedOpenShiftClusters.map((cluster) => (
                <Tr key={cluster.path}>
                  <Td>
                    <div>
                      <Link
                        to={`/cluster/${encodeURIComponent(cluster.path)}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <Button
                          variant="link"
                          style={{ padding: 0, fontSize: 'inherit' }}
                        >
                          {cluster.name}
                        </Button>
                      </Link>
                    </div>
                    {cluster.consoleUrl && (
                      <div style={{ marginTop: '0.25rem' }}>
                        <Button
                          variant="link"
                          component="a"
                          href={cluster.consoleUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          icon={<ExternalLinkAltIcon />}
                          iconPosition="right"
                          style={{ padding: 0, fontSize: '0.875rem' }}
                        >
                          Console
                        </Button>
                      </div>
                    )}
                    {(cluster.grafanaUrl || cluster.prometheusUrl || cluster.kibanaUrl) && (
                      <div style={{ marginTop: '0.25rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {cluster.grafanaUrl && (
                          <Button
                            variant="link"
                            component="a"
                            href={cluster.grafanaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            icon={<ExternalLinkAltIcon />}
                            iconPosition="right"
                            style={{ padding: 0, fontSize: '0.875rem' }}
                          >
                            Grafana
                          </Button>
                        )}
                        {cluster.prometheusUrl && (
                          <Button
                            variant="link"
                            component="a"
                            href={cluster.prometheusUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            icon={<ExternalLinkAltIcon />}
                            iconPosition="right"
                            style={{ padding: 0, fontSize: '0.875rem' }}
                          >
                            Prometheus
                          </Button>
                        )}
                        {cluster.kibanaUrl && (
                          <Button
                            variant="link"
                            component="a"
                            href={cluster.kibanaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            icon={<ExternalLinkAltIcon />}
                            iconPosition="right"
                            style={{ padding: 0, fontSize: '0.875rem' }}
                          >
                            Kibana
                          </Button>
                        )}
                      </div>
                    )}
                  </Td>
                  <Td>{cluster.description || '-'}</Td>
                  <Td>
                    {cluster.spec?.version ? (
                      <div>
                        <div>{cluster.spec.version}</div>
                        {cluster.spec.channel && (
                          <div style={{ fontSize: '0.875rem', color: 'var(--pf-v6-global--Color--200)' }}>
                            {cluster.spec.channel}
                          </div>
                        )}
                      </div>
                    ) : (
                      '-'
                    )}
                  </Td>
                  <Td>
                    {cluster.apps.length > 0 ? (
                      <div>
                        <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                          {cluster.apps.length} app{cluster.apps.length !== 1 ? 's' : ''}
                        </div>
                        <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                          {cluster.apps.map((app) => (
                            <div key={app.path} style={{
                              fontSize: '0.875rem',
                              padding: '0.125rem 0'
                            }}>
                              <Link
                                to={`/service/${encodeURIComponent(app.path)}`}
                                style={{ textDecoration: 'none' }}
                              >
                                <Button
                                  variant="link"
                                  style={{
                                    padding: 0,
                                    fontSize: '0.875rem',
                                    color: 'var(--pf-v6-global--Color--200)'
                                  }}
                                >
                                  {app.name}
                                </Button>
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div style={{ color: 'var(--pf-v6-global--Color--300)' }}>0 apps</div>
                    )}
                  </Td>
                  <Td>{cluster.spec?.hypershift ? 'Yes' : 'No'}</Td>
                  <Td>{cluster.upgradePolicy?.schedule || '-'}</Td>
                  <Td>
                    {cluster.upgradePolicy?.workloads ? (
                      <div>
                        {Array.isArray(cluster.upgradePolicy.workloads) ? (
                          cluster.upgradePolicy.workloads.map((workload) => (
                            <div key={workload}>{workload}</div>
                          ))
                        ) : (
                          <div>{cluster.upgradePolicy.workloads}</div>
                        )}
                      </div>
                    ) : (
                      '-'
                    )}
                  </Td>
                  <Td>{cluster.upgradePolicy?.conditions?.soakDays !== undefined ? cluster.upgradePolicy.conditions.soakDays : '-'}</Td>
                  <Td>{cluster.spec?.id || '-'}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

            {openShiftClusters.length === 0 && searchTerm && (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>No OpenShift clusters found matching "{searchTerm}"</p>
              </div>
            )}

            {openShiftClusters.length > perPage && (
              <Pagination
                itemCount={openShiftClusters.length}
                perPage={perPage}
                page={page}
                onSetPage={onSetPage}
                widgetId="openshift-clusters-pagination"
                onPerPageSelect={onPerPageSelect}
                style={{ marginTop: '1rem' }}
              />
            )}
          </CardBody>
        </Card>

        {/* External Clusters */}
        {externalClusters.length > 0 && (
          <Card>
            <CardTitle>External Clusters</CardTitle>
            <CardBody>
              <Table aria-label="External Clusters table">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Description</Th>
                    <Th>Apps</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {paginatedExternalClusters.map((cluster) => (
                    <Tr key={cluster.path}>
                      <Td>
                        <div>
                          <Link
                            to={`/cluster/${encodeURIComponent(cluster.path)}`}
                            style={{ textDecoration: 'none' }}
                          >
                            <Button
                              variant="link"
                              style={{ padding: 0, fontSize: 'inherit' }}
                            >
                              {cluster.name}
                            </Button>
                          </Link>
                        </div>
                        {cluster.consoleUrl && (
                          <div style={{ marginTop: '0.25rem' }}>
                            <Button
                              variant="link"
                              component="a"
                              href={cluster.consoleUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              icon={<ExternalLinkAltIcon />}
                              iconPosition="right"
                              style={{ padding: 0, fontSize: '0.875rem' }}
                            >
                              Console
                            </Button>
                          </div>
                        )}
                        {(cluster.grafanaUrl || cluster.prometheusUrl || cluster.kibanaUrl) && (
                          <div style={{ marginTop: '0.25rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {cluster.grafanaUrl && (
                              <Button
                                variant="link"
                                component="a"
                                href={cluster.grafanaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                icon={<ExternalLinkAltIcon />}
                                iconPosition="right"
                                style={{ padding: 0, fontSize: '0.875rem' }}
                              >
                                Grafana
                              </Button>
                            )}
                            {cluster.prometheusUrl && (
                              <Button
                                variant="link"
                                component="a"
                                href={cluster.prometheusUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                icon={<ExternalLinkAltIcon />}
                                iconPosition="right"
                                style={{ padding: 0, fontSize: '0.875rem' }}
                              >
                                Prometheus
                              </Button>
                            )}
                            {cluster.kibanaUrl && (
                              <Button
                                variant="link"
                                component="a"
                                href={cluster.kibanaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                icon={<ExternalLinkAltIcon />}
                                iconPosition="right"
                                style={{ padding: 0, fontSize: '0.875rem' }}
                              >
                                Kibana
                              </Button>
                            )}
                          </div>
                        )}
                      </Td>
                      <Td>{cluster.description || '-'}</Td>
                      <Td>
                        {cluster.apps.length > 0 ? (
                          <div>
                            <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                              {cluster.apps.length} app{cluster.apps.length !== 1 ? 's' : ''}
                            </div>
                            <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                              {cluster.apps.map((app) => (
                                <div key={app.path} style={{
                                  fontSize: '0.875rem',
                                  padding: '0.125rem 0'
                                }}>
                                  <Link
                                    to={`/service/${encodeURIComponent(app.path)}`}
                                    style={{ textDecoration: 'none' }}
                                  >
                                    <Button
                                      variant="link"
                                      style={{
                                        padding: 0,
                                        fontSize: '0.875rem',
                                        color: 'var(--pf-v6-global--Color--200)'
                                      }}
                                    >
                                      {app.name}
                                    </Button>
                                  </Link>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div style={{ color: 'var(--pf-v6-global--Color--300)' }}>0 apps</div>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              {externalClusters.length === 0 && searchTerm && (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <p>No external clusters found matching "{searchTerm}"</p>
                </div>
              )}

              {externalClusters.length > perPage && (
                <Pagination
                  itemCount={externalClusters.length}
                  perPage={perPage}
                  page={page}
                  onSetPage={onSetPage}
                  widgetId="external-clusters-pagination"
                  onPerPageSelect={onPerPageSelect}
                  style={{ marginTop: '1rem' }}
                />
              )}
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Clusters;