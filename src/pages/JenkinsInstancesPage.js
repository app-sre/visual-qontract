import * as React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Page from '../components/Page';
import JenkinsInstances from './elements/JenkinsInstances';
import JenkinsInstance from './elements/JenkinsInstance';

const GET_INSTANCE = gql`
  query JenkinsInstance($path: String) {
    jenkins_instances_v1(path: $path) {
      path
      name
      description
      serverUrl
    }
  }
`;

const GET_INSTANCES = gql`
  query JenkinsInstances {
    jenkins_instances_v1 {
      path
      name
      description
      serverUrl
    }
  }
`;

const JenkinsInstancesPage = ({ location }) => {
  const path = location.hash.substring(1);

  if (path) {
    return (
      <Query query={GET_INSTANCE} variables={{ path }}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return `Error! ${error.message}`;

          const instance = data.jenkins_instances_v1[0];
          const body = <JenkinsInstance instance={instance} />;
          return <Page title={instance.name} body={body} path={instance.path} />;
        }}
      </Query>
    );
  }

  return (
    <Query query={GET_INSTANCES}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;

        const body = <JenkinsInstances instances={data.jenkins_instances_v1} />;
        return <Page title="Jenkins Instances" body={body} />;
      }}
    </Query>
  );
};

export default JenkinsInstancesPage;
