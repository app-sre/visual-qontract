import React from 'react';
import Definition from '../../components/Definition';
import Namespaces from './Namespaces';
import GrafanaUrl from './GrafanaUrl';
import Roles from './Roles';

function Cluster({ cluster, roles }) {
  function matches(r) {
    const a = r.access;
    if (a === null) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== undefined && a[i].cluster && a[i].cluster.name === cluster.name) {
        return true;
      }
    }
    return false;
  }
  const matchedData = roles.filter(matches);
  const grafana = <GrafanaUrl jumpHost={cluster.jumpHost} cluster={cluster.name} url={cluster.grafanaUrl} />;
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
          [
            'Console',
            <a href={`${cluster.consoleUrl}`} target="_blank" rel="noopener noreferrer">
              {cluster.consoleUrl}
            </a>
          ],
          [
            'Kibana',
            <a href={`${cluster.kibanaUrl}`} target="_blank" rel="noopener noreferrer">
              {cluster.kibanaUrl}
            </a>
          ],
          ['Grafana', grafana]
        ]}
      />

      <h4>Description</h4>
      {cluster.description}

      <h4>Namespaces</h4>
      <Namespaces namespaces={cluster.namespaces} />
      {matchedData.length > 0 && (
        <React.Fragment>
          <h4> Roles </h4>
          <Roles roles={matchedData} />
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default Cluster;
