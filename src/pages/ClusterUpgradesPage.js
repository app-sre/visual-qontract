import * as React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Page from '../components/Page';
import ClusterUpgrades from './elements/ClusterUpgrades';

const GET_CLUSTERS = gql`
  query Clusters {
    clusters_v1 {
      path
      name
      description
      spec {
        version
        channel
        upgrade
        id
        external_id
      }
    }
  }
`;

const ClustersPage = ({ location }) => {
  return (
    <Query query={GET_CLUSTERS}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;


        const body = <ClusterUpgrades clusters={data.clusters_v1} />;
        return <Page title="Cluster Upgrades" body={body} />;
      }}
    </Query>
  );
};

export default ClustersPage;
