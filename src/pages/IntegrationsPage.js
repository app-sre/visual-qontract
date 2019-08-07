import * as React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Page from '../components/Page';
import Integrations from './elements/Integrations';
import Integration from './elements/Integration';

const GET_INTEGRATION = gql`
  query Integration($path: String) {
    integrations_v1(path: $path) {
      path
      name
      description
      shortDescription
      usage
      upstream
    }
  }
`;

const GET_INTEGRATIONS = gql`
  query Integrations {
    integrations_v1 {
      path
      name
      description
      shortDescription
      usage
      upstream
    }
  }
`;

const IntegrationsPage = ({ location }) => {
  const path = location.hash.substring(1);

  if (path) {
    return (
      <Query query={GET_INTEGRATION} variables={{ path }}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return `Error! ${error.message}`;

          const integration = data.integrations_v1[0];
          const body = <Integration integration={integration} />;
          return <Page title={integration.name} body={body} path={integration.path} />;
        }}
      </Query>
    );
  }

  return (
    <Query query={GET_INTEGRATIONS}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;

        const body = <Integrations integrations={data.integrations_v1} />;
        return <Page title="Integrations" body={body} />;
      }}
    </Query>
  );
};

export default IntegrationsPage;
