import React from 'react';
import Definition from '../../components/Definition';

function Integration({ integration }) {
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
          ['Description', integration.description],
        ]}
      />
    </React.Fragment>
  );
}

export default Integration;
