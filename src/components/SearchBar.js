import React, { useState } from 'react';
import { OptionsMenuItem, OptionsMenu, OptionsMenuToggle, Grid, GridItem } from '@patternfly/react-core';

function SearchBar({ filterText, handleFilterTextChange, handleSelect, options, selected }) {
  const [isOpen, toggle] = useState(false);
  let optionsMenu;
  function handleChange(e) {
    handleFilterTextChange(e.target.value);
  }
  function onToggle() {
    toggle(!isOpen);
  }

  function onSelect(e) {
    const { id } = e.target;
    handleSelect(id);
    onToggle();
  }

  function toggleTemplate({ toggleTemplateProps }) {
    const { text } = toggleTemplateProps;
    return <React.Fragment>{text}</React.Fragment>;
  }

  if (options !== undefined) {
    const menuItems = options.map(i => (
      <OptionsMenuItem onSelect={onSelect} isSelected={selected === i} id={i} key={i} className="optionsMenuItem">
        {i}
      </OptionsMenuItem>
    ));
    const menuToggle = (
      <OptionsMenuToggle onToggle={onToggle} toggleTemplate={toggleTemplate} toggleTemplateProps={{ text: selected }} />
    );
    optionsMenu = (
      <OptionsMenu
        id="options-menu"
        menuItems={menuItems}
        isOpen={isOpen}
        toggle={menuToggle}
        className="optionsMenu"
      />
    );
  } else {
    optionsMenu = '';
  }
  return (
    <Grid className="searchBar">
      <GridItem span={2}>
        <form>
          <input className="search" type="text" placeholder="Search..." value={filterText} onChange={handleChange} />
        </form>
      </GridItem>
      <GridItem span={3}> {optionsMenu} </GridItem>
    </Grid>
  );
}

export default SearchBar;
