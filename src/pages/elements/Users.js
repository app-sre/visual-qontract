import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'patternfly-react';
import { OptionsMenuItem, OptionsMenu, OptionsMenuToggle, Grid, GridItem } from '@patternfly/react-core';
import { sortByName } from '../../components/Utils';
import SearchBar from '../../components/SearchBar';

function Users({ users }) {
  const headerFormat = value => <Table.Heading>{value}</Table.Heading>;
  const cellFormat = value => <Table.Cell>{value}</Table.Cell>;
  const linkFormat = url => value => <a href={`${url || ''}${value}`}>{value}</a>;
  const [filterText, changeFilterText] = useState('');
  const [isOpen, toggle] = useState(false);
  const [selected, changeSelected] = useState('name');
  const matchedUsers = [];
  const processedUsers = sortByName(users.slice()).map(u => {
    u.name_path = [u.name, u.path];
    return u;
  });
  let i;
  for (i = 0; i < processedUsers.length; i++) {
    if (selected === 'name') {
      if (processedUsers[i].name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1) {
        matchedUsers[matchedUsers.length] = processedUsers[i];
      }
    }
    if (selected === 'redhat') {
      if (processedUsers[i].redhat_username.toLowerCase().indexOf(filterText.toLowerCase()) !== -1) {
        matchedUsers[matchedUsers.length] = processedUsers[i];
      }
    }
    if (selected === 'github') {
      if (processedUsers[i].github_username.toLowerCase().indexOf(filterText.toLowerCase()) !== -1) {
        matchedUsers[matchedUsers.length] = processedUsers[i];
      }
    }
    if (selected === 'quay') {
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

  function onToggle() {
    toggle(!isOpen);
  }

  function onSelect(e) {
    const { id } = e.target;
    changeSelected(id);
    onToggle();
    return selected;
  }

  function toggleTemplate({ toggleTemplateProps }) {
    const { text } = toggleTemplateProps;
    return <React.Fragment>{text}</React.Fragment>;
  }

  const menuItems = [
    <OptionsMenuItem onSelect={onSelect} isSelected={selected === 'name'} id="name" key="name">
      Name
    </OptionsMenuItem>,
    <OptionsMenuItem onSelect={onSelect} isSelected={selected === 'redhat'} id="redhat" key="redhat">
      Red Hat Username
    </OptionsMenuItem>,
    <OptionsMenuItem onSelect={onSelect} isSelected={selected === 'github'} id="github" key="github">
      GitHub Username
    </OptionsMenuItem>,
    <OptionsMenuItem onSelect={onSelect} isSelected={selected === 'quay'} id="quay" key="quay">
      Quay Username
    </OptionsMenuItem>
  ];
  const menuToggle = (
    <OptionsMenuToggle onToggle={onToggle} toggleTemplate={toggleTemplate} toggleTemplateProps={{ text: selected }} />
  );
  return (
    <div>
      <Grid gutter="md">
        <GridItem span={1}>
          <OptionsMenu id="options-menu" menuItems={menuItems} isOpen={isOpen} toggle={menuToggle} />
        </GridItem>
        <GridItem span={6}>
          <SearchBar filterText={filterText} handleFilterTextChange={handleFilterTextChange} />
        </GridItem>
      </Grid>
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
