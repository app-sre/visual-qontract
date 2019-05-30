import React from 'react';
import { Table } from 'patternfly-react';
import Definition from '../../components/Definition';
import { sortByName } from '../../components/Utils';

import Users from './Users';

function Role({ role }) {
  const headerFormat = value => <Table.Heading>{value}</Table.Heading>;
  const cellFormat = value => <Table.Cell>{value}</Table.Cell>;
  const linkFormat = url => value => <a href={`${url || ''}${value}`}>{value}</a>;

  const permissionsTable = (
    <Table.PfProvider
      striped
      bordered
      columns={[
        {
          header: {
            label: 'Name',
            formatters: [headerFormat]
          },
          cell: {
            formatters: [cellFormat]
          },
          property: 'name'
        },
        {
          header: {
            label: 'Path',
            formatters: [headerFormat]
          },
          cell: {
            formatters: [linkFormat(window.DATA_DIR_URL), cellFormat]
          },
          property: 'path'
        },
        {
          header: {
            label: 'Provider',
            formatters: [headerFormat]
          },
          cell: {
            formatters: [cellFormat]
          },
          property: 'service'
        },
        {
          header: {
            label: 'Description',
            formatters: [headerFormat]
          },
          cell: {
            formatters: [cellFormat]
          },
          property: 'description'
        }
      ]}
    >
      <Table.Header />
      <Table.Body rows={sortByName(role.permissions)} rowKey="path" />
    </Table.PfProvider>
  );

  return (
    <React.Fragment>
      <h4>Info</h4>
      <Definition
        items={[['Name', role.name], ['Path', <a href={`${window.DATA_DIR_URL}${role.path}`}>{role.path}</a>]]}
      />

      <h4>Description</h4>
      {role.description || '-'}

      <h4>Permissions</h4>
      {permissionsTable}

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
