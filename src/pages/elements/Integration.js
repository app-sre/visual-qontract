import React from 'react';
import Definition from '../../components/Definition';

function Integration({ integration }) {
  const usage = integration.usage.split('\n').map((i, key) => <div key={key}>{i}</div>);
  return (
    <React.Fragment>
      <h4>Info</h4>
      <Definition
        items={[
          ['Integration', integration.name],
          [
            'Path',
            <a href={`${window.DATA_DIR_URL}${integration.path}`} target="_blank" rel="noopener noreferrer">
              {integration.path}
            </a>
          ],
          [
            'Upstream',
            <a href={integration.upstream} target="_blank" rel="noopener noreferrer">
              {integration.upstream}
            </a>
          ],
          ['Short Description', integration.shortDescription]
        ]}
      />
      <h4> Usage </h4>
      <pre>{usage}</pre>
    </React.Fragment>
  );
}

export default Integration;
