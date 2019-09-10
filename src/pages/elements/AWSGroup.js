import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem } from '@patternfly/react-core';
import Definition from '../../components/Definition';

function AWSGroup({ awsgroup }) {
  const listItems = awsgroup.policies.map(a => <ListItem> {a} </ListItem>);
  const ac = awsgroup.account;
  return (
    <React.Fragment>
      <h4>Description</h4>
      {awsgroup.description}
      <h4> Account </h4>
      <Definition
        items={[
          [
            'Name',
            <Link
              to={{
                pathname: '/awsaccounts',
                hash: ac.path
              }}
            >
              {ac.name}
            </Link>
          ],
          ['Description', ac.description],
          [
            'consoleUrl',
            <a href={ac.consoleUrl} target="_blank" rel="noopener noreferrer">
              Link
            </a>
          ]
        ]}
      />
      <h4> Policies </h4>
      <List className="policyList">{listItems}</List>
    </React.Fragment>
  );
}

export default AWSGroup;
