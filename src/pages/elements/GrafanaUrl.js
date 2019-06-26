import React from 'react';

function GrafanaUrl({ jumpHost, cluster, namespace, url }) {
  if (jumpHost !== null) {
    return 'Not available';
  }
  let grafanaUrl;
  if (url !== null && url !== undefined) {
    grafanaUrl = url;
  } else {
    const dataSource = `${cluster}-cluster-prometheus`;
    let dashboardName = 'k8s-compute-resources-cluster';
    let additionalVars = '';
    if (typeof namespace !== 'undefined') {
      dashboardName = 'k8s-compute-resources-namespace';
      additionalVars = `&var-namespace=${namespace}`;
    }
    grafanaUrl = `${window.GF_ROOT_URL}/d/${dashboardName}?var-datasource=${dataSource}${additionalVars}`;
  }

  return (
    <a href={grafanaUrl} target="_blank" rel="noopener noreferrer">
      Link
    </a>
  );
}

export default GrafanaUrl;
