import React from 'react';
import Definition from '../../components/Definition';
import Roles from './Roles';

// import Users from './Users';

function Permission({ permission, roles }) {
  function matches(r) {
    const p = r.permissions;
    for (let i = 0; i < p.length; i++) {
      if (p[i].name === permission.name) {
        return true;
      }
    }
    return false;
  }
  const matchedData = roles.filter(matches);

  return (
    <React.Fragment>
      <h4>Info</h4>
      <Definition
        items={[
          ['Name', permission.name],
          ['Path', <a href={`${window.DATA_DIR_URL}${permission.path}`}>{permission.path}</a>]
        ]}
      />

      <h4>Description</h4>
      {permission.description || '-'}

      {matchedData.length > 0 && (
        <React.Fragment>
          <h4> Roles </h4>
          <Roles roles={matchedData} />
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default Permission;
