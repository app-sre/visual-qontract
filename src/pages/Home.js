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
        <Grid.Col xs={12}>Hello, HyperShift F2F!</Grid.Col>
      </Grid.Row>
      <Grid.Row>
        <Grid.Col xs={12}>This web application is the visual representation of the App-Interface.</Grid.Col>
      </Grid.Row>
      <Grid.Row>
        <Grid.Col xs={12}>
          <Definition
            items={[
              [
                'Data',
                <a href={window.DATA_DIR_URL} target="_blank" rel="noopener noreferrer">
                  {window.DATA_DIR_URL}
                </a>
              ],
              [
                'Docs',
                <a href={window.DOCS_BASE_URL} target="_blank" rel="noopener noreferrer">
                  {window.DOCS_BASE_URL}
                </a>
              ],
              [
                'Schemas',
                <a href={window.SCHEMAS_DIR} target="_blank" rel="noopener noreferrer">
                  {window.SCHEMAS_DIR}
                </a>
              ],
              [
                'Grafana',
                <a href={`${window.GF_ROOT_URL}/dashboards`} target="_blank" rel="noopener noreferrer">
                  {`${window.GF_ROOT_URL}/dashboards`}
                </a>
              ],
              [
                "This UI's source",
                <a href="https://github.com/app-sre/visual-qontract" target="_blank" rel="noopener noreferrer">
                  https://github.com/app-sre/visual-qontract
                </a>
              ]
            ]}
          />
        </Grid.Col>
      </Grid.Row>
    </Grid>
  );
}

export default HomePage;
