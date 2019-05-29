import React from 'react';

function SearchBar({ filterText, handleFilterTextChange }) {
  function handleChange(e) {
    handleFilterTextChange(e.target.value);
  }
  return (
    <form>
      <input type="text" placeholder="Search..." value={filterText} onChange={handleChange} />
    </form>
  );
}

export default SearchBar;
