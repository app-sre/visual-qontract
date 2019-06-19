import * as React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Page from '../components/Page';
import AWSGroups from './elements/AWSGroups';
import AWSGroup from './elements/AWSGroup';

const GET_AWSGROUP = gql`
  query AWSGroup($path: String) {
    awsgroups_v1(path: $path) {
      name
      description
      account {
        name
      }
      policies
    }
  }
`;

const GET_AWSGROUPS = gql`
  query AWSGroups {
    awsgroups_v1 {
      name
      description
      account {
        name
      }
      policies
    }
  }
`;

const AWSGroupsPage = ({ location }) => {
  const path = location.hash.substring(1);
  if (path) {
    return (
      <Query query={GET_AWSGROUP} variables={{ path }}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return `Error! ${error.message}`;
          const awsgroup = data.awsgroups_v1[0];
          const body = <AWSGroup awsgroup={awsgroup} />;
          return <Page title={awsgroup.name} body={body} path={awsgroup.name} />;
        }}
      </Query>
    );
  }

  return (
    <Query query={GET_AWSGROUPS}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;
        const body = <AWSGroups awsgroups={data.awsgroups_v1} />;
        return <Page title="AWS Groups" body={body} />;
      }}
    </Query>
  );
};

export default AWSGroupsPage;
