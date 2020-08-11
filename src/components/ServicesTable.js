import React from 'react';
import { Table } from 'patternfly-react';
import { Link } from 'react-router-dom';
import { sortByName } from './Utils';

function ServicesTable({ services }) {
  const headerFormat = value => <Table.Heading>{value}</Table.Heading>;
  const cellFormat = value => <Table.Cell>{value}</Table.Cell>;
//   const linkFormat = url => value => <a href={`${url || ''}${value}`}>{value}</a>;
  // const pathToFormat = url => <Link to={{ pathname: '/services', hash: url }}>{url}</Link>
//   const pathToFormat = url => url + "1"

  services = sortByName(services.slice()).map(s => {
    s.name_path = [s.name, s.path];
    return s;
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
                    pathname: '/services',
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
            label: 'Description',
            formatters: [headerFormat]
          },
          cell: {
            formatters: [cellFormat]
          },
          property: 'description'
        },
      ]}
    >
      <Table.Header />
      <Table.Body rows={sortByName(services)} rowKey="name" />
    </Table.PfProvider>
  );
}

export default ServicesTable;
