import React from 'react';
import Definition from '../../components/Definition';

function JenkinsInstance({ instance }) {
  return (
    <React.Fragment>
      <h4>Info</h4>
      <Definition
        items={[
          ['Instance name', instance.name],
          [
            'Path',
            <a href={`${window.DATA_DIR_URL}${instance.path}`} target="_blank" rel="noopener noreferrer">
              {instance.path}
            </a>
          ],
          ['Description', instance.description],
          [
            'Server URL',
            <a href={`${instance.serverUrl}`} target="_blank" rel="noopener noreferrer">
              {instance.serverUrl}
            </a>
          ]
        ]}
      />
    </React.Fragment>
  );
}

export default JenkinsInstance;
