import React from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'patternfly-react';
import { sortByName } from '../../components/Utils';

function UpgradeBucketTable({clusters}) {
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
                <Link
                  to={{
                    pathname: '/clusters',
                    hash: value[1]
                  }}
                >
                  {value[0]}
                </Link>
              ),
              cellFormat]
          },
          property: 'name_path'
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
            label: 'External ID',
            formatters: [headerFormat]
          },
          cell: {
            formatters: [cellFormat]
          },
          property: 'external_id'
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

function groupByUpgrade(clusters) {
  return clusters.reduce((obj, cluster) => {
    // skip clusters with no spec (not OSDv4 or not upgradeable)
    if (cluster.spec === null) {
      return obj;
    }

    if (!(cluster.spec.upgrade in obj)) {
      obj[cluster.spec.upgrade] = [];
    }

    obj[cluster.spec.upgrade].push(cluster);

    return obj;
  }, {});
}

function ClusterUpgrades({ clusters }) {
  const clustersData = clusters.map(c => {
    c.name_path = [c.name, c.path];

    if (c['spec'] !== null) {
      c['version'] = c['spec']['version'];
      c['id'] = c['spec']['id'];
      c['external_id'] = c['spec']['external_id'];
    }

    return c;
  });

  const clustersByUpgrade = groupByUpgrade(clustersData);

  return <React.Fragment>
    <h2>Batch 1</h2><UpgradeBucketTable clusters={clustersByUpgrade['batch1']} />
    <h2>Batch 2</h2><UpgradeBucketTable clusters={clustersByUpgrade['batch2']} />
    {clustersByUpgrade['skip'] && 
        <React.Fragment>
            <h2>Skip</h2><UpgradeBucketTable clusters={clustersByUpgrade['skip']} />
        </React.Fragment>
    }
    </React.Fragment>;
}

export default ClusterUpgrades;
