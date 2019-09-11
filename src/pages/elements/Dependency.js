import React from 'react';
import Definition from '../../components/Definition';

function Dependency({ dependency }) {
  return (
    <React.Fragment>
      <h4>Info</h4>
      <Definition
        items={[
          ['Dependency name', dependency.name],
          [
            'Path',
            <a href={`${window.DATA_DIR_URL}${dependency.path}`} target="_blank" rel="noopener noreferrer">
              {dependency.path}
            </a>
          ],
          [
            'Status page',
            <a href={`${dependency.statusPage}`} target="_blank" rel="noopener noreferrer">
              {dependency.statusPage}
            </a>
          ],
          ['Statefulness', dependency.statefulness],
          ['Ops Model', dependency.opsModel],
          ['SLA', dependency.SLA],
          ['Failure impact', dependency.dependencyFailureImpact]
        ]}
      />
    </React.Fragment>
  );
}

export default Dependency;
