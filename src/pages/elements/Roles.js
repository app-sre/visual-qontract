import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'patternfly-react';
import { sortByName } from '../../components/Utils';
import TableSearch from '../../components/TableSearch';

function Roles({ roles }) {
  const headerFormat = value => <Table.Heading>{value}</Table.Heading>;
  const cellFormat = value => <Table.Cell>{value}</Table.Cell>;
  const options = ['Name', 'Description'];
  const [selected, changeSelected] = useState(options[0]);
  const [filterText, changeFilterText] = useState('');
  const processedRoles = sortByName(roles).map(r => {
    r.name_path = [r.name, r.path];
    return r;
  });
  const lcFilter = filterText.toLowerCase();
  function matches(r) {
    return (
      (selected === 'Name' && r.name.toLowerCase().includes(lcFilter)) ||
      (selected === 'Description' && r.description !== null && r.description.toLowerCase().includes(lcFilter))
    );
  }
  const matchedRoles = processedRoles.filter(matches);
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
                pathname: '/roles',
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
        formatters: [
          value => (
            <Link
              to={{
                pathname: '/roles',
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
      rows={matchedRoles}
    />
  );
}

export default Roles;
