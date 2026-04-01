import React from 'react';
import { CardGrid } from 'patternfly-react';
import SearchBar from './SearchBar';

function GridSearch({ data, filterText, changeFilterText, changeSelected, options, selected }) {
  return (
    <React.Fragment>
      <CardGrid matchHeight>
        <SearchBar
          filterText={filterText}
          handleFilterTextChange={changeFilterText}
          handleSelect={changeSelected}
          options={options}
          selected={selected}
        />
        {data}
      </CardGrid>
    </React.Fragment>
  );
}

export default GridSearch;
