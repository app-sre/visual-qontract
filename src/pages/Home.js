import * as React from 'react';
import { Grid } from 'patternfly-react';

import Definition from '../components/Definition';

function HomePage() {
  return (
    <Grid fluid className="container-pf-nav-pf-vertical">
      <Grid.Row>
        <Grid.Col xs={12}>
          <div className="page-header">
            <h1>Overview</h1>
          </div>
        </Grid.Col>
      </Grid.Row>
      <Grid.Row>
        <Grid.Col xs={12}>This web application is the visual representation of the App-Interface.</Grid.Col>
      </Grid.Row>
      <Grid.Row>
        <Grid.Col xs={12}>
          <Definition
            items={[
              ['Data', <a href={window.DATA_DIR_URL}>{window.DATA_DIR_URL}</a>],
              ['Docs', <a href={window.DOCS_BASE_URL}>{window.DOCS_BASE_URL}</a>],
              ['Schemas', <a href={window.SCHEMAS_DIR}>{window.SCHEMAS_DIR}</a>],
              ['GraphQL', <a href={window.GRAPHQL_URI}>{window.GRAPHQL_URI}</a>]
            ]}
          />
        </Grid.Col>
      </Grid.Row>
    </Grid>
  );
}

export default HomePage;
