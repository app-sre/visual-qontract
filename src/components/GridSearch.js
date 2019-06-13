import React from 'react';
import { CardGrid } from 'patternfly-react';
import SearchBar from './SearchBar';

function GridSearch({ data, filterText, changeFilterText, changeSelected, selected }) {
  return (
    <React.Fragment>
      <SearchBar
        filterText={filterText}
        handleFilterTextChange={changeFilterText}
        handleSelect={changeSelected}
        selected={selected}
      />
      <CardGrid matchHeight>{data}</CardGrid>
    </React.Fragment>
  );
}

export default GridSearch;
