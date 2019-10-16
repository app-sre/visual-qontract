import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'patternfly-react';
import { sortByName } from '../../components/Utils';
import TableSearch from '../../components/TableSearch';

function Users({ users }) {
  const headerFormat = value => <Table.Heading>{value}</Table.Heading>;
  const cellFormat = value => <Table.Cell>{value}</Table.Cell>;
  const linkFormat = url => value => <a href={`${url || ''}${value}`}>{value}</a>;
  const [filterText, changeFilterText] = useState('');
  const options = ['Name', 'Red Hat Username', 'GitHub Username', 'Quay Username'];
  const [selected, changeSelected] = useState(options[0]);
  const processedUsers = sortByName(users.slice()).map(u => {
    u.name_path = [u.name, u.path];
    return u;
  });
  const lcFilter = filterText.toLowerCase();
  function matches(u) {
    return (
      (selected === 'Name' && u.name.toLowerCase().includes(lcFilter)) ||
      (selected === 'Red Hat Username' && u.org_username.toLowerCase().includes(lcFilter)) ||
      (selected === 'GitHub Username' && u.github_username.toLowerCase().includes(lcFilter)) ||
      (selected === 'Quay Username' && u.quay_username !== null && u.quay_username.toLowerCase().includes(lcFilter))
    );
  }
  const matchedUsers = processedUsers.filter(matches);
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
                pathname: '/users',
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
                pathname: '/users',
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
        label: 'Red Hat',
        formatters: [headerFormat]
      },
      cell: {
        formatters: [linkFormat('https://mojo.redhat.com/people/'), cellFormat]
      },
      property: 'org_username'
    },
    {
      header: {
        label: 'GitHub',
        formatters: [headerFormat]
      },
      cell: {
        formatters: [linkFormat('https://github.com/'), cellFormat]
      },
      property: 'github_username'
    },
    {
      header: {
        label: 'Quay',
        formatters: [headerFormat]
      },
      cell: {
        formatters: [linkFormat('https://quay.io/user/'), cellFormat]
      },
      property: 'quay_username'
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
      rows={matchedUsers}
    />
  );
}

export default Users;
