import React from 'react';

function GrafanaContainerVulnerabilities({ namespace, label }) {
  const url = `https://grafana.app-sre.devshift.net/d/dashdotdb/dash-db?var-cluster=${namespace.cluster.name}&var-namespace=${namespace.name}`;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      {label || url}
    </a>
  );
}

export default GrafanaContainerVulnerabilities;
