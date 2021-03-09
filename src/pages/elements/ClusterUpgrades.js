import React from 'react';
import { Link } from 'react-router-dom';

function ClusterUpgrades() {
  return (
    <div>
      This view has been deprecated in favour of <Link to="/clusters">/clusters</Link>
    </div>
  );
}

export default ClusterUpgrades;
