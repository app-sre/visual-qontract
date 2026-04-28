import React from 'react';
import { Button } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { ENV } from '../utils/env';

interface GrafanaUrlProps {
  cluster: string;
  namespace?: string;
  url?: string | null;
  hide?: boolean;
  variant?: 'link' | 'secondary' | 'primary';
  style?: React.CSSProperties;
}

const GrafanaUrl: React.FC<GrafanaUrlProps> = ({
  cluster,
  namespace,
  url,
  hide = false,
  variant = 'link',
  style = {}
}) => {
  let grafanaUrl;
  if (url !== null && url !== undefined && url !== '') {
    grafanaUrl = url;
  } else {
    const dataSource = `${cluster}-prometheus`;
    let dashboardName = 'k8s-compute-resources-cluster/kubernetes-compute-resources-cluster';
    let additionalVars = '';
    if (typeof namespace !== 'undefined') {
      dashboardName = 'k8s-compute-resources-namespace-pods/kubernetes-compute-resources-namespace-pods';
      additionalVars = `&var-namespace=${namespace}`;
    }
    const grafanaBaseUrl = ENV.GRAFANA_URL;
    grafanaUrl = `${grafanaBaseUrl}/d/${dashboardName}?var-datasource=${dataSource}${additionalVars}`;
  }

  return (
    <Button
      variant={variant}
      component="a"
      href={grafanaUrl}
      target="_blank"
      rel="noopener noreferrer"
      icon={<ExternalLinkAltIcon />}
      iconPosition="right"
      style={style}
    >
{hide ? 'View Dashboard' : 'Grafana'}
    </Button>
  );
};

export default GrafanaUrl;