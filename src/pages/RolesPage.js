import * as React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Page from '../components/Page';
import Roles from './elements/Roles';
import Role from './elements/Role';

const GET_ROLE = gql`
  query Role($path: String) {
    roles_v1(path: $path) {
      path
      name
      description
      permissions {
        path
        name
        description
        service
      }
      access {
        namespace {
          path
          name
          cluster {
            name
          }
        }
        role
      }
      users {
        path
        name
        org_username
        github_username
        quay_username
      }
      bots {
        path
        name
      }
    }
  }
`;

const GET_ROLES = gql`
  query Roles {
    roles_v1 {
      path
      name
      description
    }
  }
`;

const RolesPage = ({ location }) => {
  const path = location.hash.substring(1);

  if (path) {
    return (
      <Query query={GET_ROLE} variables={{ path }}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return `Error! ${error.message}`;

          const role = data.roles_v1[0];
          const body = <Role role={role} />;
          return <Page title={role.name} body={body} path={role.path} />;
        }}
      </Query>
    );
  }

  return (
    <Query query={GET_ROLES}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;

        const body = <Roles roles={data.roles_v1} />;
        return <Page title="Roles" body={body} />;
      }}
    </Query>
  );
};

export default RolesPage;
