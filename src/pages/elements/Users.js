import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'patternfly-react';
import { sortByName } from '../../components/Utils';
import SearchBar from '../../components/SearchBar';

function Users({ users }) {
  const headerFormat = value => <Table.Heading>{value}</Table.Heading>;
  const cellFormat = value => <Table.Cell>{value}</Table.Cell>;
  const linkFormat = url => value => <a href={`${url || ''}${value}`}>{value}</a>;
  const [filterText, changeFilterText] = useState('');
  const matchedUsers = [];
  const options = ['Name', 'Red Hat Username', 'GitHub Username', 'Quay Username'];
  const [selected, changeSelected] = useState(options[0]);
  const processedUsers = sortByName(users.slice()).map(u => {
    u.name_path = [u.name, u.path];
    return u;
  });
  let i;
  for (i = 0; i < processedUsers.length; i++) {
    if (selected === 'Name') {
      if (processedUsers[i].name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1) {
        matchedUsers[matchedUsers.length] = processedUsers[i];
      }
    }
    if (selected === 'Red Hat Username') {
      if (processedUsers[i].redhat_username.toLowerCase().indexOf(filterText.toLowerCase()) !== -1) {
        matchedUsers[matchedUsers.length] = processedUsers[i];
      }
    }
    if (selected === 'GitHub Username') {
      if (processedUsers[i].github_username.toLowerCase().indexOf(filterText.toLowerCase()) !== -1) {
        matchedUsers[matchedUsers.length] = processedUsers[i];
      }
    }
    if (selected === 'Quay Username') {
      if (processedUsers[i].quay_username !== null) {
        if (processedUsers[i].quay_username.toLowerCase().indexOf(filterText.toLowerCase()) !== -1) {
          matchedUsers[matchedUsers.length] = processedUsers[i];
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
  return (
    <div>
      <SearchBar
        filterText={filterText}
        handleFilterTextChange={handleFilterTextChange}
        handleSelect={handleSelect}
        options={options}
        selected={selected}
      />
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
        <Table.Body rows={matchedUsers} rowKey="path" />
      </Table.PfProvider>
    </div>
  );
}

export default Users;
