import React from 'react';
import { Table } from 'patternfly-react';
import { Link } from 'react-router-dom';
import OnboardingStatus from '../../components/OnboardingStatus';
import Definition from '../../components/Definition';
import GrafanaContainerVulnerabilities from '../../components/GrafanaContainerVulnerabilities';

const yaml = require('js-yaml');

const headerFormat = value => <Table.Heading>{value}</Table.Heading>;
const cellFormat = value => <Table.Cell>{value}</Table.Cell>;
const linkFormat = url => value => (
  <a href={`${url || ''}${value}`} target="_blank" rel="noopener noreferrer">
    {value}
  </a>
);
const booleanFormat = (t, f) => value => (value ? t : f);

// link to cluster
const LinkCluster = ({ path, name }) =>
  <Link to={{ 'pathname': '/clusters', 'hash': path }}>{name}</Link>;

// link to namespace
const LinkNS = ({ path, name }) =>
  <Link to={{ 'pathname': '/namespaces', 'hash': path }}>{name}</Link>;

// link to cluster console 
const LinkConsole = ({ consoleUrl }) => (
  <a href={`${consoleUrl || ''}/k8s/ns/openshift-customer-monitoring/secscan.quay.redhat.com~v1alpha1~ImageManifestVuln`} target="_blank" rel="noopener noreferrer">
  Console
  </a>
);

// displays the list of vulnerabilities
const Vulnerabilities = ({vs}) => {
  return <ul>
    {Object.keys(vs).map((k) => <li>{k}: {vs[k]}</li>)}
  </ul>
};

// displays the vulnerabilities section
const ReportVulnerabilities = ({ get_ns, get_escalation_policy, vulnerabilities }) => {

  let reportVulnerabilitiesTable;
  if (vulnerabilities == null) {
    reportVulnerabilitiesTable = <p style={{ 'font-style': 'italic' }}>No vulnerabilities.</p>;
  } else {
    for (var i = 0; i < vulnerabilities.length; i++) {
      vulnerabilities[i]['ns'] = get_ns(vulnerabilities[i]['cluster'], vulnerabilities[i]['namespace'])
      vulnerabilities[i]['escaltion_policy'] = get_escalation_policy(vulnerabilities[i]['ns']);
    }
    reportVulnerabilitiesTable = (
      <Table.PfProvider
        striped
        bordered
        columns={[
          {
            header: {
              label: 'Cluster / Namespace',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [ns=>(<p>
              <LinkCluster path={ns.cluster.path} name={ns.cluster.name} /> / <LinkNS path={ns.path} name={ns.name} /></p>) , cellFormat]
            },
            property: 'ns'
          },
          {
            header: {
              label: 'Grafana',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [ns=>(<GrafanaContainerVulnerabilities namespace={ns} label="Grafana Dashboard" />) , cellFormat]
            },
            property: 'ns'
          },
          {
            header: {
              label: 'Console',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [ns=>(<LinkConsole consoleUrl={ns.cluster.consoleUrl} />) , cellFormat]
            },
            property: 'ns'
          },
          {
            header: {
              label: 'Escalation Policy',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [escalation_policy=>(<p>{escalation_policy || "No info available"}</p>), cellFormat]
            },
            property: 'escalation_policy'
          },
          {
            header: {
              label: 'Vulnerabilities',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [vulnerabilities=><Vulnerabilities vs={vulnerabilities} />, cellFormat]
            },
            property: 'vulnerabilities'
          }
        ]}
      >
        <Table.Header />
        <Table.Body rows={vulnerabilities} rowKey="cluster" />
      </Table.PfProvider>
    );
  }

  return <React.Fragment>
    <h4>Vulnerabilities</h4>
    {reportVulnerabilitiesTable}
  </React.Fragment>
}

// displays the productionPromotions Table
const ProductionPromotions = ({production_promotions}) => {
  let productionPromotionsTable;
  if (production_promotions == null) {
    productionPromotionsTable = <p style={{ 'font-style': 'italic' }}>No production_promotions.</p>;
  } else {
    productionPromotionsTable = (
      <Table.PfProvider
        striped
        bordered
        columns={[
          {
            header: {
              label: 'Repo',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [linkFormat(), cellFormat]
            },
            property: 'repo'
          },
          {
            header: {
              label: 'Total',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [cellFormat]
            },
            property: 'total'
          },
          {
            header: {
              label: 'Success',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [cellFormat]
            },
            property: 'success'
          }
        ]}
      >
        <Table.Header />
        <Table.Body rows={production_promotions} rowKey="repo" />
      </Table.PfProvider>
    );
  }

  return <React.Fragment>
    <h4>Production Promotions</h4>
    {productionPromotionsTable}
  </React.Fragment>
}

// displays the MergesToMaster Table
const MergesToMaster = ({merges_to_master}) => {
  let mergesToMasterTable;
  if (merges_to_master == null) {
    mergesToMasterTable = <p style={{ 'font-style': 'italic' }}>No merges_to_master.</p>;
  } else {
    mergesToMasterTable = (
      <Table.PfProvider
        striped
        bordered
        columns={[
          {
            header: {
              label: 'Repo',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [linkFormat(), cellFormat]
            },
            property: 'repo'
          },
          {
            header: {
              label: 'Total',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [cellFormat]
            },
            property: 'total'
          },
          {
            header: {
              label: 'Success',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [cellFormat]
            },
            property: 'success'
          }
        ]}
      >
        <Table.Header />
        <Table.Body rows={merges_to_master} rowKey="repo" />
      </Table.PfProvider>
    );
  }

  return <React.Fragment>
    <h4>Merges to Master</h4>
    {mergesToMasterTable}
  </React.Fragment>
}

// displays the PostDeployJobs Table
const PostDeployJobs = ({ get_ns, post_deploy_jobs}) => {
  let postDeployJobsTable;
  if (post_deploy_jobs == null) {
    postDeployJobsTable = <p style={{ 'font-style': 'italic' }}>No post_deploy_jobs.</p>;
  } else {
    for (var i = 0; i < post_deploy_jobs.length; i++) {
      post_deploy_jobs[i]['ns'] = get_ns(post_deploy_jobs[i]['cluster'], post_deploy_jobs[i]['namespace']);
    }
    postDeployJobsTable = (
      <Table.PfProvider
        striped
        bordered
        columns={[
          {
            header: {
              label: 'Cluster / Namespace',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [ns=>(<p>
              <LinkCluster path={ns.cluster.path} name={ns.cluster.name} /> / <LinkNS path={ns.path} name={ns.name} /></p>) , cellFormat]
            },
            property: 'ns'
          },
          {
            header: {
              label: 'Grafana',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [ns=>(<GrafanaContainerVulnerabilities namespace={ns} label="Grafana Dashboard" />) , cellFormat]
            },
            property: 'ns'
          },
          {
            header: {
              label: 'Console',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [ns=>(<LinkConsole consoleUrl={ns.cluster.consoleUrl} />) , cellFormat]
            },
            property: 'ns'
          },
          {
            header: {
              label: 'Post Deploy Job',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [booleanFormat(<OnboardingStatus state={"Success"}>Success</OnboardingStatus> , <OnboardingStatus state={"Failure"}>Failure</OnboardingStatus>), cellFormat]
            },
            property: 'post_deploy_job'
          }
        ]}
      >
        <Table.Header />
        <Table.Body rows={post_deploy_jobs} rowKey="cluster" />
      </Table.PfProvider>
    );
  }


  return <React.Fragment>
    <h4>Post-deploy Jobs</h4>
    {postDeployJobsTable}
  </React.Fragment>
}

// displays the DeploymentValidations Table
const DeploymentValidations = ({ get_ns, deployment_validations}) => {

  let deploymentValidationTable;
  if (deployment_validations == null) {
    deploymentValidationTable = <p style={{ 'font-style': 'italic' }}>No deployment_validations.</p>;
  } else {
    for (var i = 0; i < deployment_validations.length; i++) {
      deployment_validations[i]['ns'] = get_ns(deployment_validations[i].cluster, deployment_validations[i].namespace);
    }
 
    deploymentValidationTable = (
      <Table.PfProvider
        striped
        bordered
        columns={[
          {
            header: {
              label: 'Cluster / Namespace',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [ns=>(<p>
              <LinkCluster path={ns.cluster.path} name={ns.cluster.name} /> / <LinkNS path={ns.path} name={ns.name} /></p>) , cellFormat]
            },
            property: 'ns'
          },
          {
            header: {
              label: 'Grafana',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [ns=>(<GrafanaContainerVulnerabilities namespace={ns} label="Grafana Dashboard" />) , cellFormat]
            },
            property: 'ns'
          },
          {
            header: {
              label: 'Request Limit Validation Passed',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [validations=>(<p>{validations.deployment_validation_operator_request_limit_validation.Passed || "No data available"}</p>), cellFormat]
            },
            property: 'validations'
          },
          {
            header: {
              label: 'Request Limit Validation Failed',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [validations=>(<p>{validations.deployment_validation_operator_request_limit_validation.Failed || "No data available"}</p>), cellFormat]
            },
            property: 'validations'
          },
          {
            header: {
              label: 'Replica Validation Passed',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [validations=>(<p>{validations.deployment_validation_operator_replica_validation.Passed || "No data available"}</p>), cellFormat]
            },
            property: 'validations'
          },
          {
            header: {
              label: 'Replica Validation Failed',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [validations=>(<p>{validations.deployment_validation_operator_replica_validation.Failed|| "No data available"}</p>), cellFormat]
            },
            property: 'validations'
          }
        ]}
      >
    
        <Table.Header />
        <Table.Body rows={deployment_validations} />
      </Table.PfProvider>
    );
  }

  return <React.Fragment>
    <h4>Deployment Validations</h4>
    {deploymentValidationTable}
  </React.Fragment>
}

function Report({ report, namespaces, escalation_policies}) {
  const content = yaml.safeLoad(report.content);
  console.log(escalation_policies);

  // fetch the namespace. Returns `undefined` if not found
  const get_ns = (c, ns) => namespaces.filter(n => n['name'] === ns && n['cluster']['name'] === c)[0];

  const get_escalation_policy = (ns) => escalation_policies.filter(n => n['name'] == ns)[0];

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
      {<ReportVulnerabilities vulnerabilities={content.container_vulnerabilities} get_ns={get_ns} get_escalation_policy={get_escalation_policy}/>}
      {<ProductionPromotions production_promotions={content.production_promotions}/>}
      {<MergesToMaster merges_to_master={content.merges_to_master}/>}
      {<PostDeployJobs post_deploy_jobs={content.post_deploy_jobs} get_ns={get_ns} />}
      {<DeploymentValidations deployment_validations={content.deployment_validations} get_ns={get_ns}/>}
    </React.Fragment>
  );
}

export default Report;
