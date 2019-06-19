import React from 'react';

function AWSGroup({ awsgroup }) {
  return (
    <React.Fragment>
      <h4>Info</h4>

      <h4>Description</h4>
      {awsgroup.description}

      <h4>Policies</h4>
      {awsgroup.policies}
    </React.Fragment>
  );
}

export default AWSGroup;
