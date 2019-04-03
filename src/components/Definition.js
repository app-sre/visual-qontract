import React from 'react';

function Definition({ items }) {
  return (
    <div className="app-definition">
      {items.map(i => (
        <div className="app-definition-row">
          <div className="app-definition-key">{i[0]}</div>
          <div className="app-definition-val">{i[1]}</div>
        </div>
      ))}
    </div>
  );
}

export default Definition;
