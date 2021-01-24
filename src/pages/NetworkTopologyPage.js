import * as React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Graph from 'vis-react';

const GET_NAMESPACES = gql`
  query Namespaces {
    namespaces_v1 {
      name
      cluster {
        name
      }
      environment {
        name
        product {
          name
        }
      }
      networkPoliciesAllow {
        name
        cluster {
          name
        }
      }
      openshiftServiceAccountTokens {
        namespace {
          name
          cluster {
            name
          }
        }
      }
    }
  }
`;
function NetworkTopologyPage() {
  return (
    <Query query={GET_NAMESPACES}>
      {({ loading, error, data }) => {
        if (loading)
          return 'Loading...';
        if (error)
          return `Error! ${error.message}`;
        const namespaces = data.namespaces_v1;

        var nodes = [];
        var edges = [];
        for (var namespace_info of namespaces) {
          var environment = namespace_info['environment'];
          var product_name = environment['product']['name']
          var namespace_name = namespace_info['name'];
          var cluster_name = namespace_info['cluster']['name'];
          var environment_name = environment['name']
          var label = ('environment: ' + environment_name + '\n' +
                       'cluster: ' + cluster_name + "\n" +
                       'namespace: ' + namespace_name);
          var id = cluster_name + namespace_name
          var node = { id: id, label: label };
          nodes.push(node);
          var network_policies = namespace_info['networkPoliciesAllow'];
          if (network_policies !== null) {
            for (var np_namespace_info of network_policies) {
              var np_namespace_name = np_namespace_info['name'];
              var np_cluster_name = np_namespace_info['cluster']['name'];
              var np_id = np_cluster_name + np_namespace_name;
              var np_edge = { from: np_id, to: id };
              edges.push(np_edge);
            }
          }
          var openshift_service_account_tokens = namespace_info['openshiftServiceAccountTokens'];
          if (openshift_service_account_tokens !== null) {
            for (var sa_token of openshift_service_account_tokens) {
              var sa_namespace_info = sa_token['namespace']
              var sa_namespace_name = sa_namespace_info['name'];
              var sa_cluster_name = sa_namespace_info['cluster']['name'];
              var sa_id = sa_cluster_name + sa_namespace_name;
              var sa_edge = { from: id, to: sa_id };
              edges.push(sa_edge);
            }
          }
        }

        var graph = {
          nodes: nodes,
          edges: edges
        };

        var options = {
          layout: {
            hierarchical: true
          },
          edges: {
            color: '#000000'
          },
          interaction: { hoverEdges: true }
        };

        return <Graph graph={graph} options={options} />;
      } }
    </Query>
  );
}

export default NetworkTopologyPage;
