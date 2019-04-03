import React from 'react';
import Definition from '../../components/Definition';
import { Link } from 'react-router-dom';

function Cluster({ cluster }) {
  return (
    <React.Fragment>
      <h4>Info</h4>
      <Definition
        items={[
          ['Cluster', cluster.name],
          ['Path', <a href={`${window.DATA_DIR_URL}${cluster.path}`}>{cluster.path}</a>]
        ]}
      />

      <h4>Description</h4>
      {cluster.description}

      <h4>Namespaces</h4>
      {cluster.namespaces.map(ns => (
        <li>
          <Link
            to={{
              pathname: '/namespaces',
              hash: ns.path
            }}
          >
            {ns.name}
          </Link>
        </li>
      ))}
    </React.Fragment>
  );
}

export default Cluster;
