import React from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'patternfly-react';
import { sortByName } from '../../components/Utils';

function AppSREClustersTable({ clusters, apps }) {
  const appByName = appName => apps.find(a => a.name === appName);
  const headerFormat = value => <Table.Heading>{value}</Table.Heading>;
  const cellFormat = value => <Table.Cell>{value}</Table.Cell>;
  const workloadsFormat = workloadsList => <ul>{workloadsList.map(w => <li>{w}</li>)}</ul>;
  const appsFormat = appsList =>
    appsList.map(appName => (
      <span className="service_badge" key={appName}>
        <Link to={{ pathname: '/services', hash: appByName(appName).path }}>{appName}</Link>
      </span>
    ));

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
            label: 'Services',
            formatters: [headerFormat]
          },
          cell: {
            formatters: [appsFormat, cellFormat]
          },
          property: 'apps'
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
            label: 'Upgrade workloads',
            formatters: [headerFormat]
          },
          cell: {
            formatters: [workloadsFormat, cellFormat]
          },
          property: 'upgrade_workloads'
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
        },
        {
          header: {
            label: 'Upgrade soak days',
            formatters: [headerFormat]
          },
          cell: {
            formatters: [cellFormat]
          },
          property: 'upgrade_soak_days'
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

function Clusters({ clusters, apps }) {
  const clustersData = clusters.map(c => {
    c.name_path = [c.name, c.path, c.consoleUrl];

    if (c.spec) {
      c.version = c.spec.version;
      c.channel = c.spec.channel;
      c.id = c.spec.id;
      c.external_id = c.spec.external_id;
    }

    c.upgrade_workloads = []
    if (c.upgradePolicy) {
      c.upgrade_schedule = `${c.upgradePolicy.schedule}`;
      if (c.upgradePolicy.workloads) {
        c.upgrade_workloads = c.upgradePolicy.workloads
      }
      if (c.upgradePolicy.conditions && c.upgradePolicy.conditions.soakDays != null) {
        c.upgrade_soak_days = c.upgradePolicy.conditions.soakDays
      }
    }

    return c;
  });

  const appsreClusters = clustersData.filter(c => c.spec);
  const externalClusters = clustersData.filter(c => !c.spec);

  return (
    <>
      <h2>AppSRE Clusters</h2>
      <AppSREClustersTable clusters={appsreClusters} apps={apps} />

      <h2>External and v3 Clusters</h2>
      <ExternalClustersTable clusters={externalClusters} />
    </>
  );
}

export default Clusters;
