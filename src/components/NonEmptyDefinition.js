import React from 'react';

// display a list of definitions if key not null
function NonEmptyDefinition({ items }) {
  const definitions = [];
  let key;
  let value;
  for (let i = 0; i < items.length; i++) {
    [key, value] = items[i];
    if (value) {
      definitions.push(
        <div className="app-definition-row" key={`${key}-${value}`}>
          <div className="app-definition-key">{key}</div>
          <div className="app-definition-val">{value}</div>
        </div>
      );
    }
  }
  return <div className="app-definition">{definitions}</div>;
}

export default NonEmptyDefinition;
