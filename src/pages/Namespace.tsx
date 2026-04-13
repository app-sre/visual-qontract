import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import {
  Title,
  Card,
  CardTitle,
  CardBody,
  Grid,
  GridItem,
  Alert,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  List,
  ListItem,
  Button,
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
import { ExternalLinkAltIcon, ArrowLeftIcon } from '@patternfly/react-icons';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { getDataDirUrl, getGrafanaUrl } from '../utils/env';

const GET_NAMESPACE = gql`
  query Namespace($path: String) {
    namespaces_v1(path: $path) {
      path
      name
      description
      grafanaUrl
      cluster {
        name
        path
        jumpHost {
          hostname
        }
        consoleUrl
      }
      app {
        name
        path
      }
      managedExternalResources
      externalResources {
        provider
        provisioner {
          name
        }
        ... on NamespaceTerraformProviderResourceAWS_v1 {
          resources {
            provider
            identifier
            output_resource_name
          }
        }
      }
    }
    roles_v1 {
      path
      name
      description
      access {
        namespace {
          name
          cluster {
            name
          }
        }
        role
      }
    }
  }
`;

interface NamespaceData {
  namespaces_v1: Array<{
    path: string;
    name: string;
    description?: string;
    grafanaUrl?: string;
    cluster: {
      name: string;
      path: string;
      jumpHost?: {
        hostname: string;
      };
      consoleUrl?: string;
    };
    app: {
      name: string;
      path: string;
    };
    managedExternalResources?: boolean;
    externalResources?: Array<{
      provider: string;
      provisioner?: {
        name: string;
      };
      resources?: Array<{
        provider: string;
        identifier: string;
        output_resource_name: string;
      }>;
    }>;
  }>;
  roles_v1?: Array<{
    path: string;
    name: string;
    description?: string;
    access: Array<{
      namespace: {
        name: string;
        cluster: {
          name: string;
        };
      };
      role: string;
    }>;
  }>;
}

const Namespace: React.FC = () => {
  const { namespacePath } = useParams<{ namespacePath: string }>();
  const decodedPath = namespacePath ? decodeURIComponent(namespacePath) : '';

  const { loading, error, data } = useQuery<NamespaceData>(GET_NAMESPACE, {
    variables: { path: decodedPath },
    skip: !decodedPath,
  });

  const generateGrafanaUrl = (cluster: string, namespace: string, url?: string): string => {
    if (url !== null && url !== undefined && url !== '') {
      return url;
    }

    const dataSource = `${cluster}-prometheus`;
    const dashboardName = 'k8s-compute-resources-namespace-pods/kubernetes-compute-resources-namespace-pods';
    const additionalVars = `&var-namespace=${namespace}`;
    const grafanaBaseUrl = getGrafanaUrl();

    return `${grafanaBaseUrl}/d/${dashboardName}?var-datasource=${dataSource}${additionalVars}`;
  };

  const namespace = data?.namespaces_v1?.[0];

  const resourceName = (r: any) => {
    if (r.output_resource_name) {
      return r.output_resource_name;
    }
    return `${r.identifier}-${r.provider}`;
  };

  // Filter roles that have access to this namespace
  const namespacerolesWithAccess = data?.roles_v1?.filter(role =>
    role.access && role.access.some(access =>
      access &&
      access.namespace &&
      access.namespace.name === namespace?.name &&
      access.namespace.cluster &&
      access.namespace.cluster.name === namespace?.cluster.name
    )
  ) || [];

  if (loading) {
    return <LoadingState message="Loading namespace details..." />;
  }

  if (error) {
    return (
      <div>
        <Breadcrumb>
          <BreadcrumbItem component={Link} to="/namespaces">
            Namespaces
          </BreadcrumbItem>
          <BreadcrumbItem>Namespace Details</BreadcrumbItem>
        </Breadcrumb>
        <ErrorState title="Error loading namespace" error={error} />
      </div>
    );
  }

  if (!namespace) {
    return (
      <div>
        <Breadcrumb>
          <BreadcrumbItem component={Link} to="/namespaces">
            Namespaces
          </BreadcrumbItem>
          <BreadcrumbItem>Namespace Details</BreadcrumbItem>
        </Breadcrumb>
        <Alert variant="warning" title="Namespace not found">
          No namespace found with path: {decodedPath}
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb style={{ marginBottom: '1rem' }}>
        <BreadcrumbItem component={Link} to="/namespaces">
          Namespaces
        </BreadcrumbItem>
        <BreadcrumbItem>{namespace.name}</BreadcrumbItem>
      </Breadcrumb>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <Link to="/namespaces" style={{ textDecoration: 'none', marginRight: '1rem' }}>
          <Button
            variant="link"
            icon={<ArrowLeftIcon />}
            style={{ padding: 0 }}
          >
            Back to Namespaces
          </Button>
        </Link>
        <Title headingLevel="h1" size="2xl">
          {namespace.name}
        </Title>
      </div>

      <Grid hasGutter>
        {/* Basic Information */}
        <GridItem span={12}>
          <Card>
            <CardTitle>Namespace Information</CardTitle>
            <CardBody>
              <DescriptionList>
                <DescriptionListGroup>
                  <DescriptionListTerm>Path</DescriptionListTerm>
                  <DescriptionListDescription>
                    <Button
                      variant="link"
                      component="a"
                      href={`${getDataDirUrl()}${namespace.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      icon={<ExternalLinkAltIcon />}
                      iconPosition="right"
                      style={{ padding: 0, fontSize: 'inherit' }}
                    >
                      {namespace.path}
                    </Button>
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Description</DescriptionListTerm>
                  <DescriptionListDescription>
                    {namespace.description || 'No description available'}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Application</DescriptionListTerm>
                  <DescriptionListDescription>
                    <Link
                      to={`/service/${encodeURIComponent(namespace.app.path)}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Button
                        variant="link"
                        style={{ padding: 0, fontSize: 'inherit' }}
                      >
                        {namespace.app.name}
                      </Button>
                    </Link>
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Cluster</DescriptionListTerm>
                  <DescriptionListDescription>
                    {namespace.cluster.consoleUrl ? (
                      <Button
                        variant="link"
                        component="a"
                        href={`${namespace.cluster.consoleUrl}/k8s/cluster/projects/${namespace.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        icon={<ExternalLinkAltIcon />}
                        iconPosition="right"
                        style={{ padding: 0, fontSize: 'inherit' }}
                      >
                        {namespace.cluster.name}
                      </Button>
                    ) : (
                      namespace.cluster.name
                    )}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                {namespace.cluster.consoleUrl && (
                  <DescriptionListGroup>
                    <DescriptionListTerm>Cluster Console</DescriptionListTerm>
                    <DescriptionListDescription>
                      <Button
                        variant="link"
                        component="a"
                        href={namespace.cluster.consoleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        icon={<ExternalLinkAltIcon />}
                        iconPosition="right"
                        style={{ padding: 0, fontSize: 'inherit' }}
                      >
                        Open Console
                      </Button>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                )}
                {namespace.cluster.jumpHost && (
                  <DescriptionListGroup>
                    <DescriptionListTerm>Jump Host</DescriptionListTerm>
                    <DescriptionListDescription>
                      {namespace.cluster.jumpHost.hostname}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                )}
                <DescriptionListGroup>
                  <DescriptionListTerm>Managed External Resources</DescriptionListTerm>
                  <DescriptionListDescription>
                    {namespace.managedExternalResources ? 'Yes' : 'No'}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Monitoring</DescriptionListTerm>
                  <DescriptionListDescription>
                    <Button
                      variant="link"
                      component="a"
                      href={generateGrafanaUrl(namespace.cluster.name, namespace.name, namespace.grafanaUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      icon={<ExternalLinkAltIcon />}
                      iconPosition="right"
                      style={{ padding: 0, fontSize: 'inherit' }}
                    >
                      View Grafana Dashboard
                    </Button>
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </CardBody>
          </Card>
        </GridItem>

        {/* External Resources */}
        {namespace.externalResources && namespace.externalResources.length > 0 && (
          <GridItem span={12}>
            <Card>
              <CardTitle>External Resources</CardTitle>
              <CardBody>
                <List>
                  {namespace.externalResources.map((resource, index) => (
                    <ListItem key={index}>
                      <strong>Provider:</strong> {resource.provider}
                      {resource.provisioner && (
                        <div>
                          <strong>Provisioner:</strong> {resource.provisioner.name}
                        </div>
                      )}
                      {resource.resources && resource.resources.length > 0 && (
                        <div style={{ marginTop: '0.5rem' }}>
                          <strong>Resources:</strong>
                          <List isPlain style={{ marginLeft: '1rem' }}>
                            {resource.resources.map((res, resIndex) => (
                              <ListItem key={resIndex}>
                                {res.identifier} ({res.provider}) - Secret: {namespace.cluster.consoleUrl ? (
                                  <Button
                                    variant="link"
                                    component="a"
                                    href={`${namespace.cluster.consoleUrl}/k8s/ns/${namespace.name}/secrets/${resourceName(res)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    icon={<ExternalLinkAltIcon />}
                                    iconPosition="right"
                                    style={{ padding: 0, fontSize: 'inherit' }}
                                  >
                                    {resourceName(res)}
                                  </Button>
                                ) : (
                                  resourceName(res)
                                )}
                              </ListItem>
                            ))}
                          </List>
                        </div>
                      )}
                    </ListItem>
                  ))}
                </List>
              </CardBody>
            </Card>
          </GridItem>
        )}

        {/* Roles with Access */}
        {namespacerolesWithAccess.length > 0 && (
          <GridItem span={12}>
            <Card>
              <CardTitle>Roles with Access</CardTitle>
              <CardBody>
                <Table aria-label="Roles with access table">
                  <Thead>
                    <Tr>
                      <Th>Role Name</Th>
                      <Th>Path</Th>
                      <Th>Description</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {namespacerolesWithAccess.map((role, index) => (
                      <Tr key={index}>
                        <Td>{role.name}</Td>
                        <Td>
                          <Button
                            variant="link"
                            component="a"
                            href={`${getDataDirUrl()}${role.path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            icon={<ExternalLinkAltIcon />}
                            iconPosition="right"
                            style={{ padding: 0, fontSize: 'inherit' }}
                          >
                            {role.path}
                          </Button>
                        </Td>
                        <Td>{role.description || '-'}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
          </GridItem>
        )}
      </Grid>
    </div>
  );
};

export default Namespace;