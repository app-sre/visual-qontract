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
      networkPoliciesAllow {
        name
        cluster {
          name
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
          var namespace_name = namespace_info['name'];
          var cluster_name = namespace_info['cluster']['name'];
          var label = cluster_name + "/" + namespace_name;
          var node = { id: label, label: label };
          nodes.push(node);
          var network_policies = namespace_info['networkPoliciesAllow'];
          if (network_policies != null) {
            for (var np_namespace_info of network_policies) {
              var np_namespace_name = np_namespace_info['name'];
              var np_cluster_name = np_namespace_info['cluster']['name'];
              var np_label = np_cluster_name + "/" + np_namespace_name;
              var edge = { from: np_label, to: label };
              edges.push(edge);
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
