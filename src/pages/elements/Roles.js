import React from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'patternfly-react';
import { sortByName } from '../../components/Utils';

function Roles({ roles }) {
  const headerFormat = value => <Table.Heading>{value}</Table.Heading>;
  const cellFormat = value => <Table.Cell>{value}</Table.Cell>;
  const linkFormat = url => value => <a href={`${url || ''}${value}`}>{value}</a>;

  const processedRoles = sortByName(roles).map(r => {
    r.name_path = [r.name, r.path];
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
            formatters: [
              value => (
                <Link
                  to={{
                    pathname: '/roles',
                    hash: value[1]
                  }}
                >
                  {value[0]}
                </Link>
              ),
              cellFormat
            ]
          },
          property: 'name_path'
        },
        {
          header: {
            label: 'Path',
            formatters: [headerFormat]
          },
          cell: {
            formatters: [
              value => (
                <Link
                  to={{
                    pathname: '/roles',
                    hash: value[1]
                  }}
                >
                  {value[1]}
                </Link>
              ),
              cellFormat
            ]
          },
          property: 'name_path'
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
