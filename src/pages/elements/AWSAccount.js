import React from 'react';
import Definition from '../../components/Definition';

function AWSAccount({ awsaccount }) {
  const ac = awsaccount;
  return (
    <React.Fragment>
      <h4>Info</h4>
      <Definition
        items={[
          ['Name', ac.name],
          [
            'Path',
            <a href={`${window.DATA_DIR_URL}${ac.path}`} target="_blank" rel="noopener noreferrer">
              {ac.path}
            </a>
          ],
          [
            'Console URL',
            <a href={ac.consoleUrl} target="_blank" rel="noopener noreferrer">
              {ac.consoleUrl}
            </a>
          ]
        ]}
      />

      <h4>Description</h4>
      {ac.description}
    </React.Fragment>
  );
}

export default AWSAccount;
