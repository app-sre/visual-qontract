import * as React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Page from '../components/Page';
import Services from './elements/Services';
import Service from './elements/Service';

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
        imageBuildUrl
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

const GET_SERVICES = gql`
  query Apps {
    apps_v1 {
      path
      name
      description
      onboardingStatus
      parentApp {
        name
        path
      }
      serviceOwners {
        name
      }
    }
  }
`;

const ServicesPage = ({ location }) => {
  const path = location.hash.substring(1);

  if (path) {
    return (
      <Query query={GET_SERVICE} variables={{ path }}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return `Error! ${error.message}`;

          const service = data.apps_v1[0];
          const reports = data.reports_v1;
          const scorecards = data.scorecards_v2;
          const { saas_files_v2 } = data;
          const body = (
            <Service service={service} reports={reports} saas_files_v2={saas_files_v2} scorecards={scorecards} />
          );
          return <Page title={service.name} body={body} path={service.path} />;
        }}
      </Query>
    );
  }

  return (
    <Query query={GET_SERVICES}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;

        const services = data.apps_v1;

        const body = <Services services={services} />;
        return <Page title="Services" body={body} />;
      }}
    </Query>
  );
};

export default ServicesPage;
