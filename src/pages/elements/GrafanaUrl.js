import React from 'react';

function GrafanaUrl({ cluster, namespace }) {
  var rootUrl = window.GF_ROOT_URL;
  var dataSource = cluster + '-cluster-prometheus';
  var additionalVars = '';
  var dashboardName = 'k8s-compute-resources-cluster';
  if (namespace !== 'undefined') {
    dashboardName = 'k8s-compute-resources-namespace';
    additionalVars = '&var-namespace=' + namespace;
  }
  var grafanaUrl = rootUrl + '/d/' + dashboardName + '?var-datasource=' + dataSource + additionalVars;

  return <a href={grafanaUrl} target={`_blank`}>Link</a>;
}

export default GrafanaUrl;
