import React from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'patternfly-react';
import { sortByName } from '../../components/Utils';

function Permissions({ permissions }) {
  const headerFormat = value => <Table.Heading>{value}</Table.Heading>;
  const cellFormat = value => <Table.Cell>{value}</Table.Cell>;
  const linkFormat = url => value => (
    <a href={`${url || ''}${value}`} target="_blank" rel="noopener noreferrer">
      {value}
    </a>
  );

  const processedPermissions = sortByName(permissions).map(p => {
    p.name_path = [p.name, p.path];
    return p;
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
                    pathname: '/permissions',
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
      <Table.Body rows={processedPermissions} rowKey="path" />
    </Table.PfProvider>
  );
}

export default Permissions;
