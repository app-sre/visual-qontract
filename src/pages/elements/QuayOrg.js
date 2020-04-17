import React from 'react';
import { List, ListItem } from '@patternfly/react-core';
import Definition from '../../components/Definition';

function QuayOrg({ quayorg }) {
  const listItems = quayorg.managedTeams && quayorg.managedTeams.map(a => <ListItem> {a} </ListItem>);
  return (
    <React.Fragment>
      <h4>Info</h4>
      <Definition
        items={[
          ['Name', quayorg.name],
          [
            'Path',
            <a href={`${window.DATA_DIR_URL}${quayorg.path}`} target="_blank" rel="noopener noreferrer">
              {quayorg.path}
            </a>
          ],
          ['Description', quayorg.description],
          [
            'URL',
            <a href={`https://quay.io/${quayorg.name}`} target="_blank" rel="noopener noreferrer">
              https://quay.io/{quayorg.name}
            </a>
          ]
        ]}
      />
      {listItems && (
        <React.Fragment>
          <h4> Managed teams </h4>
          <List className="policyList">{listItems}</List>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default QuayOrg;
