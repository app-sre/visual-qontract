import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'patternfly-react';
import { sortByName } from '../../components/Utils';
import SearchBar from '../../components/SearchBar';

function Roles({ roles }) {
  const headerFormat = value => <Table.Heading>{value}</Table.Heading>;
  const cellFormat = value => <Table.Cell>{value}</Table.Cell>;
  const options = ['Name', 'Description'];
  const [selected, changeSelected] = useState(options[0]);
  const [filterText, changeFilterText] = useState('');
  const matchedRoles = [];
  const processedRoles = sortByName(roles).map(r => {
    r.name_path = [r.name, r.path];
    return r;
  });
  let i;
  for (i = 0; i < processedRoles.length; i++) {
    if (selected === 'Name') {
      if (processedRoles[i].name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1) {
        matchedRoles[matchedRoles.length] = processedRoles[i];
      }
    }
    if (selected === 'Description') {
      if (processedRoles[i].description !== null) {
        if (processedRoles[i].description.toLowerCase().indexOf(filterText.toLowerCase()) !== -1) {
          matchedRoles[matchedRoles.length] = processedRoles[i];
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
        ]}
      >
        <Table.Header />
        <Table.Body rows={matchedRoles} rowKey="path" />
      </Table.PfProvider>
    </div>
  );
}

export default Roles;
