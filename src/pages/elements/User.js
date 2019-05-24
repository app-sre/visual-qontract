import React from 'react';
import { ClipboardCopy, ClipboardCopyVariant, Grid, GridItem, Button, Tooltip } from '@patternfly/react-core';
import { ExportIcon } from '@patternfly/react-icons';
import Definition from '../../components/Definition';
import Roles from './Roles';

function User({ user }) {
  let downloadKeyButton;
  let gpg;
  if (user.public_gpg_key == null) {
    downloadKeyButton = '';
    gpg = <div> - </div>;
  } else {
    downloadKeyButton = (
      <Tooltip position="top" content={<div>Download</div>} exitdelay={50} entrydelay={550}>
        <span>
          <Button type="button" variant="plain" ishover="true" onClick={downloadKey}>
            <ExportIcon />
          </Button>
        </span>
      </Tooltip>
    );
    gpg = (
      <Grid gutter="md">
        <GridItem span={6}>
          <ClipboardCopy
            isReadOnly
            style={{ marginRight: 5 }}
            variant={ClipboardCopyVariant.expansion}
            exitDelay={50}
            entryDelay={550}
            clickTip=""
          >
            {user.public_gpg_key}
          </ClipboardCopy>
        </GridItem>
        <GridItem span={4}> {downloadKeyButton}</GridItem>
      </Grid>
    );
  }

  // taken from: https://stackoverflow.com/questions/44656610/download-a-string-as-txt-file-in-react
  // there probably is a better way in react to do this
  function downloadKey(e) {
    if (user.public_gpg_key != null) {
      e.preventDefault();
      const element = document.createElement('a');
      const file = new Blob([user.public_gpg_key], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${user.redhat_username}_public_gpg_key.gpg`;
      document.body.appendChild(element);
      element.click();
    }
  }
  return (
    <React.Fragment>
      <h4>Info</h4>
      <Definition
        items={[
          ['Name', user.name],
          [
            'Path',
            <a href={`${window.DATA_DIR_URL}${user.path}`} target="_blank" rel="noopener noreferrer">
              {user.path}
            </a>
          ],
          [
            'Red Hat Username',
            <a
              href={`https://mojo.redhat.com/people/${user.redhat_username}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {user.redhat_username}
            </a>
          ],
          [
            'GitHub Username',
            <a href={`https://github.com/${user.github_username}`} target="_blank" rel="noopener noreferrer">
              {user.github_username}
            </a>
          ],
          [
            'Quay Username',
            (user.quay_username && (
              <a href={`https://quay.io/user/${user.quay_username}`} target="_blank" rel="noopener noreferrer">
                {user.quay_username}
              </a>
            )) ||
              '-'
          ],
          [
            'Public gpg Key',
            <div>
              {key} {showMoreButton} {downloadKeyButton}
            </div>
          ]
        ]}
      />
      <h5> Public GPG Key </h5>
      {gpg}
      <h4>Roles</h4>
      <Roles roles={user.roles} />
    </React.Fragment>
  );
}

export default User;
