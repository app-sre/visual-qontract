import * as React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Page from '../components/Page';
import AppChangelog from './elements/AppChangelog';
import AppChangelogs from './elements/AppChangelogs';

const GET_APP_CHANGELOG = gql`
  query AppChangelog($path: String) {
    app_changelog_v1(path: $path) {
      path
      app {
        name
      }
      changelog {
        date
        changes {
          tags
          description
        }
      }
    }
  }
`;

const GET_APP_CHANGELOGS = gql`
  query AppChangelogs {
    app_changelog_v1 {
      path
      app {
        name
      }
      changelog {
        date
        changes {
          tags
          description
        }
      }
    }
  }
`;

const AppChangelogsPage = ({ location }) => {
  const path = location.hash.substring(1);

  if (path) {
    return (
      <Query query={GET_APP_CHANGELOG} variables={{ path }}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return `Error! ${error.message}`;

          const app_changelog = data.app_changelog_v1[0];
          const body = <AppChangelog appChangelog={app_changelog} />;
          return (
            <Page title={`Service Changelogs for ${app_changelog.app.name}`} body={body} path={app_changelog.path} />
          );
        }}
      </Query>
    );
  }

  return (
    <Query query={GET_APP_CHANGELOGS}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;

        const latestAppChangelogs = data.app_changelog_v1.map(appchangelog => {
          const latestAppChangelog = appchangelog.changelog.reduce(
            (latest, change) => (new Date(change.date) > new Date(latest.date) ? change : latest),
            appchangelog.changelog[0]
          );
          return { ...appchangelog, latestAppChangelog };
        });

        const body = <AppChangelogs latestAppChangelogs={latestAppChangelogs} />;
        return <Page title="Service Changelogs" body={body} />;
      }}
    </Query>
  );
};

export default AppChangelogsPage;
