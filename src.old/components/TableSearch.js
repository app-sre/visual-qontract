import React from 'react';
import { Table } from 'patternfly-react';
import SearchBar from './SearchBar';

function TableSearch({ filterText, changeFilterText, changeSelected, options, selected, columns, rows }) {
  return (
    <React.Fragment>
      <SearchBar
        filterText={filterText}
        handleFilterTextChange={changeFilterText}
        handleSelect={changeSelected}
        options={options}
        selected={selected}
      />
      <Table.PfProvider striped bordered columns={columns}>
        <Table.Header />
        <Table.Body rows={rows} rowKey="path" />
      </Table.PfProvider>
    </React.Fragment>
  );
}

export default TableSearch;
