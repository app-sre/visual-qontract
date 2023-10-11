import * as React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Page from '../components/Page';
import Dependencies from './elements/Dependencies';
import Dependency from './elements/Dependency';

const GET_DEPENDENCY = gql`
  query Dependency($path: String) {
    dependencies_v1(path: $path) {
      path
      name
      description
      statefulness
      opsModel
      statusPage
      SLA
      dependencyFailureImpact
      monitoring {
        url
      }
    }
  }
`;

const GET_DEPENDENCIES = gql`
  query Dependencies {
    dependencies_v1 {
      path
      name
      description
      statefulness
      opsModel
      statusPage
      SLA
      dependencyFailureImpact
      monitoring {
        url
      }
    }
  }
`;

const DependenciesPage = ({ location }) => {
  const path = location.hash.substring(1);

  if (path) {
    return (
      <Query query={GET_DEPENDENCY} variables={{ path }}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return `Error! ${error.message}`;

          const dependency = data.dependencies_v1[0];
          const body = <Dependency dependency={dependency} />;
          return <Page title={dependency.name} body={body} path={dependency.path} />;
        }}
      </Query>
    );
  }

  return (
    <Query query={GET_DEPENDENCIES}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;

        const body = <Dependencies dependencies={data.dependencies_v1} />;
        return <Page title="Dependencies" body={body} />;
      }}
    </Query>
  );
};

export default DependenciesPage;
