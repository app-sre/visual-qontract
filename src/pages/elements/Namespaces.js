import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'patternfly-react';
import GrafanaUrl from './GrafanaUrl';
import { sortByName } from '../../components/Utils';
import SearchBar from '../../components/SearchBar';

function Namespaces({ namespaces }) {
  const options = ['Name', 'Cluster', 'Description'];
  const [selected, changeSelected] = useState(options[0]);
  const [filterText, changeFilterText] = useState('');
  if (namespaces.length === 0) {
    return <p style={{ 'font-style': 'italic' }}>No namespaces.</p>;
  }
  const headerFormat = value => <Table.Heading>{value}</Table.Heading>;
  const cellFormat = value => <Table.Cell>{value}</Table.Cell>;
  const matchedNamespaces = [];
  const processedNamespaces = sortByName(namespaces.slice()).map(ns => {
    ns.name_path = [ns.name, ns.path];
    if (typeof ns.cluster !== 'undefined') {
      ns.cluster_name_path = [ns.cluster.name, ns.cluster.path];
      ns.grafana_url = [ns.cluster.jumpHost, ns.cluster.name, ns.name, ns.grafanaUrl];
    }
    return ns;
  });
  let i;
  for (i = 0; i < processedNamespaces.length; i++) {
    if (selected === 'Name') {
      if (processedNamespaces[i].name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1) {
        matchedNamespaces[matchedNamespaces.length] = processedNamespaces[i];
      }
    }
    if (selected === 'Cluster') {
      if (processedNamespaces[i].cluster.name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1) {
        matchedNamespaces[matchedNamespaces.length] = processedNamespaces[i];
      }
    }
    if (selected === 'Description') {
      if (processedNamespaces[i].description !== null) {
        if (processedNamespaces[i].description.toLowerCase().indexOf(filterText.toLowerCase()) !== -1) {
          matchedNamespaces[matchedNamespaces.length] = processedNamespaces[i];
        }
      }
    }
  }
  function handleFilterTextChange(txt) {
    changeFilterText(txt);
  }

  function handleSelect(newSelection) {
    changeSelected(newSelection);
  }
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

  const colGrafana = {
    header: {
      label: 'Grafana',
      formatters: [headerFormat]
    },
    cell: {
      formatters: [
        value => <GrafanaUrl jumpHost={value[0]} cluster={value[1]} namespace={value[2]} url={value[3]} />,
        cellFormat
      ]
    },
    property: 'grafana_url'
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
    typeof namespaces[0].cluster.path === 'undefined'
      ? [colName, colPath, colGrafana, colDescription]
      : [colName, colPath, colCluster, colGrafana, colDescription];

  return (
    <div>
      <SearchBar
        filterText={filterText}
        handleFilterTextChange={handleFilterTextChange}
        handleSelect={handleSelect}
        options={options}
        selected={selected}
      />
      <Table.PfProvider striped bordered columns={tableCols}>
        <Table.Header />
        <Table.Body rows={matchedNamespaces} rowKey="path" />
      </Table.PfProvider>
    </div>
  );
}

export default Namespaces;
