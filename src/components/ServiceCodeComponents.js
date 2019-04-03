import React from 'react';

import { Table } from 'patternfly-react';
import { sortByName } from './Utils';

function CodeComponents({ components }) {
  const headerFormat = value => <Table.Heading>{value}</Table.Heading>;
  const cellFormat = value => <Table.Cell>{value}</Table.Cell>;
  const linkFormat = url => value => <a href={`${url || ''}${value}`}>{value}</a>;

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
          property: 'name'
        },
        {
          header: {
            label: 'Resource',
            formatters: [headerFormat]
          },
          cell: {
            formatters: [cellFormat]
          },
          property: 'resource'
        },
        {
          header: {
            label: 'URL',
            formatters: [headerFormat]
          },
          cell: {
            formatters: [linkFormat(), cellFormat]
          },
          property: 'url'
        }
      ]}
    >
      <Table.Header />
      <Table.Body rows={sortByName(components)} rowKey="name" />
    </Table.PfProvider>
  );
}

export default CodeComponents;
