import React from 'react';

function GrafanaUrl({ cluster, namespace, url, hide }) {
  let grafanaUrl;
  if (url !== null && url !== undefined) {
    grafanaUrl = url;
  } else {
    const dataSource = `${cluster}-prometheus`;
    let dashboardName = 'k8s-compute-resources-cluster/kubernetes-compute-resources-cluster';
    let additionalVars = '';
    if (typeof namespace !== 'undefined') {
      dashboardName = 'k8s-compute-resources-namespace-pods/kubernetes-compute-resources-namespace-pods';
      additionalVars = `&var-namespace=${namespace}`;
    }
    grafanaUrl = `${window.GF_ROOT_URL}/d/${dashboardName}?var-datasource=${dataSource}${additionalVars}`;
  }

  return (
    <a href={grafanaUrl} target="_blank" rel="noopener noreferrer">
      {hide ? 'Link' : grafanaUrl}
    </a>
  );
}

export default GrafanaUrl;
