import React, { useState, useMemo } from 'react';
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
  Label,
  Spinner,
  Alert,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  List,
  ListItem,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  TextInput,
  Toolbar,
  ToolbarContent,
  ToolbarItem
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

const GET_SERVICE = gql`
  query App($path: String) {
    apps_v1(path: $path) {
      path
      name
      description
      onboardingStatus
      grafanaUrls {
        title
        url
      }
      serviceDocs
      serviceOwners {
        name
        email
      }
      escalationPolicy {
        name
        path
        description
        channels {
          jiraBoard {
            name
            path
          }
          email
          pagerduty {
            name
            path
          }
          nextEscalationPolicy {
            name
            path
          }
          slackUserGroup {
            name
            path
          }
        }
      }
      dependencies {
        path
        name
        statusPage
        SLA
      }
      quayRepos {
        org {
          name
        }
        items {
          name
          description
          public
        }
      }
      serviceDocs
      endPoints {
        name
        description
        url
      }
      codeComponents {
        name
        resource
        url
      }
      namespaces {
        path
        name
        description
        cluster {
          name
          path
          jumpHost {
            hostname
          }
        }
      }
      childrenApps {
        path
        name
        description
        onboardingStatus
      }
      sloDocuments {
        path
        name
        slos {
          name
          SLIType
          SLISpecification
          SLODetails
          SLOTarget
          dashboard
        }
      }
    }
    reports_v1 {
      path
      app {
        name
      }
      name
      date
    }
    saas_files_v2 {
      path
      name
      app {
        name
      }
      pipelinesProvider {
        provider
        ... on PipelinesProviderTekton_v1 {
          namespace {
            name
            cluster {
              consoleUrl
            }
          }
          defaults {
            pipelineTemplates {
              openshiftSaasDeploy {
                name
              }
            }
          }
          pipelineTemplates {
            openshiftSaasDeploy {
              name
            }
          }
        }
      }
      resourceTemplates {
        targets {
          namespace {
            name
            environment {
              name
            }
          }
        }
      }
    }
    scorecards_v2 {
      path
      app {
        path
        name
      }
    }
  }
`;

interface ServiceData {
  apps_v1: Array<{
    path: string;
    name: string;
    description: string;
    onboardingStatus: string;
    grafanaUrls?: Array<{
      title: string;
      url: string;
    }>;
    serviceDocs?: string;
    serviceOwners: Array<{
      name: string;
      email: string;
    }>;
    escalationPolicy?: {
      name: string;
      path: string;
      description: string;
      channels?: {
        jiraBoard?: Array<{
          name: string;
          path: string;
        }>;
        email?: string;
        pagerduty?: {
          name: string;
          path: string;
        };
        nextEscalationPolicy?: {
          name: string;
          path: string;
        };
        slackUserGroup?: Array<{
          name: string;
          path: string;
        }>;
      };
    };
    dependencies?: Array<{
      path: string;
      name: string;
      statusPage?: string;
      SLA?: string;
    }>;
    quayRepos?: Array<{
      org: {
        name: string;
      };
      items: Array<{
        name: string;
        description?: string;
        public: boolean;
      }>;
    }>;
    endPoints?: Array<{
      name: string;
      description?: string;
      url: string;
    }>;
    codeComponents?: Array<{
      name: string;
      resource: string;
      url: string;
    }>;
    namespaces?: Array<{
      path: string;
      name: string;
      description?: string;
      cluster: {
        name: string;
        path: string;
        jumpHost?: {
          hostname: string;
        };
      };
    }>;
    childrenApps?: Array<{
      path: string;
      name: string;
      description?: string;
      onboardingStatus: string;
    }>;
    sloDocuments?: Array<{
      path: string;
      name: string;
      slos: Array<{
        name: string;
        SLIType: string;
        SLISpecification: string;
        SLODetails: string;
        SLOTarget: string;
        dashboard?: string;
      }>;
    }>;
  }>;
  reports_v1?: Array<{
    path: string;
    app: {
      name: string;
    };
    name: string;
    date: string;
  }>;
  saas_files_v2?: Array<{
    path: string;
    name: string;
    app: {
      name: string;
    };
    pipelinesProvider?: {
      provider: string;
      namespace?: {
        name: string;
        cluster: {
          consoleUrl?: string;
        };
      };
      defaults?: {
        pipelineTemplates?: {
          openshiftSaasDeploy?: {
            name: string;
          };
        };
      };
      pipelineTemplates?: {
        openshiftSaasDeploy?: {
          name: string;
        };
      };
    };
    resourceTemplates?: Array<{
      targets: Array<{
        namespace: {
          name: string;
          environment: {
            name: string;
          };
        };
      }>;
    }>;
  }>;
  scorecards_v2?: Array<{
    path: string;
    app: {
      path: string;
      name: string;
    };
  }>;
}

const Service: React.FC = () => {
  const { servicePath } = useParams<{ servicePath: string }>();
  const decodedPath = servicePath ? decodeURIComponent(servicePath) : '';
  const [namespaceSearchTerm, setNamespaceSearchTerm] = useState('');

  const { loading, error, data } = useQuery<ServiceData>(GET_SERVICE, {
    variables: { path: decodedPath },
    skip: !decodedPath,
  });

  const getStatusLabelColor = (status: string) => {
    switch (status) {
      case 'Onboarded':
        return 'green';
      case 'InProgress':
        return 'yellow';
      case 'Proposed':
        return 'grey';
      case 'BestEffort':
        return 'teal';
      case 'TransitionPeriod':
        return 'red';
      default:
        return 'grey';
    }
  };

  const service = data?.apps_v1?.[0];

  const filteredNamespaces = useMemo(() => {
    if (!service?.namespaces) return [];

    return service.namespaces.filter((namespace) =>
      namespace.name.toLowerCase().includes(namespaceSearchTerm.toLowerCase()) ||
      namespace.description?.toLowerCase().includes(namespaceSearchTerm.toLowerCase()) ||
      namespace.cluster.name.toLowerCase().includes(namespaceSearchTerm.toLowerCase())
    );
  }, [service?.namespaces, namespaceSearchTerm]);

  if (loading) {
    return (
      <div>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <Spinner size="lg" />
          <p style={{ marginTop: '1rem' }}>Loading service details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Breadcrumb>
          <BreadcrumbItem component={Link} to="/services">
            Services
          </BreadcrumbItem>
          <BreadcrumbItem>Service Details</BreadcrumbItem>
        </Breadcrumb>
        <Alert variant="danger" title="Error loading service">
          {error.message}
        </Alert>
      </div>
    );
  }

  if (!service) {
    return (
      <div>
        <Breadcrumb>
          <BreadcrumbItem component={Link} to="/services">
            Services
          </BreadcrumbItem>
          <BreadcrumbItem>Service Details</BreadcrumbItem>
        </Breadcrumb>
        <Alert variant="warning" title="Service not found">
          No service found with path: {decodedPath}
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb style={{ marginBottom: '1rem' }}>
        <BreadcrumbItem component={Link} to="/services">
          Services
        </BreadcrumbItem>
        <BreadcrumbItem>{service.name}</BreadcrumbItem>
      </Breadcrumb>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <Link to="/services" style={{ textDecoration: 'none', marginRight: '1rem' }}>
          <Button
            variant="link"
            icon={<ArrowLeftIcon />}
            style={{ padding: 0 }}
          >
            Back to Services
          </Button>
        </Link>
        <Title headingLevel="h1" size="2xl">
          {service.name}
        </Title>
        <Label
          color={getStatusLabelColor(service.onboardingStatus)}
          style={{ marginLeft: '1rem' }}
        >
          {service.onboardingStatus}
        </Label>
      </div>

      <Grid hasGutter>
        {/* Basic Information */}
        <GridItem span={12}>
          <Card>
            <CardTitle>Service Information</CardTitle>
            <CardBody>
              <DescriptionList>
                <DescriptionListGroup>
                  <DescriptionListTerm>Path</DescriptionListTerm>
                  <DescriptionListDescription>
                    <Button
                      variant="link"
                      component="a"
                      href={`${process.env.REACT_APP_DATA_DIR_URL || 'https://path/to/data'}${service.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      icon={<ExternalLinkAltIcon />}
                      iconPosition="right"
                      style={{ padding: 0, fontSize: 'inherit' }}
                    >
                      {service.path}
                    </Button>
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Description</DescriptionListTerm>
                  <DescriptionListDescription>
                    {service.description || 'No description available'}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                {service.serviceDocs && (
                  <DescriptionListGroup>
                    <DescriptionListTerm>Service Documentation</DescriptionListTerm>
                    <DescriptionListDescription>
                      <Button
                        variant="link"
                        component="a"
                        href={service.serviceDocs}
                        target="_blank"
                        rel="noopener noreferrer"
                        icon={<ExternalLinkAltIcon />}
                        iconPosition="right"
                      >
                        View Documentation
                      </Button>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                )}
                {service.escalationPolicy && (
                  <DescriptionListGroup>
                    <DescriptionListTerm>Escalation Policy</DescriptionListTerm>
                    <DescriptionListDescription>
                      <div>
                        <strong>{service.escalationPolicy.name}</strong>
                        {service.escalationPolicy.description && (
                          <div style={{ marginTop: '0.5rem', color: 'var(--pf-v6-global--Color--200)' }}>
                            {service.escalationPolicy.description}
                          </div>
                        )}
                        {service.escalationPolicy.channels && (
                          <div style={{ marginTop: '0.5rem' }}>
                            <strong>Channels:</strong>
                            <div style={{ marginTop: '0.25rem', fontSize: '0.875rem' }}>
                              {service.escalationPolicy.channels.email && (
                                <div>📧 Email: {service.escalationPolicy.channels.email}</div>
                              )}
                              {service.escalationPolicy.channels.jiraBoard && service.escalationPolicy.channels.jiraBoard.length > 0 && (
                                <div>
                                  🎫 Jira Board{service.escalationPolicy.channels.jiraBoard.length > 1 ? 's' : ''}:
                                  {service.escalationPolicy.channels.jiraBoard.map((board, index) => (
                                    <div key={index} style={{ marginLeft: '1rem' }}>
                                      • <Button
                                          variant="link"
                                          component="a"
                                          href={`${process.env.REACT_APP_DATA_DIR_URL || 'https://path/to/data'}${board.path}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          style={{ padding: 0, fontSize: 'inherit' }}
                                        >
                                          {board.name}
                                        </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {service.escalationPolicy.channels.pagerduty && (
                                <div>
                                  📟 PagerDuty: <Button
                                    variant="link"
                                    component="a"
                                    href={`${process.env.REACT_APP_DATA_DIR_URL || 'https://path/to/data'}${service.escalationPolicy.channels.pagerduty.path}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ padding: 0, fontSize: 'inherit' }}
                                  >
                                    {service.escalationPolicy.channels.pagerduty.name}
                                  </Button>
                                </div>
                              )}
                              {service.escalationPolicy.channels.slackUserGroup && service.escalationPolicy.channels.slackUserGroup.length > 0 && (
                                <div>
                                  💬 Slack User Group{service.escalationPolicy.channels.slackUserGroup.length > 1 ? 's' : ''}:
                                  {service.escalationPolicy.channels.slackUserGroup.map((group, index) => (
                                    <div key={index} style={{ marginLeft: '1rem' }}>
                                      • <Button
                                          variant="link"
                                          component="a"
                                          href={`${process.env.REACT_APP_DATA_DIR_URL || 'https://path/to/data'}${group.path}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          style={{ padding: 0, fontSize: 'inherit' }}
                                        >
                                          {group.name}
                                        </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {service.escalationPolicy.channels.nextEscalationPolicy && (
                                <div>⬆️ Next Escalation: {service.escalationPolicy.channels.nextEscalationPolicy.name}</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                )}
              </DescriptionList>
            </CardBody>
          </Card>
        </GridItem>

        {/* Service Owners */}
        <GridItem span={6}>
          <Card>
            <CardTitle>Service Owners</CardTitle>
            <CardBody>
              {service.serviceOwners?.length > 0 ? (
                <List>
                  {service.serviceOwners.map((owner, index) => (
                    <ListItem key={index}>
                      <strong>{owner.name}</strong>
                      {owner.email && (
                        <div>
                          <Button
                            variant="link"
                            component="a"
                            href={`mailto:${owner.email}`}
                            style={{ padding: 0 }}
                          >
                            {owner.email}
                          </Button>
                        </div>
                      )}
                    </ListItem>
                  ))}
                </List>
              ) : (
                <p>No service owners defined</p>
              )}
            </CardBody>
          </Card>
        </GridItem>

        {/* Grafana URLs */}
        {service.grafanaUrls && service.grafanaUrls.length > 0 && (
          <GridItem span={6}>
            <Card>
              <CardTitle>Monitoring</CardTitle>
              <CardBody>
                <List>
                  {service.grafanaUrls.map((grafana, index) => (
                    <ListItem key={index}>
                      <Button
                        variant="link"
                        component="a"
                        href={grafana.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        icon={<ExternalLinkAltIcon />}
                        iconPosition="right"
                      >
                        {grafana.title}
                      </Button>
                    </ListItem>
                  ))}
                </List>
              </CardBody>
            </Card>
          </GridItem>
        )}

        {/* SaaS Files */}
        {data?.saas_files_v2 && (
          <GridItem span={12}>
            <Card>
              <CardTitle>SaaS Files</CardTitle>
              <CardBody>
                <Table aria-label="SaaS Files table">
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Pipeline Runs</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data?.saas_files_v2?.length === 0 ? (
                      <Tr>
                        <Td colSpan={2} style={{ textAlign: 'center', padding: '2rem' }}>
                          No SaaS files found for this service
                        </Td>
                      </Tr>
                    ) : (
                      data?.saas_files_v2?.map((saasFile, index) => {
                      const pp_cluster_console_url = saasFile.pipelinesProvider?.namespace?.cluster?.consoleUrl;
                      const pp_ns_name = saasFile.pipelinesProvider?.namespace?.name;

                      let pipeline_template_name;
                      if (saasFile.pipelinesProvider?.pipelineTemplates) {
                        pipeline_template_name = saasFile.pipelinesProvider.pipelineTemplates.openshiftSaasDeploy?.name;
                      } else {
                        pipeline_template_name = saasFile.pipelinesProvider?.defaults?.pipelineTemplates?.openshiftSaasDeploy?.name;
                      }
                      const pipeline_name = pipeline_template_name ? `o-${pipeline_template_name}-${saasFile.name}` : null;

                      // Get unique environments from all targets
                      const environments = new Map();
                      saasFile.resourceTemplates?.forEach(template => {
                        template.targets?.forEach(target => {
                          if (target.namespace?.environment?.name) {
                            environments.set(target.namespace.environment.name, target.namespace.environment.name);
                          }
                        });
                      });

                      return (
                        <Tr key={index}>
                          <Td>
                            <Button
                              variant="link"
                              component="a"
                              href={`${process.env.REACT_APP_DATA_DIR_URL || 'https://path/to/data'}${saasFile.path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              icon={<ExternalLinkAltIcon />}
                              iconPosition="right"
                              style={{ padding: 0, fontSize: 'inherit' }}
                            >
                              {saasFile.name}
                            </Button>
                          </Td>
                          <Td>
                            {pp_cluster_console_url && pp_ns_name && pipeline_name && environments.size > 0 ? (
                              <List isPlain>
                                {Array.from(environments.values()).map((envName) => {
                                  const long_name = `${saasFile.name}-${envName}`;
                                  const short_name = long_name.substring(0, 56);

                                  return (
                                    <ListItem key={envName}>
                                      <Button
                                        variant="link"
                                        component="a"
                                        href={`${pp_cluster_console_url}/k8s/ns/${pp_ns_name}/tekton.dev~v1~Pipeline/${pipeline_name}/Runs?name=${short_name}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        icon={<ExternalLinkAltIcon />}
                                        iconPosition="right"
                                        style={{ padding: 0, fontSize: 'inherit' }}
                                      >
                                        {envName}
                                      </Button>
                                    </ListItem>
                                  );
                                })}
                              </List>
                            ) : (
                              '-'
                            )}
                          </Td>
                        </Tr>
                      );
                    })
                    )}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
          </GridItem>
        )}

        {/* Endpoints */}
        {service.endPoints && service.endPoints.length > 0 && (
          <GridItem span={12}>
            <Card>
              <CardTitle>Endpoints</CardTitle>
              <CardBody>
                <Table aria-label="Endpoints table">
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Description</Th>
                      <Th>URL</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {service.endPoints.map((endpoint, index) => (
                      <Tr key={index}>
                        <Td>{endpoint.name}</Td>
                        <Td>{endpoint.description || '-'}</Td>
                        <Td>
                          <Button
                            variant="link"
                            component="a"
                            href={endpoint.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            icon={<ExternalLinkAltIcon />}
                            iconPosition="right"
                          >
                            {endpoint.url}
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
          </GridItem>
        )}

        {/* Namespaces */}
        {service.namespaces && service.namespaces.length > 0 && (
          <GridItem span={12}>
            <Card>
              <CardTitle>Namespaces</CardTitle>
              <CardBody>
                <Toolbar>
                  <ToolbarContent>
                    <ToolbarItem>
                      <TextInput
                        name="namespaceSearch"
                        id="namespaceSearch"
                        type="search"
                        aria-label="Search namespaces"
                        placeholder="Search by namespace name, description, or cluster..."
                        value={namespaceSearchTerm}
                        onChange={(_event, value) => setNamespaceSearchTerm(value)}
                      />
                    </ToolbarItem>
                    <ToolbarItem align={{ default: 'alignEnd' }}>
                      <span style={{ color: 'var(--pf-v6-global--Color--200)' }}>
                        {filteredNamespaces.length} namespace{filteredNamespaces.length !== 1 ? 's' : ''} found
                      </span>
                    </ToolbarItem>
                  </ToolbarContent>
                </Toolbar>

                <Table aria-label="Namespaces table">
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Description</Th>
                      <Th>Cluster</Th>
                      <Th>Jump Host</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredNamespaces.map((namespace, index) => (
                      <Tr key={index}>
                        <Td>
                          <Link
                            to={`/namespace/${encodeURIComponent(namespace.path)}`}
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
                        <Td>{namespace.cluster.name}</Td>
                        <Td>{namespace.cluster.jumpHost?.hostname || '-'}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>

                {filteredNamespaces.length === 0 && namespaceSearchTerm && (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p>No namespaces found matching "{namespaceSearchTerm}"</p>
                  </div>
                )}
              </CardBody>
            </Card>
          </GridItem>
        )}

        {/* Code Components */}
        {service.codeComponents && service.codeComponents.length > 0 && (
          <GridItem span={12}>
            <Card>
              <CardTitle>Code Components</CardTitle>
              <CardBody>
                <Table aria-label="Code components table">
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Resource</Th>
                      <Th>URL</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {service.codeComponents.map((component, index) => (
                      <Tr key={index}>
                        <Td>{component.name}</Td>
                        <Td>{component.resource}</Td>
                        <Td>
                          <Button
                            variant="link"
                            component="a"
                            href={component.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            icon={<ExternalLinkAltIcon />}
                            iconPosition="right"
                            style={{ padding: 0, fontSize: 'inherit' }}
                          >
                            {component.url}
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
          </GridItem>
        )}

        {/* Child Apps */}
        {service.childrenApps && service.childrenApps.length > 0 && (
          <GridItem span={12}>
            <Card>
              <CardTitle>Child Applications</CardTitle>
              <CardBody>
                <Table aria-label="Child apps table">
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Description</Th>
                      <Th>Onboarding Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {service.childrenApps.map((child, index) => (
                      <Tr key={index}>
                        <Td>
                          <Link
                            to={`/service/${encodeURIComponent(child.path)}`}
                            style={{ textDecoration: 'none' }}
                          >
                            <Button
                              variant="link"
                              style={{ padding: 0 }}
                            >
                              {child.name}
                            </Button>
                          </Link>
                        </Td>
                        <Td>{child.description || '-'}</Td>
                        <Td>
                          <Label color={getStatusLabelColor(child.onboardingStatus)}>
                            {child.onboardingStatus}
                          </Label>
                        </Td>
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

export default Service;