import React from 'react';

function GrafanaUrl({ jumpHost, cluster, namespace }) {
  if (jumpHost !== null) {
    return 'Not available';
  }

  const dataSource = `${cluster}-cluster-prometheus`;
  let dashboardName = 'k8s-compute-resources-cluster';
  let additionalVars = '';
  if (typeof namespace !== 'undefined') {
    dashboardName = 'k8s-compute-resources-namespace';
    additionalVars = `&var-namespace=${namespace}`;
  }
  const grafanaUrl = `${window.GF_ROOT_URL}/d/${dashboardName}?var-datasource=${dataSource}${additionalVars}`;

  return (
    <a href={grafanaUrl} target="_blank" rel="noopener noreferrer">
      Link
    </a>
  );
}

export default GrafanaUrl;
