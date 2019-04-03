import React from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'patternfly-react';
import { sortByName } from '../../components/Utils';

function Roles({ roles }) {
  const headerFormat = value => <Table.Heading>{value}</Table.Heading>;
  const cellFormat = value => <Table.Cell>{value}</Table.Cell>;
  const linkFormat = url => value => <a href={`${url || ''}${value}`}>{value}</a>;

  const processedRoles = sortByName(roles).map(r => {
    r.internalLink = (
      <Link
        to={{
          pathname: '/roles',
          hash: r.path
        }}
      >
        {r.name}
      </Link>
    );

    r.internalPath = (
      <Link
        to={{
          pathname: '/roles',
          hash: r.path
        }}
      >
        {r.path}
      </Link>
    );

    return r;
  });

  return (
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
          property: 'internalLink'
        },
        {
          header: {
            label: 'Path',
            formatters: [headerFormat]
          },
          cell: {
            formatters: [cellFormat]
          },
          property: 'internalPath'
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
      <Table.Body rows={processedRoles} rowKey="path" />
    </Table.PfProvider>
  );
}

export default Roles;
