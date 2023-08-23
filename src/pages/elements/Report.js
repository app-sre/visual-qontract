import React from 'react';
import { Table } from 'patternfly-react';
import { Link } from 'react-router-dom';
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
const LinkCluster = ({ path, name }) => <Link to={{ pathname: '/clusters', hash: path }}>{name}</Link>;

// link to namespace
const LinkNS = ({ path, name }) => <Link to={{ pathname: '/namespaces', hash: path }}>{name}</Link>;

// link to cluster console
const LinkConsole = ({ consoleUrl }) => (
  <a
    href={`${consoleUrl || ''}/k8s/ns/openshift-customer-monitoring/secscan.quay.redhat.com~v1alpha1~ImageManifestVuln`}
    target="_blank"
    rel="noopener noreferrer"
  >
    Console
  </a>
);

// link to Grafana
const LinkGrafana = ({ grafanaUrl }) => (
  <a href={grafanaUrl} target="_blank" rel="noopener noreferrer">
    Dashboard
  </a>
);

// displays the list of vulnerabilities
const Vulnerabilities = ({ vs }) => (
  <ul>
    {Object.keys(vs).map(k => (
      <li>
        {k}: {vs[k]}
      </li>
    ))}
  </ul>
);

// displays the vulnerabilities section
const ReportVulnerabilities = ({ get_ns, vulnerabilities }) => {
  let reportVulnerabilitiesTable;
  if (vulnerabilities == null) {
    reportVulnerabilitiesTable = <p style={{ 'font-style': 'italic' }}>No vulnerabilities.</p>;
  } else {
    for (let i = 0; i < vulnerabilities.length; i++) {
      vulnerabilities[i].ns = get_ns(vulnerabilities[i].cluster, vulnerabilities[i].namespace);
      vulnerabilities[i].row_key = `${vulnerabilities[i].cluster}-${vulnerabilities[i].namespace}`;
    }
    // do not display if ns not found
    vulnerabilities = vulnerabilities.filter(v => typeof v.ns !== 'undefined');
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
              formatters: [
                ns => (
                  <p>
                    <LinkCluster path={ns.cluster.path} name={ns.cluster.name} /> /{' '}
                    <LinkNS path={ns.path} name={ns.name} />
                  </p>
                ),
                cellFormat
              ]
            },
            property: 'ns'
          },
          {
            header: {
              label: 'Grafana',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [
                ns => <GrafanaContainerVulnerabilities namespace={ns} label="Grafana Dashboard" />,
                cellFormat
              ]
            },
            property: 'ns'
          },
          {
            header: {
              label: 'Console',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [ns => <LinkConsole consoleUrl={ns.cluster.consoleUrl} />, cellFormat]
            },
            property: 'ns'
          },
          {
            header: {
              label: 'Vulnerabilities',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [vs => <Vulnerabilities vs={vs} />, cellFormat]
            },
            property: 'vulnerabilities'
          }
        ]}
      >
        <Table.Header />
        <Table.Body rows={vulnerabilities} rowKey="row_key" />
      </Table.PfProvider>
    );
  }

  return (
    <React.Fragment>
      <h4>Vulnerabilities</h4>
      {reportVulnerabilitiesTable}
    </React.Fragment>
  );
};

// displays the productionPromotions Table
const ProductionPromotions = ({ production_promotions }) => {
  const productionPromotionsTable = (
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

  return (
    <React.Fragment>
      <h4>Production Promotions</h4>
      {productionPromotionsTable}
    </React.Fragment>
  );
};

// displays the Promotions Table
const Promotions = ({ promotions, get_ns, saas_files }) => {
  const get_saas_file = name => saas_files.filter(f => f.name === name)[0];
  const promotions_flattened = [];
  const promotions_row_keys = [];
  let promotion;
  for (const saas_file_name in promotions) {
    if (Object.prototype.hasOwnProperty.call(promotions, saas_file_name)) {
      for (let i = 0; i < promotions[saas_file_name].length; i++) {
        promotion = promotions[saas_file_name][i];
        promotion.saas_file = get_saas_file(saas_file_name);
        promotion.ns = get_ns(promotion.cluster, promotion.namespace);
        promotion.row_key = `${saas_file_name}-${promotion.env}-${promotion.cluster}-${promotion.namespace}`;
        if (!promotions_row_keys.includes(promotion.row_key)) {
          promotions_flattened.push(promotion);
          promotions_row_keys.push(promotion.row_key);
        }
      }
    }
  }
  const promotionsTable = (
    <Table.PfProvider
      striped
      bordered
      columns={[
        {
          header: {
            label: 'Saas File',
            formatters: [headerFormat]
          },
          cell: {
            formatters: [
              saas_file => (
                <p>
                  <a href={`${window.DATA_DIR_URL}/${saas_file.path}`} target="_blank" rel="noopener noreferrer">
                    {saas_file.name}
                  </a>
                </p>
              ),
              cellFormat
            ]
          },
          property: 'saas_file'
        },
        {
          header: {
            label: 'Environment',
            formatters: [headerFormat]
          },
          cell: {
            formatters: [cellFormat]
          },
          property: 'env'
        },
        {
          header: {
            label: 'Cluster / Namespace',
            formatters: [headerFormat]
          },
          cell: {
            formatters: [
              ns => (
                <p>
                  <LinkCluster path={ns.cluster.path} name={ns.cluster.name} /> /{' '}
                  <LinkNS path={ns.path} name={ns.name} />
                </p>
              ),
              cellFormat
            ]
          },
          property: 'ns'
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
      <Table.Body rows={promotions_flattened} rowKey="row_key" />
    </Table.PfProvider>
  );

  return (
    <React.Fragment>
      <h4>Promotions</h4>
      {promotionsTable}
    </React.Fragment>
  );
};

// displays the MergesToMaster Table
const MergesToMaster = ({ merges_to_master }) => {
  const mergesToMasterTable = (
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

  return (
    <React.Fragment>
      <h4>Merges to Master</h4>
      {mergesToMasterTable}
    </React.Fragment>
  );
};

// displays the MergeActivities Table
const MergeActivities = ({ merge_activities }) => {
  const merge_activities_flattened = [];
  let merge_activity;
  for (const repo in merge_activities) {
    if (Object.prototype.hasOwnProperty.call(merge_activities, repo)) {
      for (let i = 0; i < merge_activities[repo].length; i++) {
        merge_activity = merge_activities[repo][i];
        merge_activity.repo = repo;
        merge_activities_flattened.push(merge_activity);
      }
    }
  }

  const MergeActivitiesTable = (
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
            label: 'Branch',
            formatters: [headerFormat]
          },
          cell: {
            formatters: [cellFormat]
          },
          property: 'branch'
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
      <Table.Body rows={merge_activities_flattened} rowKey="repo" />
    </Table.PfProvider>
  );

  return (
    <React.Fragment>
      <h4>Merge Activities</h4>
      {MergeActivitiesTable}
    </React.Fragment>
  );
};

// displays the PostDeployJobs Table
const PostDeployJobs = ({ get_ns, post_deploy_jobs }) => {
  let postDeployJobsTable;
  if (post_deploy_jobs == null) {
    postDeployJobsTable = <p style={{ 'font-style': 'italic' }}>No post_deploy_jobs.</p>;
  } else {
    for (let i = 0; i < post_deploy_jobs.length; i++) {
      post_deploy_jobs[i].ns = get_ns(post_deploy_jobs[i].cluster, post_deploy_jobs[i].namespace);
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
              formatters: [
                ns => (
                  <p>
                    <LinkCluster path={ns.cluster.path} name={ns.cluster.name} /> /{' '}
                    <LinkNS path={ns.path} name={ns.name} />
                  </p>
                ),
                cellFormat
              ]
            },
            property: 'ns'
          },
          {
            header: {
              label: 'Grafana',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [
                ns => <GrafanaContainerVulnerabilities namespace={ns} label="Grafana Dashboard" />,
                cellFormat
              ]
            },
            property: 'ns'
          },
          {
            header: {
              label: 'Console',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [ns => <LinkConsole consoleUrl={ns.cluster.consoleUrl} />, cellFormat]
            },
            property: 'ns'
          },
          {
            header: {
              label: 'Post Deploy Job',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [
                booleanFormat(
                  <span style={{ backgroundColor: 'green' }} className="badge Exist">
                    Exist
                  </span>,
                  <span style={{ backgroundColor: 'red' }} className="badge NotExist">
                    Not Exist
                  </span>
                ),
                cellFormat
              ]
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

  return (
    <React.Fragment>
      <h4>Post-deploy Jobs</h4>
      {postDeployJobsTable}
    </React.Fragment>
  );
};

// displays the DeploymentValidations Table
const DeploymentValidations = ({ get_ns, deployment_validations }) => {
  let deploymentValidationTable;
  if (deployment_validations == null) {
    deploymentValidationTable = <p style={{ 'font-style': 'italic' }}>No deployment_validations.</p>;
  } else {
    for (let i = 0; i < deployment_validations.length; i++) {
      deployment_validations[i].ns = get_ns(deployment_validations[i].cluster, deployment_validations[i].namespace);
      deployment_validations[i].row_key = `${deployment_validations[i].cluster}-${deployment_validations[i].namespace}`;
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
              formatters: [
                ns => (
                  <p>
                    <LinkCluster path={ns.cluster.path} name={ns.cluster.name} /> /{' '}
                    <LinkNS path={ns.path} name={ns.name} />
                  </p>
                ),
                cellFormat
              ]
            },
            property: 'ns'
          },
          {
            header: {
              label: 'Grafana',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [
                ns => <GrafanaContainerVulnerabilities namespace={ns} label="Grafana Dashboard" />,
                cellFormat
              ]
            },
            property: 'ns'
          },
          {
            header: {
              label: 'Request Limit Validation Passed',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [
                validations => (
                  <p>
                    {('deployment_validation_operator_request_limit_validation' in validations &&
                      validations.deployment_validation_operator_request_limit_validation.Passed) ||
                      'No data available'}
                  </p>
                ),
                cellFormat
              ]
            },
            property: 'validations'
          },
          {
            header: {
              label: 'Request Limit Validation Failed',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [
                validations => (
                  <p>
                    {('deployment_validation_operator_request_limit_validation' in validations &&
                      validations.deployment_validation_operator_request_limit_validation.Failed) ||
                      'No data available'}
                  </p>
                ),
                cellFormat
              ]
            },
            property: 'validations'
          },
          {
            header: {
              label: 'Replica Validation Passed',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [
                validations => (
                  <p>
                    {('deployment_validation_operator_replica_validation' in validations &&
                      validations.deployment_validation_operator_replica_validation.Passed) ||
                      'No data available'}
                  </p>
                ),
                cellFormat
              ]
            },
            property: 'validations'
          },
          {
            header: {
              label: 'Replica Validation Failed',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [
                validations => (
                  <p>
                    {('deployment_validation_operator_replica_validation' in validations &&
                      validations.deployment_validation_operator_replica_validation.Failed) ||
                      'No data available'}
                  </p>
                ),
                cellFormat
              ]
            },
            property: 'validations'
          }
        ]}
      >
        <Table.Header />
        <Table.Body rows={deployment_validations} rowKey="row_key" />
      </Table.PfProvider>
    );
  }

  return (
    <React.Fragment>
      <h4>Deployment Validations</h4>
      {deploymentValidationTable}
    </React.Fragment>
  );
};

// populates extra fields for 'service_slo'
const add_to_slo = (get_ns, service_slo, slo_doc) => {
  service_slo.ns = get_ns(service_slo.cluster, service_slo.namespace);
  service_slo.grafana = slo_doc.slos.filter(slo => slo.name === service_slo.slo_name)[0].dashboard;
  const { slo_value, slo_target } = service_slo;
  if (slo_value >= slo_target) {
    service_slo.slo_pair = (
      <span style={{ backgroundColor: 'green' }} className="badge Pass">
        {' '}
        {slo_value} / {slo_target}
      </span>
    );
  } else {
    service_slo.slo_pair = (
      <span style={{ backgroundColor: 'red' }} className="badge Fail">
        {' '}
        {slo_value} / {slo_target}
      </span>
    );
  }
};

// gets the slo_doc from 'slo_documents_for_report' that matches the slo_item
const get_doc_for_slo = (slo_documents_for_report, slo_item) => {
  let slo_doc;
  if (slo_documents_for_report.length === 1) {
    [slo_doc] = slo_documents_for_report;
  } else if (slo_item.slo_doc_name === undefined) {
    // If slo_doc is not found from the filter, this means the report was generated before we started
    // to include the 'slo_doc_name' property in SLO reports. If there is only 1 item in
    // 'slo_documents_for_report', we can safely assume that this is the correct item.
    // If there is more than 1 item in 'slo_documents_for_report', and the filter finds no items, we
    // have no way of knowing for sure which slo_document this SLO actually applies to. Therefore, we
    // arbitrarily use the first item in 'slo_documents_for_report' to give the illusion that things are
    // fine... arguably in this case it may be more appropriate to error out and not display any slo-table
    // at all?
    [slo_doc] = slo_documents_for_report;
    console.warn(`No 'slo_doc_name' for ${slo_item.slo_name}! SLO data shown may be inaccurate!`);
  } else {
    [slo_doc] = slo_documents_for_report.filter(doc => doc.name === slo_item.slo_doc_name);
    if (slo_doc === undefined) {
      throw new Error(`slo-doc ${slo_item.slo_doc_name} for slo ${slo_item.slo_name} not found!`);
    }
  }
  return slo_doc;
};

// displays the ServiceSLO Table
const ServiceSLO = ({ get_ns, service_slo, slo_documents_for_report }) => {
  let ServiceSLOTable;
  if (service_slo != null && slo_documents_for_report.length === 0) {
    throw new Error(`No SLO documents found relating to SLOs`);
  }
  if (service_slo == null) {
    ServiceSLOTable = <p style={{ 'font-style': 'italic' }}>No service_slo.</p>;
  } else {
    for (let i = 0; i < service_slo.length; i++) {
      const slo_doc = get_doc_for_slo(slo_documents_for_report, service_slo[i]);
      add_to_slo(get_ns, service_slo[i], slo_doc);
    }
    ServiceSLOTable = (
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
              formatters: [
                ns => (
                  <p>
                    <LinkCluster path={ns.cluster.path} name={ns.cluster.name} /> /{' '}
                    <LinkNS path={ns.path} name={ns.name} />
                  </p>
                ),
                cellFormat
              ]
            },
            property: 'ns'
          },
          {
            header: {
              label: 'SLO Document',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [cellFormat]
            },
            // This will be blank for reports produced before we started including 'slo_doc_name'
            // in slo reports!
            property: 'slo_doc_name'
          },
          {
            header: {
              label: 'SLO Name',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [cellFormat]
            },
            property: 'slo_name'
          },
          {
            header: {
              label: 'Grafana',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [grafana => <LinkGrafana grafanaUrl={grafana} />, cellFormat]
            },
            property: 'grafana'
          },
          {
            header: {
              label: 'SLO Value / SLO Target',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [cellFormat]
            },
            property: 'slo_pair'
          }
        ]}
      >
        <Table.Header />
        <Table.Body rows={service_slo} rowKey="cluster" />
      </Table.PfProvider>
    );
  }

  return (
    <React.Fragment>
      <h4>Service SLO</h4>
      {ServiceSLOTable}
    </React.Fragment>
  );
};

function Report({ report, namespaces, saas_files, slo_documents }) {
  const content = yaml.safeLoad(report.content);

  // fetch the namespace. Returns `undefined` if not found
  const get_ns = (c, ns) => namespaces.filter(n => n.name === ns && n.cluster.name === c)[0];

  const slo_documents_for_report = [];
  let ns;
  for (let i = 0; i < slo_documents.length; i++) {
    for (let j = 0; j < slo_documents[i].namespaces.length; j++) {
      ns = slo_documents[i].namespaces[j].namespace;
      if (ns.app.name === report.app.name) {
        slo_documents_for_report.push(slo_documents[i]);
        break;
      }
    }
  }

  // production_promotions is deprecated and will be replaced by promotions
  // starting from April 2021
  let promotionSection;
  if (content.promotions) {
    promotionSection = <Promotions promotions={content.promotions} get_ns={get_ns} saas_files={saas_files} />;
  } else if (content.production_promotions) {
    promotionSection = <ProductionPromotions production_promotions={content.production_promotions} />;
  } else {
    promotionSection = (
      <React.Fragment>
        <h4>Promotions</h4>
        <p style={{ 'font-style': 'italic' }}>No promotions.</p>
      </React.Fragment>
    );
  }

  // merges_to_master is deprecated and will be replaced by merge_activities
  // starting from April 2021
  let mergeSection;
  if (content.merge_activities) {
    mergeSection = <MergeActivities merge_activities={content.merge_activities} />;
  } else if (content.merges_to_master) {
    mergeSection = <MergesToMaster merges_to_master={content.merges_to_master} />;
  } else {
    mergeSection = (
      <React.Fragment>
        <h4>Merge Activties</h4>
        <p style={{ 'font-style': 'italic' }}>No merge_activities.</p>
      </React.Fragment>
    );
  }

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
      {<ReportVulnerabilities vulnerabilities={content.container_vulnerabilities} get_ns={get_ns} />}
      {promotionSection}
      {mergeSection}
      {<PostDeployJobs post_deploy_jobs={content.post_deploy_jobs} get_ns={get_ns} />}
      {<DeploymentValidations deployment_validations={content.deployment_validations} get_ns={get_ns} />}
      {
        <ServiceSLO
          service_slo={content.service_slo}
          get_ns={get_ns}
          slo_documents_for_report={slo_documents_for_report}
        />
      }
    </React.Fragment>
  );
}

export default Report;
