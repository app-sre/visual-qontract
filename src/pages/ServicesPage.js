import * as React from 'react';
import { Grid } from 'patternfly-react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Services from './elements/Services';
import Service from './elements/Service';

const GET_APP = gql`
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
    }
  }
`;

const GET_APPS = gql`
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

  let viewElement;
  if (path) {
    viewElement = (
      <Query query={GET_APP} variables={{ path }}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return `Error! ${error.message}`;
          return <Service service={data.apps_v1[0]} />;
        }}
      </Query>
    );
  } else {
    viewElement = (
      <Query query={GET_APPS}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return `Error! ${error.message}`;
          return <Services services={data.apps_v1} />;
        }}
      </Query>
    );
  }

  return (
    <Grid fluid className="container-pf-nav-pf-vertical">
      <Grid.Row>
        <Grid.Col xs={12}>
          <div className="page-header">
            <h1>Services</h1>
          </div>
        </Grid.Col>
      </Grid.Row>
      {viewElement}
    </Grid>
  );
};

export default ServicesPage;
