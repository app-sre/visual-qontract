import React from 'react';
import Definition from '../../components/Definition';

// import Users from './Users';

function Permission({ permission }) {
  console.log(permission);
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

      {/* {permission.users.length > 0 && (
        <React.Fragment>
          <h4>Users</h4>
          <Users users={permission.users} />
        </React.Fragment>
      )} */}
    </React.Fragment>
  );
}

export default Permission;
