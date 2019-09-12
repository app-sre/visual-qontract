import * as React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Page from '../components/Page';
import GitHubOrgs from './elements/GitHubOrgs';
import GitHubOrg from './elements/GitHubOrg';

const GET_GITHUBORG = gql`
  query GitHubOrg($path: String) {
    githuborg_v1(path: $path) {
      path
      name
      description
      url
      managedTeams
    }
  }
`;

const GET_GITHUBORGS = gql`
  query GitHubOrgs {
    githuborg_v1 {
      path
      name
      description
    }
  }
`;

const GitHubOrgsPage = ({ location }) => {
  const path = location.hash.substring(1);

  if (path) {
    return (
      <Query query={GET_GITHUBORG} variables={{ path }}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return `Error! ${error.message}`;

          const githuborg = data.githuborg_v1[0];
          const body = <GitHubOrg githuborg={githuborg} />;
          return <Page title={githuborg.name} body={body} path={githuborg.path} />;
        }}
      </Query>
    );
  }

  return (
    <Query query={GET_GITHUBORGS}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;

        const body = <GitHubOrgs githuborgs={data.githuborg_v1} />;
        return <Page title="GitHub organizations" body={body} />;
      }}
    </Query>
  );
};

export default GitHubOrgsPage;
