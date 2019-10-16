import React from 'react';
import Definition from '../../components/Definition';

function Report({ report }) {
  const content = report.content.split('\n').map((i, key) => <div key={key}>{i}</div>);
  return (
    <React.Fragment>
      <h4>Info</h4>
      <Definition
        items={[
          ['Report name', report.name],
          [
            'Path',
            <a href={`${window.DATA_DIR_URL}${report.path}`} target="_blank" rel="noopener noreferrer">
              {report.path}
            </a>
          ],
          ['App', <a href={`${window.DATA_DIR_URL}/${report.app.path}`}>{report.app.name}</a>],
          ['Date', report.date]
        ]}
      />
      <h4> Content </h4>
      <pre>{content}</pre>
    </React.Fragment>
  );
}

export default Report;
