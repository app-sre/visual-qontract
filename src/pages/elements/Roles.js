import React from 'react';
import { Link } from 'react-router-dom';
import { TableGrid } from 'patternfly-react-extensions';
import { sortByName } from '../../components/Utils';

function Roles({ roles }) {
  const rows = sortByName(roles).map(role => (
    <TableGrid.Row key={role.path}>
      <TableGrid.Col md={2}>
        <Link
          to={{
            pathname: '/roles',
            hash: role.path
          }}
        >
          {role.name}
        </Link>
      </TableGrid.Col>
      <TableGrid.Col md={4}>
        <Link
          to={{
            pathname: '/roles',
            hash: role.path
          }}
        >
          {role.path}
        </Link>
      </TableGrid.Col>
      <TableGrid.Col md={5}>{role.description}</TableGrid.Col>
    </TableGrid.Row>
  ));

  return (
    <React.Fragment>
      <TableGrid>
        <TableGrid.Head>
          <TableGrid.ColumnHeader id="title" md={2}>
            Name
          </TableGrid.ColumnHeader>
          <TableGrid.ColumnHeader id="path" md={4}>
            path
          </TableGrid.ColumnHeader>
          <TableGrid.ColumnHeader id="description" md={5}>
            Description
          </TableGrid.ColumnHeader>
        </TableGrid.Head>
        <TableGrid.Body>{rows}</TableGrid.Body>
      </TableGrid>
    </React.Fragment>
  );
}

export default Roles;
