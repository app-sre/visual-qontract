import * as React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Page from '../components/Page';
import Users from './elements/Users';
import User from './elements/User';

const GET_USER = gql`
  query User($path: String) {
    users_v1(path: $path) {
      path
      name
      redhat_username
      github_username
      quay_username
      public_gpg_key
      roles {
        path
        name
      }
    }
  }
`;

const GET_USERS = gql`
  query Users {
    users_v1 {
      path
      name
      redhat_username
      github_username
      quay_username
      public_gpg_key
    }
  }
`;

const UsersPage = props => {
  const path = props.location.hash.substring(1);

  if (path) {
    return (
      <Query query={GET_USER} variables={{ path }}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return `Error! ${error.message}`;

          const user = data.users_v1[0];
          const body = <User user={user} />;
          return <Page title={user.name} body={body} path={user.path} />;
        }}
      </Query>
    );
  }

  return (
    <Query query={GET_USERS}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;

        const body = <Users users={data.users_v1} />;
        return <Page title="Users" body={body} />;
      }}
    </Query>
  );
};

export default UsersPage;
