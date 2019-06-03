import React from 'react';
import Definition from '../../components/Definition';
import Namespaces from './Namespaces';
import GrafanaUrl from './GrafanaUrl';

function Cluster({ cluster }) {
  let grafana;
  if (cluster.grafanaUrl !== null) {
    grafana = (
      <a href={cluster.grafanaUrl} target="_blank" rel="noopener noreferrer">
        Link
      </a>
    );
  } else {
    grafana = <GrafanaUrl jumpHost={cluster.jumpHost} cluster={cluster.name} />;
  }
  return (
    <React.Fragment>
      <h4>Info</h4>
      <Definition
        items={[
          ['Cluster', cluster.name],
          [
            'Path',
            <a href={`${window.DATA_DIR_URL}${cluster.path}`} target="_blank" rel="noopener noreferrer">
              {cluster.path}
            </a>
          ],
          ['Grafana', grafana]
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
