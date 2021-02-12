import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'patternfly-react';
import { sortByName, sortByDate } from '../../components/Utils';
import TableSearch from '../../components/TableSearch';

function Reports({ reports }) {
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

  const processedReports = sortByDate(sortByName(reports)).map(r => {
    r.name_path = [r.name, r.path];
    return r;
  });
  const lcFilter = filterText.toLowerCase();
  function matches(report) {
    return (
      (selected === 'Name' && report.name && report.name.toLowerCase().includes(lcFilter)) ||
      (selected === 'App' && report.app.name && report.app.name.toLowerCase().includes(lcFilter))
    );
  }
  const matchedReports = processedReports.filter(matches);

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
                pathname: '/reports',
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
    },
    {
      header: {
        label: 'Date',
        formatters: [headerFormat]
      },
      cell: {
        formatters: [cellFormat]
      },
      property: 'date'
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
      rows={matchedReports}
    />
  );
}

export default Reports;
