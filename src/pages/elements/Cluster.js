import React from 'react';
import Definition from '../../components/Definition';
import Namespaces from './Namespaces';

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
      <Namespaces namespaces={cluster.namespaces} />
    </React.Fragment>
  );
}

export default Cluster;
