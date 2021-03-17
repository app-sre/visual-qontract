import React from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'patternfly-react';
import { sortByName } from '../../components/Utils';

function AppSREClustersTable({ clusters }) {
  const headerFormat = value => <Table.Heading>{value}</Table.Heading>;
  const cellFormat = value => <Table.Cell>{value}</Table.Cell>;
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
                <>
                  <Link
                    to={{
                      pathname: '/clusters',
                      hash: value[1]
                    }}
                  >
                    {value[0]}
                  </Link>
                  &nbsp;&nbsp;
                  <a href={value[2]} target="_blank" rel="noopener noreferrer">
                    <i className="fa fa-desktop" />
                  </a>
                </>
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
        {
          header: {
            label: 'Version',
            formatters: [headerFormat]
          },
          cell: {
            formatters: [cellFormat]
          },
          property: 'version'
        },
        {
          header: {
            label: 'Channel',
            formatters: [headerFormat]
          },
          cell: {
            formatters: [cellFormat]
          },
          property: 'channel'
        },
        {
          header: {
            label: 'ID',
            formatters: [headerFormat]
          },
          cell: {
            formatters: [cellFormat]
          },
          property: 'id'
        },
        {
          header: {
            label: 'Upgrade schedule',
            formatters: [headerFormat]
          },
          cell: {
            formatters: [cellFormat]
          },
          property: 'upgrade_schedule'
        }
      ]}
    >
      <Table.Header />
      <Table.Body rows={sortByName(clusters)} rowKey="name" />
    </Table.PfProvider>
  );
}

function ExternalClustersTable({ clusters }) {
  const headerFormat = value => <Table.Heading>{value}</Table.Heading>;
  const cellFormat = value => <Table.Cell>{value}</Table.Cell>;
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
                <>
                  <Link
                    to={{
                      pathname: '/clusters',
                      hash: value[1]
                    }}
                  >
                    {value[0]}
                  </Link>
                  &nbsp;&nbsp;
                  <a href={value[2]}>
                    <i className="fa fa-desktop" />
                  </a>
                </>
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
      <Table.Body rows={sortByName(clusters)} rowKey="name" />
    </Table.PfProvider>
  );
}

function Clusters({ clusters }) {
  const clustersData = clusters.map(c => {
    c.name_path = [c.name, c.path, c.consoleUrl];

    if (c.spec) {
      c.version = c.spec.version;
      c.channel = c.spec.channel;
      c.id = c.spec.id;
      c.external_id = c.spec.external_id;
    }

    if (c.upgradePolicy) {
      c.upgrade_schedule = `${c.upgradePolicy.schedule_type} - ${c.upgradePolicy.schedule}`;
    }

    return c;
  });

  const appsreClusters = clustersData.filter(c => c.spec);
  const externalClusters = clustersData.filter(c => !c.spec);

  return (
    <>
      <h2>AppSRE Clusters</h2>
      <AppSREClustersTable clusters={appsreClusters} />

      <h2>External and v3 Clusters</h2>
      <ExternalClustersTable clusters={externalClusters} />
    </>
  );
}

export default Clusters;
