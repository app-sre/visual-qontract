import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'patternfly-react';
import { sortByName } from '../../components/Utils';
import TableSearch from '../../components/TableSearch';

function Documents({ documents }) {
  const headerFormat = value => <Table.Heading>{value}</Table.Heading>;
  const cellFormat = value => <Table.Cell>{value}</Table.Cell>;
  const options = ['Name', 'App'];
  const [selected, changeSelected] = useState(options[0]);
  const [filterText, changeFilterText] = useState('');
  const linkFormat = url => value => (
    <a href={`${url || ''}${value}`} target="_blank" rel="noopener noreferrer">
      {value}
    </a>
  );

  const processedDocuments = sortByName(documents).map(r => {
    r.name_path = [r.name, r.path];
    return r;
  });
  const lcFilter = filterText.toLowerCase();
  function matches(document) {
    return (
      (selected === 'Name' && document.name && document.name.toLowerCase().includes(lcFilter)) ||
      (selected === 'App' && document.app.name && document.app.name.toLowerCase().includes(lcFilter))
    );
  }
  const matchedDocuments = processedDocuments.filter(matches);

  const columns = [
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
                pathname: '/documents',
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
        label: 'App',
        formatters: [headerFormat]
      },
      cell: {
        formatters: [
          value => (
            <Link
              to={{
                pathname: '/services',
                hash: value.path
              }}
            >
              {value.name}
            </Link>
          ),
          cellFormat
        ]
      },
      property: 'app'
    }
  ];

  return (
    <TableSearch
      filterText={filterText}
      changeFilterText={changeFilterText}
      changeSelected={changeSelected}
      options={options}
      selected={selected}
      columns={columns}
      rows={matchedDocuments}
    />
  );
}

export default Documents;
