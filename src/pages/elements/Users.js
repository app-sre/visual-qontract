import React from 'react';
import { Link } from 'react-router-dom';
import { TableGrid } from 'patternfly-react-extensions';

class Users extends React.Component {
  constructor(props) {
    super(props);
  }

  sortUsers = users =>
    users.sort((a, b) => {
      if (a.name > b.name) return 1;
      if (a.name < b.name) return -1;
      return 0;
    });

  render() {
    const rows = this.sortUsers(this.props.users).map(user => (
      <TableGrid.Row key={user.path}>
        <TableGrid.Col md={5}>
          <Link
            to={{
              pathname: '/users',
              hash: user.path
            }}
          >
            {user.name}
          </Link>
        </TableGrid.Col>
        <TableGrid.Col md={2}>
          <a href={`https://mojo.redhat.com/people/${user.redhat_username}`}>{user.redhat_username}</a>
        </TableGrid.Col>
        <TableGrid.Col md={2}>
          <a href={`https://github.com/${user.github_username}`}>{user.github_username}</a>
        </TableGrid.Col>
        <TableGrid.Col md={2}>
          <a href={`https://quay.io/user/${user.quay_username}`}>{user.quay_username}</a>
        </TableGrid.Col>
      </TableGrid.Row>
    ));
    return (
      <React.Fragment>
        <TableGrid>
          <TableGrid.Head>
            <TableGrid.ColumnHeader id="title" md={5}>
              Name
            </TableGrid.ColumnHeader>
            <TableGrid.ColumnHeader id="redhat_username" md={2}>
              Red Hat Username
            </TableGrid.ColumnHeader>
            <TableGrid.ColumnHeader id="github_username" md={2}>
              GitHub Username
            </TableGrid.ColumnHeader>
            <TableGrid.ColumnHeader id="quay_username" md={2}>
              Quay Username
            </TableGrid.ColumnHeader>
          </TableGrid.Head>
          <TableGrid.Body>{rows}</TableGrid.Body>
        </TableGrid>
      </React.Fragment>
    );
  }
}

export default Users;
