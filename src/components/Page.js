import React from 'react';
import { Grid, Button } from 'patternfly-react';
import { Link } from 'react-router-dom';

function Page({ title, body, path, create}) {
  return (
    <Grid fluid className="container-pf-nav-pf-vertical">
      <Grid.Row>
        <Grid.Col xs={12}>
          <div className="page-header">
            <h1>
              {title}
              {path && (
                <span className="edit-button">
                  <Button href={`${window.DATA_DIR_URL}${path}`} target="_blank" rel="noopener noreferrer">
                    Edit
                  </Button>
                </span>
              )}
              {create && (
                <span className="edit-button">
                  <Link
                    to={{
                      pathname: create["path"],
                      hash: create["hash"]
                    }}
                  >
                    <Button>
                      {create["label"]}
                    </Button>
                  </Link>
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
