import React from 'react';
import Definition from '../../components/Definition';

function User({ user }) {
  return (
    <React.Fragment>
      <h4>Info</h4>
      <Definition
        items={[
          ['Name', user.name],
          ['Path', <a href={`${window.DATA_DIR_URL}${user.path}`}>{user.path}</a>],
          [
            'Red Hat Username',
            <a href={`https://mojo.redhat.com/people/${user.redhat_username}`}>{user.redhat_username}</a>
          ],
          ['GitHub Username', <a href={`https://github.com/${user.github_username}`}>{user.github_username}</a>],
          [
            'Quay Username',
            (user.quay_username && <a href={`https://quay.io/user/${user.quay_username}`}>{user.quay_username}</a>) ||
              '-'
          ]
        ]}
      />
    </React.Fragment>
  );
}

export default User;
