import * as React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Page from '../components/Page';
import AWSAccounts from './elements/AWSAccounts';
import AWSAccount from './elements/AWSAccount';

const GET_AWSACCOUNT = gql`
  query AWSAccount($path: String) {
    awsaccounts_v1(path: $path) {
      path
      name
      description
      consoleUrl
    }
  }
`;

const GET_AWSACCOUNTS = gql`
  query AWSAccounts {
    awsaccounts_v1 {
      path
      name
      description
    }
  }
`;

const AWSAccountsPage = ({ location }) => {
  const path = location.hash.substring(1);
  if (path) {
    return (
      <Query query={GET_AWSACCOUNT} variables={{ path }}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return `Error! ${error.message}`;
          const awsaccount = data.awsaccounts_v1[0];
          const body = <AWSAccount awsaccount={awsaccount} />;
          return <Page title={awsaccount.name} body={body} path={awsaccount.path} />;
        }}
      </Query>
    );
  }

  return (
    <Query query={GET_AWSACCOUNTS}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;
        const body = <AWSAccounts awsaccounts={data.awsaccounts_v1} />;
        return <Page title="AWS Accounts" body={body} />;
      }}
    </Query>
  );
};

export default AWSAccountsPage;
