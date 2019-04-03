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
      serviceDocs
      serviceOwner {
        name
        email
      }
      performanceParameters {
        SLO
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
    }
  }
`;

const GET_SERVICES = gql`
  query Apps {
    apps_v1 {
      path
      name
      description
      performanceParameters {
        SLO
      }
    }
  }
`;

const ServicesPage = props => {
  const path = props.location.hash.substring(1);

  if (path) {
    return (
      <Query query={GET_SERVICE} variables={{ path }}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return `Error! ${error.message}`;

          const service = data.apps_v1[0];
          const body = <Service service={service} />;
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

        const body = <Services services={data.apps_v1} />;
        return <Page title="Services" body={body} />;
      }}
    </Query>
  );
};

export default ServicesPage;
