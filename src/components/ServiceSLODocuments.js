import React from 'react';
import { Table } from 'patternfly-react';
import { sortByName } from './Utils';

function ServiceSLODocuments({ documents }) {
  const headerFormat = value => <Table.Heading>{value}</Table.Heading>;
  const cellFormat = value => <Table.Cell>{value}</Table.Cell>;
  const linkFormat = url => value => <a href={`${url || ''}${value}`}>{value}</a>;
  const elements = [];

  for (const document of documents) {
    const element = (
      <div>
        <h5>{document.name}</h5>
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
                label: 'SLI Type',
                formatters: [headerFormat]
              },
              cell: {
                formatters: [cellFormat]
              },
              property: 'SLIType'
            },
            {
              header: {
                label: 'SLI Specification',
                formatters: [headerFormat]
              },
              cell: {
                formatters: [cellFormat]
              },
              property: 'SLISpecification'
            },
            {
              header: {
                label: 'SLO Details',
                formatters: [headerFormat]
              },
              cell: {
                formatters: [linkFormat(), cellFormat]
              },
              property: 'SLODetails'
            },
            {
              header: {
                label: 'SLO Target',
                formatters: [headerFormat]
              },
              cell: {
                formatters: [cellFormat]
              },
              property: 'SLOTarget'
            },
            {
              header: {
                label: 'Dashboard',
                formatters: [headerFormat]
              },
              cell: {
                formatters: [linkFormat(), cellFormat]
              },
              property: 'dashboard'
            }
          ]}
        >
          <Table.Header />
          <Table.Body rows={sortByName(document.slos)} rowKey="name" />
        </Table.PfProvider>
      </div>
    );
    elements.push(element);
  }
  return <>{elements}</>;
}

export default ServiceSLODocuments;
