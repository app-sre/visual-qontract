import React from 'react';
import { Grid, Button } from 'patternfly-react';

function Page({ title, body, path }) {
  return (
    <Grid fluid className="container-pf-nav-pf-vertical">
      <Grid.Row>
        <Grid.Col xs={12}>
          <div className="page-header">
            <h1>
              {title}
              {path && (
                <span className="edit-button">
                  <Button href={`${window.DATA_DIR_URL}${path}`}>Edit</Button>
                </span>
              )}
            </h1>
          </div>
        </Grid.Col>
      </Grid.Row>
      {body}
    </Grid>
  );
}

export default Page;
