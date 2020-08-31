import React from 'react';
import { Link } from 'react-router-dom';

import Definition from '../../components/Definition';
import GrafanaContainerVulnerabilities from '../../components/GrafanaContainerVulnerabilities';

const yaml = require('js-yaml');

// link to cluster
const LinkCluster = ({ path, name }) =>
  <Link to={{ 'pathname': '/clusters', 'hash': path }}>{name}</Link>;

// link to namespace
const LinkNS = ({ path, name }) =>
  <Link to={{ 'pathname': '/namespaces', 'hash': path }}>{name}</Link>;

// displays the list of vulnerabilities
const Vulnerabilities = ({vs}) => {
  return <ul>
    {Object.keys(vs).map((k) => <li>{k}: {vs[k]}</li>)}
  </ul>
};

// displays the vulnerabilities section
const ReportVulnerabilities = ({ namespaces, vulnerabilities }) => {

  // fetch the namespace. Returns `undefined` if not found
  const get_ns = (c, ns) => namespaces.filter(n => n['name'] === ns && n['cluster']['name'] === c)[0];

  return <React.Fragment>
    <h4>Vulnerabilities</h4>
    <ul>
      {vulnerabilities.map(e => {
        const ns = get_ns(e["cluster"], e["namespace"])
        if (typeof (ns) === 'undefined') {
          return <li key={e["cluster"] + e["namespace"]}>
            {e["cluster"]} / {e["namespace"]}: <Vulnerabilities vs={e['vulnerabilities']} />
          </li>
        } else {
          return <li key={e["cluster"] + e["namespace"]}>
            <LinkCluster path={ns.cluster.path} name={ns.cluster.name} /> / <LinkNS path={ns.path} name={ns.name} /> (
              <GrafanaContainerVulnerabilities namespace={ns} label="Grafana Dashboard" />
            ): <Vulnerabilities vs={e['vulnerabilities']} />
          </li>
        }
      })}
    </ul>
  </React.Fragment>
}

function Report({ report, namespaces }) {
  const content = yaml.safeLoad(report.content);

  const vulns = content['container_vulnerabilities'];
  delete content.container_vulnerabilities;

  const report_content_dump = yaml.safeDump(content);

  return (
    <React.Fragment>
      <h4>Info</h4>
      <Definition
        items={[
          ['Report name', report.name],
          [
            'Path',
            <a href={`${window.DATA_DIR_URL}/${report.path}`} target="_blank" rel="noopener noreferrer">
              {report.path}
            </a>
          ],
          [
            'App',
            <Link
              to={{
                pathname: '/services',
                hash: report.app.path
              }}
            >
              {report.app.name}
            </Link>
          ],
          ['Date', report.date]
        ]}
      />
      {vulns && <ReportVulnerabilities namespaces={namespaces} vulnerabilities={vulns} />}
      <h4>Content</h4>
      <pre>{report_content_dump}</pre>
    </React.Fragment>
  );
}

export default Report;
