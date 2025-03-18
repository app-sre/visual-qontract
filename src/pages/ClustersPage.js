import * as React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Page from '../components/Page';
import Clusters from './elements/Clusters';
import Cluster from './elements/Cluster';

const GET_CLUSTER = gql`
  query Cluster($path: String) {
    clusters_v1(path: $path) {
      path
      name
      spec {
        product
        version
        channel
        hypershift
      }
      description
      consoleUrl
      kibanaUrl
      prometheusUrl
      alertmanagerUrl
      grafanaUrl
      jumpHost {
        hostname
      }
      network {
        vpc
        service
        pod
      }
      namespaces {
        path
        name
        description
        grafanaUrl
        cluster {
          name
          jumpHost {
            hostname
          }
        }
      }
      upgradePolicy {
        schedule
        workloads
        conditions {
          soakDays
        }
      }
    }
    roles_v1 {
      path
      name
      description
      access {
        cluster {
          path
          name
        }
        group
      }
    }
  }
`;

const GET_CLUSTERS = gql`
  query Clusters {
    clusters_v1 {
      path
      name
      description
      consoleUrl
      kibanaUrl
      prometheusUrl
      grafanaUrl
      jumpHost {
        hostname
      }
      namespaces {
        path
        name
        description
        grafanaUrl
        cluster {
          name
          path
        }
      }
      spec {
        version
        channel
        id
        external_id
      }
      upgradePolicy {
        schedule
        workloads
        conditions {
          soakDays
        }
      }
    }
    apps_v1 {
      name
      path
      parentApp {
        name
      }
      namespaces {
        cluster {
          path
        }
      }
    }
  }
`;

const ClustersPage = ({ location }) => {
  const path = location.hash.substring(1);

  if (path) {
    return (
      <Query query={GET_CLUSTER} variables={{ path }}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return `Error! ${error.message}`;

          const cluster = data.clusters_v1[0];
          const roles = data.roles_v1;
          const body = <Cluster cluster={cluster} roles={roles} />;
          return <Page title={cluster.name} body={body} path={cluster.path} />;
        }}
      </Query>
    );
  }

  return (
    <Query query={GET_CLUSTERS}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;

        const clusterApps = data.apps_v1.reduce((acc, app) => {
          if (app.parentApp == null && app.namespaces) {
            app.namespaces.forEach(ns => {
              if (ns.cluster.path in acc) {
                if (!acc[ns.cluster.path].includes(app.name)) {
                  acc[ns.cluster.path].push(app.name);
                }
              } else {
                acc[ns.cluster.path] = [app.name];
              }
            });
          }
          return acc;
        }, {});

        const clusters = data.clusters_v1.map(cluster => {
          if (cluster.path in clusterApps) {
            cluster.apps = clusterApps[cluster.path];
          } else {
            cluster.apps = [];
          }
          return cluster;
        });

        const body = <Clusters clusters={clusters} apps={data.apps_v1} />;
        return <Page title="Clusters" body={body} />;
      }}
    </Query>
  );
};

export default ClustersPage;
