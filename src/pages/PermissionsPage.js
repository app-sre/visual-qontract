import * as React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Page from '../components/Page';
import Permissions from './elements/Permissions';
import Permission from './elements/Permission';

const GET_PERMISSION = gql`
  query Permission($path: String) {
    permissions_v1(path: $path) {
      path
      name
      description
      service
    }
    roles_v1 {
      name
      path
      description
      permissions {
        name
      }
      users {
        name
      }
    }
  }
`;

const GET_PERMISSIONS = gql`
  query Permissions {
    permissions_v1 {
      path
      name
      description
      service
    }
  }
`;

const PermissionsPage = ({ location }) => {
  const path = location.hash.substring(1);
  if (path) {
    return (
      <Query query={GET_PERMISSION} variables={{ path }}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return `Error! ${error.message}`;

          const permission = data.permissions_v1[0];
          const roles = data.roles_v1;
          const body = <Permission permission={permission} roles={roles} />;
          return <Page title={permission.name} body={body} path={permission.path} />;
        }}
      </Query>
    );
  }
  return (
    <Query query={GET_PERMISSIONS}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;

        const body = <Permissions permissions={data.permissions_v1} />;
        return <Page title="Permissions" body={body} />;
      }}
    </Query>
  );
};

export default PermissionsPage;
