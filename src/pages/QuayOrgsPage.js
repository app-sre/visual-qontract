import * as React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Page from '../components/Page';
import QuayOrgs from './elements/QuayOrgs';
import QuayOrg from './elements/QuayOrg';

const GET_QUAYORG = gql`
  query QuayOrg($path: String) {
    quay_orgs_v1(path: $path) {
      path
      name
      description
      managedTeams
    }
  }
`;

const GET_QUAYORGS = gql`
  query QuayOrgs {
    quay_orgs_v1 {
      path
      name
      description
    }
  }
`;

const QuayOrgsPage = ({ location }) => {
  const path = location.hash.substring(1);

  if (path) {
    return (
      <Query query={GET_QUAYORG} variables={{ path }}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return `Error! ${error.message}`;

          const quayorg = data.quay_orgs_v1[0];
          const body = <QuayOrg quayorg={quayorg} />;
          return <Page title={quayorg.name} body={body} path={quayorg.path} />;
        }}
      </Query>
    );
  }

  return (
    <Query query={GET_QUAYORGS}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;

        const body = <QuayOrgs quayorgs={data.quay_orgs_v1} />;
        return <Page title="Quay organizations" body={body} />;
      }}
    </Query>
  );
};

export default QuayOrgsPage;
