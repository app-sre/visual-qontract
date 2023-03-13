import * as React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Page from '../components/Page';
import Scorecard from './elements/Scorecard';

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
};

export default ScoreCardPage;
