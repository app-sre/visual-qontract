import React from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Definition from '../../components/Definition';

function Document({ document, content }) {
  console.log(content);
  return (
    <React.Fragment>
      <h4>Info</h4>
      <Definition
        items={[
          ['Document name', document.name],
          [
            'Path',
            <a href={`${window.DATA_DIR_URL}/${document.path}`} target="_blank" rel="noopener noreferrer">
              {document.path}
            </a>
          ],
          [
            'App',
            <Link
              to={{
                pathname: '/services',
                hash: document.app.path
              }}
            >
              {document.app.name}
            </Link>
          ]
        ]}
      />
      <h4> Content </h4>
      <ReactMarkdown source={content} />
    </React.Fragment>
  );
}

export default Document;
