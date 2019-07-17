import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'patternfly-react';
import { sortByName } from '../../components/Utils';
import TableSearch from '../../components/TableSearch';

function Permissions({ permissions }) {
  const headerFormat = value => <Table.Heading>{value}</Table.Heading>;
  const cellFormat = value => <Table.Cell>{value}</Table.Cell>;
  const options = ['Name', 'Description'];
  const [selected, changeSelected] = useState(options[0]);
  const [filterText, changeFilterText] = useState('');
  const linkFormat = url => value => (
    <a href={`${url || ''}${value}`} target="_blank" rel="noopener noreferrer">
      {value}
    </a>
  );

  const processedPermissions = sortByName(permissions).map(p => {
    p.name_path = [p.name, p.path];
    return p;
  });
  const lcFilter = filterText.toLowerCase();
  function matches(ns) {
    return (
      (selected === 'Name' && ns.name.toLowerCase().includes(lcFilter)) ||
      (selected === 'Description' && ns.description !== null && ns.description.toLowerCase().includes(lcFilter))
    );
  }
  const matchedPermissions = processedPermissions.filter(matches);

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
                pathname: '/permissions',
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
        label: 'Provider',
        formatters: [headerFormat]
      },
      cell: {
        formatters: [cellFormat]
      },
      property: 'service'
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
  ];

  return (
    <TableSearch
      filterText={filterText}
      changeFilterText={changeFilterText}
      changeSelected={changeSelected}
      options={options}
      selected={selected}
      columns={columns}
      rows={matchedPermissions}
    />
  );
}

export default Permissions;
