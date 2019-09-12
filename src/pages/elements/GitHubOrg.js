import React from 'react';
import { List, ListItem } from '@patternfly/react-core';
import Definition from '../../components/Definition';

function GitHubOrg({ githuborg }) {
  const listItems = githuborg.managedTeams && githuborg.managedTeams.map(a => <ListItem> {a} </ListItem>);
  return (
    <React.Fragment>
      <h4>Info</h4>
      <Definition
        items={[
          ['Name', githuborg.name],
          [
            'Path',
            <a href={`${window.DATA_DIR_URL}${githuborg.path}`} target="_blank" rel="noopener noreferrer">
              {githuborg.path}
            </a>
          ],
          ['Description', githuborg.description],
          [
            'URL',
            <a href={`${githuborg.url}`} target="_blank" rel="noopener noreferrer">
              {githuborg.url}
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

export default GitHubOrg;
