import React from 'react';

function User({ user }) {
  return (
    <ul>
      <li>
        <strong>Name</strong>: {user.name}
      </li>
      <li>
        <strong>Red Hat Username: </strong>
        <a href={`https://mojo.redhat.com/people/${user.redhat_username}`}>{user.redhat_username}</a>
      </li>
      <li>
        <strong>GitHub Username: </strong>
        <a href={`https://github.com/${user.github_username}`}>{user.github_username}</a>
      </li>
      {user.quay_username && (
        <li>
          <strong>Quay Username: </strong>
          <a href={`https://quay.io/user/${user.quay_username}`}>{user.quay_username}</a>
        </li>
      )}
    </ul>
  );
}

export default User;
