import React from 'react';
import Definition from '../../components/Definition';
import { Link } from 'react-router-dom';

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
          ['Health', <a href={`${namespace.cluster.grafanaUrl}/d/85a562078cdf77779eaa1add43ccec1e?var-namespace=${namespace.name}`} target={`_blank`}>Grafana</a>],
        ]}
      />

      <h4>Description</h4>
      {namespace.description}
    </React.Fragment>
  );
}

export default Namespace;
