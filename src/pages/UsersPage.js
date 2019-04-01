import * as React from 'react';
import { Grid } from 'patternfly-react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Users from './elements/Users';
import User from './elements/User';

const GET_USERS = gql`
  query Users($path: String) {
    users_v1(path: $path) {
      path
      name
      redhat_username
      github_username
      quay_username
    }
  }
`;

const UsersPage = props => {
  const path = props.location.hash.substring(1);

  let viewElement;
  if (path) {
    viewElement = (
      <Query query={GET_USERS} variables={{ path }}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return `Error! ${error.message}`;
          return <User user={data.users_v1[0]} />;
        }}
      </Query>
    );
  } else {
    viewElement = (
      <Query query={GET_USERS}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return `Error! ${error.message}`;
          return <Users users={data.users_v1} />;
        }}
      </Query>
    );
  }

  return (
    <Grid fluid className="container-pf-nav-pf-vertical">
      <Grid.Row>
        <Grid.Col xs={12}>
          <div className="page-header">
            <h1>Users</h1>
          </div>
        </Grid.Col>
      </Grid.Row>
      {viewElement}
    </Grid>
  );
};

export default UsersPage;
