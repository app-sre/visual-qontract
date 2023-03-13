import * as React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Page from '../components/Page';
import Scorecard from './elements/Scorecard';
import Scorecards from './elements/Scorecards';

const GET_SCORECARDS = gql`
  query Scorecards {
    scorecards_v2 {
        path
        app {
            name
            path
        }
    }
  }
`;

const GET_SCORECARD = gql`
  query Scorecard($path: String) {
    scorecards_v2(path: $path) {
        path
        app {
            name
        }
        acceptanceCriteria {
            name
            status
            comment
        }
    }
  }
`;

const ScoreCardPage = ({ location }) => {
  const path = location.hash.substring(1);

  if (path) {
    return (
      <Query query={GET_SCORECARD} variables={{ path }}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return `Error! ${error.message}`;

          const scorecard = data.scorecards_v2[0];
          const body = <Scorecard scorecard={scorecard} />;
          return <Page title={scorecard.app.name} body={body} path={scorecard.path} />;
        }}
      </Query>
    );
  }

  return (
    <Query query={GET_SCORECARDS}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;

        const body = <Scorecards scorecards={data.scorecards_v2} />;
        return <Page title="Scorecards" body={body} />;
      }}
    </Query>
  );

};

export default ScoreCardPage;
