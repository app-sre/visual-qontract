import React from 'react';
import { Link } from 'react-router-dom';
import GrafanaUrl from './GrafanaUrl';
import Definition from '../../components/Definition';

function Namespace({ namespace }) {
  return (
    <React.Fragment>
      <h4>Info</h4>
      <Definition
        items={[
          ['Name', namespace.name],
          ['Path', <a href={`${window.DATA_DIR_URL}${namespace.path}`}>{namespace.path}</a>],
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
          [
            'Grafana',
            <GrafanaUrl
              jumpHost={namespace.cluster.jumpHost}
              cluster={namespace.cluster.name}
              namespace={namespace.name}
            />
          ]
        ]}
      />

      <h4>Description</h4>
      {namespace.description}
    </React.Fragment>
  );
}

export default Namespace;
