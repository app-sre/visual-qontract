import * as React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Page from '../components/Page';
import Documents from './elements/Documents';
import Document from './elements/Document';

const GET_DOCUMENT = gql`
  query Document($path: String) {
    documents_v1(path: $path) {
      path
      app {
        path
        name
      }
      name
      content_path
    }
    resources_v1 {
      path
      content
    }
  }
`;

const GET_DOCUMENTS = gql`
  query Documents {
    documents_v1 {
      path
      app {
        path
        name
      }
      name
    }
  }
`;

function getDocumentContent(resources, path) {
  for (let i = 0; i < resources.length; i++) {
    if (resources[i].path === path) {
      return resources[i].content;
    }
  }
  return '';
}

const DocumentsPage = ({ location }) => {
  const path = location.hash.substring(1);
  if (path) {
    return (
      <Query query={GET_DOCUMENT} variables={{ path }}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return `Error! ${error.message}`;

          const document = data.documents_v1[0];
          const content = getDocumentContent(data.resources_v1, document.content_path);
          const body = <Document document={document} content={content} />;
          return <Page title={document.name} body={body} path={document.path} />;
        }}
      </Query>
    );
  }

  return (
    <Query query={GET_DOCUMENTS}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;
  
        const body = <Documents documents={data.documents_v1} />;
        return <Page title="Reports" body={body} />;
      }}
    </Query>
  );
};

export default DocumentsPage;
