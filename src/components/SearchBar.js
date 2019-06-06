import React, { useState } from 'react';
import { OptionsMenuItem, OptionsMenu, OptionsMenuToggle, Grid, GridItem } from '@patternfly/react-core';
import { red } from 'ansi-colors';

function SearchBar({ filterText, handleFilterTextChange, handleSelect, options, selected }) {
  const [isOpen, toggle] = useState(false);
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
  const menuItems = options.map(i => (
    <OptionsMenuItem onSelect={onSelect} isSelected={selected === i} id={i} key={i}>
      {i}
    </OptionsMenuItem>
  ));
  const menuToggle = (
    <OptionsMenuToggle onToggle={onToggle} toggleTemplate={toggleTemplate} toggleTemplateProps={{ text: selected }} />
  );
  return (
    <Grid gutter="md">
      <GridItem span={1}>
        <OptionsMenu id="options-menu" menuItems={menuItems} isOpen={isOpen} toggle={menuToggle} />
      </GridItem>
      <GridItem span={6}>
        <form>
          <input type="text" placeholder="Search..." value={filterText} onChange={handleChange} />
        </form>
      </GridItem>
    </Grid>
  );
}

export default SearchBar;
