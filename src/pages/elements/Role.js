import React from 'react';
import { Link } from 'react-router-dom';
import Definition from '../../components/Definition';

import Users from './Users';
import Permissions from './Permissions';

function Role({ role }) {
  function matchNamespaceAccess(r) {
    if (r.namespace && r.namespace !== null) {
      return true;
    }
    return false;
  }
  function matchClusterAccess(r) {
    if (r.cluster && r.cluster !== null) {
      return true;
    }
    return false;
  }
  let matchedNamespaceAccess = [];
  let matchedClusterAccess = [];
  if (role.access && role.access !== null) {
    matchedNamespaceAccess = role.access.filter(matchNamespaceAccess);
    matchedClusterAccess = role.access.filter(matchClusterAccess);
  }
  return (
    <React.Fragment>
      <h4>Info</h4>
      <Definition
        items={[['Name', role.name], ['Path', <a href={`${window.DATA_DIR_URL}${role.path}`}>{role.path}</a>]]}
      />

      <h4>Description</h4>
      {role.description || '-'}

      {matchedNamespaceAccess.length > 0 && (
        <React.Fragment>
          <h4>Namespace Access</h4>
          <ul>
            {matchedNamespaceAccess.map(a => (
              <li>
                <Link
                  to={{
                    pathname: '/namespaces',
                    hash: a.namespace.path
                  }}
                >
                  {a.namespace.cluster.name}/{a.namespace.name}
                </Link>{' '}
                ({a.role})
              </li>
            ))}
          </ul>
        </React.Fragment>
      )}

      {matchedClusterAccess.length > 0 && (
        <React.Fragment>
          <h4>Cluster Access</h4>
          <ul>
            {matchedClusterAccess.map(a => (
              <li>
                <Link
                  to={{
                    pathname: '/clusters',
                    hash: a.cluster.path
                  }}
                >
                  {a.cluster.name}
                </Link>{' '}
                ({a.group})
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
