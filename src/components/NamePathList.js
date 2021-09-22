import React from 'react';

// link to window.DATA_DIR_URL path
function LinkPath({ item }) {
  return (
    <a href={`${window.DATA_DIR_URL}/${item.path}`} target="_blank" rel="noopener noreferrer">
      {item.name}
    </a>
  );
}

// displays a list of {name: path} pair
function DisplayNamePathList({ items }) {
  return (
    <ul>
      {items &&
        items.map(item => (
          <li>
            <LinkPath item={item} />
          </li>
        ))}
    </ul>
  );
}

export { LinkPath, DisplayNamePathList };
