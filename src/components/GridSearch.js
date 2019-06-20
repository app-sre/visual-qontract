import React from 'react';
import { CardGrid } from 'patternfly-react';
import SearchBar from './SearchBar';

function GridSearch({ data, filterText, changeFilterText, changeSelected, selected }) {
  return (
    <React.Fragment>
      <CardGrid matchHeight>
        <SearchBar
          filterText={filterText}
          handleFilterTextChange={changeFilterText}
          handleSelect={changeSelected}
          selected={selected}
        />
        {data}
      </CardGrid>
    </React.Fragment>
  );
}

export default GridSearch;
