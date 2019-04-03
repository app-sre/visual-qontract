import React from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'patternfly-react';
import { sortByName } from '../../components/Utils';

function Namespaces({ namespaces }) {
  const headerFormat = value => <Table.Heading>{value}</Table.Heading>;
  const cellFormat = value => <Table.Cell>{value}</Table.Cell>;

  const processedNamespaces = sortByName(namespaces.slice()).map(ns => {
    ns.name_path = [ns.name, ns.path];

    if (typeof ns.cluster !== 'undefined') {
      ns.cluster_name_path = [ns.cluster.name, ns.cluster.path];
    }
    return ns;
  });

  const colName = {
    header: {
      label: 'Name',
      formatters: [headerFormat]
    },
    cell: {
      formatters: [
        value => (
          <Link
            to={{
              pathname: '/namespaces',
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
  };

  const colPath = {
    header: {
      label: 'Path',
      formatters: [headerFormat]
    },
    cell: {
      formatters: [
        value => (
          <Link
            to={{
              pathname: '/namespaces',
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
  };

  const colCluster = {
    header: {
      label: 'Cluster',
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
        cellFormat
      ]
    },
    property: 'cluster_name_path'
  };

  const colDescription = {
    header: {
      label: 'Description',
      formatters: [headerFormat]
    },
    cell: {
      formatters: [cellFormat]
    },
    property: 'description'
  };

  const tableCols =
    typeof namespaces[0].cluster === 'undefined'
      ? [colName, colPath, colDescription]
      : [colName, colPath, colCluster, colDescription];

  return (
    <Table.PfProvider striped bordered columns={tableCols}>
      <Table.Header />
      <Table.Body rows={processedNamespaces} rowKey="path" />
    </Table.PfProvider>
  );
}

export default Namespaces;
