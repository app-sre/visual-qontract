import React from 'react';
import Definition from '../../components/Definition';
import Namespaces from './Namespaces';
import GrafanaUrl from './GrafanaUrl';
import Roles from './Roles';

function Cluster({ cluster, roles }) {
  function matches(r) {
    const a = r.access;
    if (a === null) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== undefined && a[i].cluster && a[i].cluster.name === cluster.name) {
        return true;
      }
    }
    return false;
  }
  const matchedData = roles.filter(matches);
  const grafana = <GrafanaUrl cluster={cluster.name} url={cluster.grafanaUrl} hide={false} />;
  return (
    <React.Fragment>
      <h4>Info</h4>
      <Definition
        items={[
          ['Cluster', cluster.name],
          cluster.spec !== null && cluster.spec.version !== null && ['Version', cluster.spec.version],
          [
            'Path',
            <a href={`${window.DATA_DIR_URL}${cluster.path}`} target="_blank" rel="noopener noreferrer">
              {cluster.path}
            </a>
          ],
          [
            'Console',
            <a href={`${cluster.consoleUrl}`} target="_blank" rel="noopener noreferrer">
              {cluster.consoleUrl}
            </a>
          ],
          cluster.kibanaUrl !== null && [
            'Kibana',
            <a href={`${cluster.kibanaUrl}`} target="_blank" rel="noopener noreferrer">
              {cluster.kibanaUrl}
            </a>
          ],
          [
            'Prometheus',
            <a href={`${cluster.prometheusUrl}`} target="_blank" rel="noopener noreferrer">
              {cluster.prometheusUrl}
            </a>
          ],
          [
            'Alertmanager',
            <a href={`${cluster.alertmanagerUrl}`} target="_blank" rel="noopener noreferrer">
              {cluster.alertmanagerUrl}
            </a>
          ],
          ['Grafana', grafana],
          cluster.network !== null &&
            cluster.network.vpc !== null &&
            cluster.jumpHost !== null && [
              'SSHUTTLE COMMAND',
              `sshuttle -r ${cluster.jumpHost.hostname} ${cluster.network.vpc}`
            ],
          cluster.network !== null && cluster.network.vpc !== null && ['VPC CIDR', cluster.network.vpc],
          cluster.network !== null && cluster.network.service !== null && ['Service CIDR', cluster.network.service],
          cluster.network !== null && cluster.network.pod !== null && ['Pod CIDR', cluster.network.pod],
          cluster.spec !== null && cluster.spec.channel !== null && ['Channel', cluster.spec.channel],
          cluster.upgradePolicy !== null &&
            cluster.upgradePolicy.workloads !== null && [
              'Upgrade workloads',
              cluster.upgradePolicy.workloads.join(', ')
            ],
          cluster.upgradePolicy !== null && ['Upgrade schedule', cluster.upgradePolicy.schedule],
          cluster.upgradePolicy !== null &&
            cluster.upgradePolicy.conditions !== null &&
            cluster.upgradePolicy.conditions.soakDays !== null && [
              'Upgrade soak days',
              cluster.upgradePolicy.conditions.soakDays
            ]
        ]}
      />

      <h4>Description</h4>
      {cluster.description}

      <h4>Namespaces</h4>
      <Namespaces namespaces={cluster.namespaces} />
      {matchedData.length > 0 && (
        <React.Fragment>
          <h4> Roles </h4>
          <Roles roles={matchedData} />
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default Cluster;
