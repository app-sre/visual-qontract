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

// displays the list of vulnerabilities
const Vulnerabilities = ({vs}) => {
  return <ul>
    {Object.keys(vs).map((k) => <li>{k}: {vs[k]}</li>)}
  </ul>
};

// displays the vulnerabilities section
const ReportVulnerabilities = ({ get_ns, vulnerabilities }) => {

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

const ProductionPromotions = ({content}) => {
  let productionPromotionsTable;
  if (content.production_promotions == null) {
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
        <Table.Body rows={content.production_promotions} rowKey="repo" />
      </Table.PfProvider>
    );
  }

  return <React.Fragment>
    <h4>Production Promotions</h4>
    {productionPromotionsTable}
  </React.Fragment>
}

const MergesToMaster = ({content}) => {
  let mergesToMasterTable;
  if (content.merges_to_master == null) {
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
        <Table.Body rows={content.merges_to_master} rowKey="repo" />
      </Table.PfProvider>
    );
  }

  return <React.Fragment>
    <h4>Merges to Master</h4>
    {mergesToMasterTable}
  </React.Fragment>
}

const PostDeployJobs = ({ get_ns, content}) => {
  let postDeployJobsTable;
  if (content.post_deploy_jobs == null) {
    postDeployJobsTable = <p style={{ 'font-style': 'italic' }}>No post_deploy_jobs.</p>;
  } else {
    var post_deploy_jobs = [];
    var new_job;
    for (const [i, job] of content.post_deploy_jobs.entries()) {
      new_job = {};
      new_job['ns'] = get_ns(job['cluster'], job['namespace']);
      new_job['post_deploy_job'] = job['post_deploy_job'];
      post_deploy_jobs[i] = new_job;
    }
    postDeployJobsTable = (
      <Table.PfProvider
        striped
        bordered
        columns={[
          {
            header: {
              label: 'Cluster',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [ns=>(<LinkCluster path={ns.cluster.path} name={ns.cluster.name}/>) , cellFormat]
            },
            property: 'ns'
          },
          {
            header: {
              label: 'Namespace',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [ns=>(<LinkNS path={ns.path} name={ns.name}/>), cellFormat]
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

const DeploymentValidations = ({ get_ns, content}) => {
  if (content.deployment_validations) {
    var deployment_validations_flattened = [];
    var validation;
    for (const [i, deployment] of content.deployment_validations.entries()) {
      validation= {};
      validation['ns'] = get_ns(deployment.cluster, deployment.namespace);
      validation['validations'] = deployment.validations;
      deployment_validations_flattened[i] = validation;
    }
  }

  let deploymentValidationTable;
  if (content.deployment_validations == null) {
    deploymentValidationTable = <p style={{ 'font-style': 'italic' }}>No deployment_validations.</p>;
  } else {
    deploymentValidationTable = (
      <Table.PfProvider
        striped
        bordered
        columns={[
          {
            header: {
              label: 'Cluster',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [ns=>(<LinkCluster path={ns.cluster.path} name={ns.cluster.name}/>), cellFormat]
            },
            property: 'ns'
          },
          {
            header: {
              label: 'Namespace',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [ns=>(<LinkNS path={ns.path} name={ns.name}/>), cellFormat]
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
        <Table.Body rows={deployment_validations_flattened} />
      </Table.PfProvider>
    );
  }

  return <React.Fragment>
    <h4>Deployment Validations</h4>
    {deploymentValidationTable}
  </React.Fragment>
}

function Report({ report, namespaces }) {
  const content = yaml.safeLoad(report.content);

  // fetch the namespace. Returns `undefined` if not found
  const get_ns = (c, ns) => namespaces.filter(n => n['name'] === ns && n['cluster']['name'] === c)[0];

  let valetTable;
  if (content.valet == null) {
    valetTable = <p style={{ 'font-style': 'italic' }}>No valet.</p>;
  }

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
      {vulns && <ReportVulnerabilities vulnerabilities={vulns} get_ns={get_ns}/>}
      <h4>Valet</h4>
      {valetTable}
      {<ProductionPromotions content={content}/>}
      {<MergesToMaster content={content}/>}
      {<PostDeployJobs content={content} get_ns={get_ns} />}
      {<DeploymentValidations content={content} get_ns={get_ns}/>}
      <pre>{report_content_dump}</pre>
    </React.Fragment>
  );
}

export default Report;
