import * as React from 'react';
import Page from '../components/Page';

function NotFoundPage() {
  return (
    <Page
      body={
        <React.Fragment>
          <h1>Page Not Found</h1>
        </React.Fragment>
      }
    />
  );
}

export default NotFoundPage;
