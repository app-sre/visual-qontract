import React from 'react';
import Definition from '../../components/Definition';

import Users from './Users';
import Permissions from './Permissions';

function Role({ role }) {
  return (
    <React.Fragment>
      <h4>Info</h4>
      <Definition
        items={[['Name', role.name], ['Path', <a href={`${window.DATA_DIR_URL}${role.path}`}>{role.path}</a>]]}
      />

      <h4>Description</h4>
      {role.description || '-'}

      {role.access && (
        <React.Fragment>
          <h4>Namespace Access</h4>
          <ul>
            {role.access.map(a => (
              <li>
                <a href={`${window.DATA_DIR_URL}/${a.namespace.path}`}>
                  {a.namespace.cluster.name}/{a.namespace.name}
                </a>{' '}
                ({a.role})
              </li>
            ))}
          </ul>
        </React.Fragment>
      )}

      {role.permissions.length > 0 && (
        <React.Fragment>
          <h4>Permissions</h4>
          <Permissions permissions={role.permissions} />
        </React.Fragment>
      )}

      {role.users.length > 0 && (
        <React.Fragment>
          <h4>Users</h4>
          <Users users={role.users} />
        </React.Fragment>
      )}

      {role.bots.length > 0 && (
        <React.Fragment>
          <h4>Bots</h4>
          <ul>
            {role.bots.map(bot => (
              <li>
                <a href={`${window.DATA_DIR_URL}/${bot.path}`}>{bot.name}</a>
              </li>
            ))}
          </ul>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default Role;
