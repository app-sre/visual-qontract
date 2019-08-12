import React from 'react';
import Markdown from 'react-markdown';
import Definition from '../../components/Definition';

function Integration({ integration }) {
  console.log(integration.usage);
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
      <h4>Description</h4>
      {integration.description}
      <h4> Usage </h4>
      <Markdown source={integration.usage} />
    </React.Fragment>
  );
}

export default Integration;
