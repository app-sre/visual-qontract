import * as React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Page from '../components/Page';
import Reports from './elements/Reports';
import Report from './elements/Report';

const GET_REPORT = gql`
  query Report($path: String) {
    reports_v1(path: $path) {
      path
      app {
        path
        name
        escalationPolicy {
          name
          path
          description
        }
      }
      name
      date
      content
    }
    namespaces_v1 {
      name
      path
      cluster {
        name
        path
        consoleUrl
      }
    }
  }
`;

const GET_REPORTS = gql`
  query Reports {
    reports_v1 {
      path
      app {
        path
        name
      }
      name
      date
    }
  }
`;


const ReportsPage = ({ location }) => {
  const path = location.hash.substring(1);

  if (path) {
    return (
      <Query query={GET_REPORT} variables={{ path }}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return `Error! ${error.message}`;
          const report = data.reports_v1[0];
          const body = <Report report={report} namespaces={data.namespaces_v1} />;
          return <Page title={report.name} body={body} path={report.path} />;
        }}
      </Query>
    );
  }

  return (
    <Query query={GET_REPORTS}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;

        const body = <Reports reports={data.reports_v1} />;
        return <Page title="Reports" body={body} />;
      }}
    </Query>
  );
};

export default ReportsPage;
