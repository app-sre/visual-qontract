import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import {
  Title,
  Card,
  CardTitle,
  CardBody,
  Alert,
  Button,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Grid,
  GridItem,
  Breadcrumb,
  BreadcrumbItem
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td
} from '@patternfly/react-table';
import { ExternalLinkAltIcon, CopyIcon } from '@patternfly/react-icons';
import GrafanaUrl from '../components/GrafanaUrl';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { getDataDirUrl } from '../utils/env';

const GET_CLUSTER = gql`
  query Cluster($path: String) {
    clusters_v1(path: $path) {
      path
      name
      spec {
        product
        version
        channel
        hypershift
      }
      description
      consoleUrl
      kibanaUrl
      prometheusUrl
      alertmanagerUrl
      grafanaUrl
      jumpHost {
        hostname
      }
      network {
        vpc
        service
        pod
      }
      namespaces {
        path
        name
        description
        grafanaUrl
        cluster {
          name
          jumpHost {
            hostname
          }
        }
      }
      upgradePolicy {
        schedule
        workloads
        conditions {
          soakDays
        }
      }
    }
    roles_v1 {
      path
      name
      description
      access {
        cluster {
          path
          name
        }
        group
      }
    }
  }
`;

interface ClusterData {
  clusters_v1: Array<{
    path: string;
    name: string;
    spec?: {
      product?: string;
      version?: string;
      channel?: string;
      hypershift?: boolean;
    };
    description?: string;
    consoleUrl?: string;
    kibanaUrl?: string;
    prometheusUrl?: string;
    alertmanagerUrl?: string;
    grafanaUrl?: string;
    jumpHost?: {
      hostname: string;
    };
    network?: {
      vpc?: string;
      service?: string;
      pod?: string;
    };
    namespaces?: Array<{
      path: string;
      name: string;
      description?: string;
      grafanaUrl?: string;
      cluster: {
        name: string;
        jumpHost?: {
          hostname: string;
        };
      };
    }>;
    upgradePolicy?: {
      schedule?: string;
      workloads?: string | string[];
      conditions?: {
        soakDays?: number;
      };
    };
  }>;
  roles_v1: Array<{
    path: string;
    name: string;
    description?: string;
    access?: Array<{
      cluster?: {
        path: string;
        name: string;
      };
      group?: string;
    }>;
  }>;
}

const Cluster: React.FC = () => {
  const { '*': path } = useParams<{ '*': string }>();
  const decodedPath = path ? `/${path}` : '';
  const [copied, setCopied] = useState(false);

  const { loading, error, data } = useQuery<ClusterData>(GET_CLUSTER, {
    variables: { path: decodedPath },
    skip: !decodedPath
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <LoadingState message="Loading cluster details..." />;
  }

  if (error) {
    return (
      <div>
        <Breadcrumb>
          <BreadcrumbItem component={Link} to="/clusters">
            Clusters
          </BreadcrumbItem>
          <BreadcrumbItem>Cluster Details</BreadcrumbItem>
        </Breadcrumb>
        <ErrorState title="Error loading cluster" error={error} />
      </div>
    );
  }

  if (!data?.clusters_v1?.length) {
    return (
      <div>
        <Breadcrumb>
          <BreadcrumbItem component={Link} to="/clusters">
            Clusters
          </BreadcrumbItem>
          <BreadcrumbItem>Cluster Details</BreadcrumbItem>
        </Breadcrumb>
        <Alert variant="warning" title="Cluster not found">
          No cluster found for path: {decodedPath}
        </Alert>
      </div>
    );
  }

  const cluster = data.clusters_v1[0];

  const clusterRoles = data.roles_v1.filter(role =>
    role.access?.some(access => access.cluster?.path === cluster.path)
  );

  return (
    <div>
      <Breadcrumb style={{ marginBottom: '1rem' }}>
        <BreadcrumbItem component={Link} to="/clusters">
          Clusters
        </BreadcrumbItem>
        <BreadcrumbItem>{cluster.name}</BreadcrumbItem>
      </Breadcrumb>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <Link to="/clusters" style={{ textDecoration: 'none', marginRight: '1rem' }}>
          <Button
            variant="link"
            style={{ padding: 0, fontSize: 'inherit' }}
          >
            ← Back to Clusters
          </Button>
        </Link>
        <Title headingLevel="h1" size="2xl">
          {cluster.name}
        </Title>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Basic Information */}
        <Card>
          <CardTitle>Basic Information</CardTitle>
          <CardBody>
            <Grid hasGutter>
              <GridItem span={6}>
                <DescriptionList>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Name</DescriptionListTerm>
                    <DescriptionListDescription>{cluster.name}</DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Path</DescriptionListTerm>
                    <DescriptionListDescription>
                      <Button
                        variant="link"
                        component="a"
                        href={`${getDataDirUrl()}${cluster.path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        icon={<ExternalLinkAltIcon />}
                        iconPosition="right"
                        style={{ padding: 0, fontSize: 'inherit' }}
                      >
                        {cluster.path}
                      </Button>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Description</DescriptionListTerm>
                    <DescriptionListDescription>{cluster.description || '-'}</DescriptionListDescription>
                  </DescriptionListGroup>
                  {cluster.jumpHost && (
                    <DescriptionListGroup>
                      <DescriptionListTerm>Jump Host</DescriptionListTerm>
                      <DescriptionListDescription>{cluster.jumpHost.hostname}</DescriptionListDescription>
                    </DescriptionListGroup>
                  )}
                  {cluster.jumpHost && cluster.network?.vpc && (
                    <DescriptionListGroup>
                      <DescriptionListTerm>Sshuttle Command</DescriptionListTerm>
                      <DescriptionListDescription>
                        <div style={{
                          display: 'flex',
                          alignItems: 'stretch',
                          gap: '0.5rem',
                          maxWidth: 'fit-content'
                        }}>
                          <code style={{
                            fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
                            fontSize: '0.875rem',
                            padding: '0.75rem 1rem',
                            backgroundColor: 'var(--pf-v6-global--BackgroundColor--200)',
                            border: '1px solid var(--pf-v6-global--BorderColor--100)',
                            borderRadius: '6px',
                            color: 'var(--pf-v6-global--Color--100)',
                            display: 'block',
                            lineHeight: '1.5',
                            whiteSpace: 'nowrap',
                            overflow: 'auto',
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                            transition: 'all 0.2s ease'
                          }}>
                            sshuttle -r {cluster.jumpHost.hostname} {cluster.network.vpc}
                          </code>
                          <Button
                            variant="control"
                            aria-label={copied ? "Copied!" : "Copy command"}
                            onClick={() => handleCopy(`sshuttle -r ${cluster.jumpHost!.hostname} ${cluster.network!.vpc}`)}
                            icon={<CopyIcon />}
                            style={{
                              transition: 'all 0.2s ease',
                              minWidth: '2.5rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {copied ? '✓' : ''}
                          </Button>
                        </div>
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                  )}
                </DescriptionList>
              </GridItem>
              <GridItem span={6}>
                {cluster.spec && (
                  <DescriptionList>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Product</DescriptionListTerm>
                      <DescriptionListDescription>{cluster.spec.product || '-'}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Version</DescriptionListTerm>
                      <DescriptionListDescription>{cluster.spec.version || '-'}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Channel</DescriptionListTerm>
                      <DescriptionListDescription>{cluster.spec.channel || '-'}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Hypershift</DescriptionListTerm>
                      <DescriptionListDescription>{cluster.spec.hypershift ? 'Yes' : 'No'}</DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                )}
              </GridItem>
            </Grid>
          </CardBody>
        </Card>

        {/* External Links */}
        <Card>
          <CardTitle>External Links</CardTitle>
          <CardBody>
            <DescriptionList>
              {cluster.consoleUrl && (
                <DescriptionListGroup>
                  <DescriptionListTerm>
                    Console
                  </DescriptionListTerm>
                  <DescriptionListDescription>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <a href={cluster.consoleUrl} target="_blank" rel="noopener noreferrer">
                        {cluster.consoleUrl}
                      </a>
                      <Button
                        variant="plain"
                        aria-label="Copy Console URL"
                        onClick={() => navigator.clipboard.writeText(cluster.consoleUrl || '')}
                        icon={<CopyIcon />}
                        style={{ padding: '0.25rem' }}
                      />
                    </div>
                  </DescriptionListDescription>
                </DescriptionListGroup>
              )}
              {cluster.grafanaUrl && (
                <DescriptionListGroup>
                  <DescriptionListTerm>
                    Grafana
                  </DescriptionListTerm>
                  <DescriptionListDescription>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <GrafanaUrl
                        cluster={cluster.name}
                        url={cluster.grafanaUrl}
                        style={{ padding: 0 }}
                      />
                      <Button
                        variant="plain"
                        aria-label="Copy Grafana URL"
                        onClick={() => navigator.clipboard.writeText(cluster.grafanaUrl || '')}
                        icon={<CopyIcon />}
                        style={{ padding: '0.25rem' }}
                      />
                    </div>
                  </DescriptionListDescription>
                </DescriptionListGroup>
              )}
              {cluster.prometheusUrl && (
                <DescriptionListGroup>
                  <DescriptionListTerm>
                    Prometheus
                  </DescriptionListTerm>
                  <DescriptionListDescription>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <a href={cluster.prometheusUrl} target="_blank" rel="noopener noreferrer">
                        {cluster.prometheusUrl}
                      </a>
                      <Button
                        variant="plain"
                        aria-label="Copy Prometheus URL"
                        onClick={() => navigator.clipboard.writeText(cluster.prometheusUrl || '')}
                        icon={<CopyIcon />}
                        style={{ padding: '0.25rem' }}
                      />
                    </div>
                  </DescriptionListDescription>
                </DescriptionListGroup>
              )}
              {cluster.alertmanagerUrl && (
                <DescriptionListGroup>
                  <DescriptionListTerm>
                    Alertmanager
                  </DescriptionListTerm>
                  <DescriptionListDescription>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <a href={cluster.alertmanagerUrl} target="_blank" rel="noopener noreferrer">
                        {cluster.alertmanagerUrl}
                      </a>
                      <Button
                        variant="plain"
                        aria-label="Copy Alertmanager URL"
                        onClick={() => navigator.clipboard.writeText(cluster.alertmanagerUrl || '')}
                        icon={<CopyIcon />}
                        style={{ padding: '0.25rem' }}
                      />
                    </div>
                  </DescriptionListDescription>
                </DescriptionListGroup>
              )}
              {cluster.kibanaUrl && (
                <DescriptionListGroup>
                  <DescriptionListTerm>
                    Kibana
                  </DescriptionListTerm>
                  <DescriptionListDescription>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <a href={cluster.kibanaUrl} target="_blank" rel="noopener noreferrer">
                        {cluster.kibanaUrl}
                      </a>
                      <Button
                        variant="plain"
                        aria-label="Copy Kibana URL"
                        onClick={() => navigator.clipboard.writeText(cluster.kibanaUrl || '')}
                        icon={<CopyIcon />}
                        style={{ padding: '0.25rem' }}
                      />
                    </div>
                  </DescriptionListDescription>
                </DescriptionListGroup>
              )}
            </DescriptionList>
          </CardBody>
        </Card>

        {/* Network Configuration */}
        {cluster.network && (
          <Card>
            <CardTitle>Network Configuration</CardTitle>
            <CardBody>
              <DescriptionList isHorizontal>
                <DescriptionListGroup>
                  <DescriptionListTerm>VPC CIDR</DescriptionListTerm>
                  <DescriptionListDescription>{cluster.network.vpc || '-'}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Service CIDR</DescriptionListTerm>
                  <DescriptionListDescription>{cluster.network.service || '-'}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Pod CIDR</DescriptionListTerm>
                  <DescriptionListDescription>{cluster.network.pod || '-'}</DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </CardBody>
          </Card>
        )}

        {/* Upgrade Policy */}
        {cluster.upgradePolicy && (
          <Card>
            <CardTitle>Upgrade Policy</CardTitle>
            <CardBody>
              <DescriptionList isHorizontal>
                <DescriptionListGroup>
                  <DescriptionListTerm>Schedule</DescriptionListTerm>
                  <DescriptionListDescription>{cluster.upgradePolicy.schedule || '-'}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Workloads</DescriptionListTerm>
                  <DescriptionListDescription>
                    {cluster.upgradePolicy.workloads ? (
                      Array.isArray(cluster.upgradePolicy.workloads) ? (
                        <div>
                          {cluster.upgradePolicy.workloads.map((workload, index) => (
                            <div key={index}>{workload}</div>
                          ))}
                        </div>
                      ) : (
                        cluster.upgradePolicy.workloads
                      )
                    ) : (
                      '-'
                    )}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Soak Days</DescriptionListTerm>
                  <DescriptionListDescription>
                    {cluster.upgradePolicy.conditions?.soakDays !== undefined ? cluster.upgradePolicy.conditions.soakDays : '-'}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </CardBody>
          </Card>
        )}

        {/* Namespaces */}
        {cluster.namespaces && cluster.namespaces.length > 0 && (
          <Card>
            <CardTitle>Namespaces ({cluster.namespaces.length})</CardTitle>
            <CardBody>
              <Table aria-label="Namespaces table">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Description</Th>
                    <Th>Monitoring</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {cluster.namespaces.map((namespace, index) => (
                    <Tr key={index}>
                      <Td>
                        <Link
                          to={`/namespace${namespace.path}`}
                          style={{ textDecoration: 'none' }}
                        >
                          <Button
                            variant="link"
                            style={{ padding: 0, fontSize: 'inherit' }}
                          >
                            {namespace.name}
                          </Button>
                        </Link>
                      </Td>
                      <Td>{namespace.description || '-'}</Td>
                      <Td>
                        <GrafanaUrl
                          cluster={cluster.name}
                          namespace={namespace.name}
                          url={namespace.grafanaUrl}
                          style={{ padding: 0, fontSize: '0.875rem' }}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardBody>
          </Card>
        )}

        {/* Roles */}
        {clusterRoles.length > 0 && (
          <Card>
            <CardTitle>Roles ({clusterRoles.length})</CardTitle>
            <CardBody>
              <Table aria-label="Roles table">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Description</Th>
                    <Th>Group</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {clusterRoles.map((role, index) => {
                    const clusterAccess = role.access?.find(access => access.cluster?.path === cluster.path);
                    return (
                      <Tr key={index}>
                        <Td>
                          <Link
                            to={`/role${role.path}`}
                            style={{ textDecoration: 'none' }}
                          >
                            <Button
                              variant="link"
                              style={{ padding: 0, fontSize: 'inherit' }}
                            >
                              {role.name}
                            </Button>
                          </Link>
                        </Td>
                        <Td>{role.description || '-'}</Td>
                        <Td>{clusterAccess?.group || '-'}</Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Cluster;