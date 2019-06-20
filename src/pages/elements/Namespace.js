import React from 'react';
import { Link } from 'react-router-dom';
import GrafanaUrl from './GrafanaUrl';
import Definition from '../../components/Definition';
import Roles from './Roles';

function Namespace({ namespace, roles }) {
  function matches(r) {
    let p = r.permissions;
    for (let i = 0; i < p.length; p++) {
      if (p[i].namespace !== undefined && p[i].namespace === namespace.name) {
        return true;
      }
    }
    return false;
  }
  const matchedData = roles.filter(matches);
  const grafana = (
    <GrafanaUrl
      jumpHost={namespace.cluster.jumpHost}
      cluster={namespace.cluster.name}
      namespace={namespace.name}
      url={namespace.grafanaUrl}
    />
  );
  return (
    <React.Fragment>
      <h4>Info</h4>
      <Definition
        items={[
          ['Name', namespace.name],
          [
            'Path',
            <a href={`${window.DATA_DIR_URL}${namespace.path}`} target="_blank" rel="noopener noreferrer">
              {namespace.path}
            </a>
          ],
          [
            'Cluster',
            <Link
              to={{
                pathname: '/clusters',
                hash: namespace.cluster.path
              }}
            >
              {namespace.cluster.name}
            </Link>
          ],
          ['Grafana', grafana]
        ]}
      />

      <h4>Description</h4>
      {namespace.description}

      {matchedData.length > 0 && (
        <React.Fragment>
          <h4> Roles </h4>
          <Roles roles={matchedData} />
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default Namespace;
