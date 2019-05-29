import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'patternfly-react';
import { sortByName } from '../../components/Utils';
import SearchBar from '../../components/SearchBar';

function Users({ users }) {
  const headerFormat = value => <Table.Heading>{value}</Table.Heading>;
  const cellFormat = value => <Table.Cell>{value}</Table.Cell>;
  const linkFormat = url => value => (
    <a href={`${url || ''}${value}`} target="_blank" rel="noopener noreferrer">
      {value}
    </a>
  );

  const processedUsers = sortByName(users.slice()).map(u => {
    u.name_path = [u.name, u.path];
    return u;
  });
  const [filterText, changeFilterText] = useState('Search...');

  console.log({ filterText });

  function handleFilterTextChange(txt) {
    changeFilterText(txt);
  }

  return (
    <div>
      <SearchBar filterText handleFilterTextChange />
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
            property: 'redhat_username'
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
        ]}
      >
        <Table.Header />
        <Table.Body rows={processedUsers} rowKey="path" />
      </Table.PfProvider>
    </div>
  );
}

export default Users;
