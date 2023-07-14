import React from 'react';
import ReactTooltip from 'react-tooltip';
import { Label, Table } from 'patternfly-react';
import { Link } from 'react-router-dom';
import Definition from '../../components/Definition';
import NonEmptyDefinition from '../../components/NonEmptyDefinition';
import CodeComponents from '../../components/ServiceCodeComponents';
import EndPoints from '../../components/ServiceEndPoints';
import { sortByDate } from '../../components/Utils';
import { LinkPath, DisplayNamePathList } from '../../components/NamePathList';
import Namespaces from './Namespaces';
import Reports from './Reports';
import Services from './Services';

const headerFormat = value => <Table.Heading>{value}</Table.Heading>;
const cellFormat = value => <Table.Cell>{value}</Table.Cell>;
const linkFormat = url => value => (
  <a href={`${url || ''}${value}`} target="_blank" rel="noopener noreferrer">
    {value}
  </a>
);
const emptyFormat = value => value || '-';
const booleanFormat = (t, f) => value => (value ? t : f);

// displays escalation policy
const EscalationPolicy = ({ app }) => {
  let escalationPolicyDefinition;
  if (app.escalationPolicy == null) {
    escalationPolicyDefinition = <p style={{ 'font-style': 'italic' }}>No Escalation Policy.</p>;
  } else {
    escalationPolicyDefinition = (
      <NonEmptyDefinition
        items={[
          ['Name', app.escalationPolicy.name],
          ['Path', <LinkPath item={app.escalationPolicy} />],
          ['Description', <pre>{app.escalationPolicy.description}</pre>],
          ['Email', app.escalationPolicy.channels.email],
          [
            'Jira Board',
            app.escalationPolicy.channels.jiraBoard && (
              <DisplayNamePathList items={app.escalationPolicy.channels.jiraBoard} />
            )
          ],
          [
            'Pager Duty',
            app.escalationPolicy.channels.pagerduty && <LinkPath item={app.escalationPolicy.channels.pagerduty} />
          ],
          [
            'Slack User Group',
            app.escalationPolicy.channels.slackUserGroup && (
              <DisplayNamePathList items={app.escalationPolicy.channels.slackUserGroup} />
            )
          ],
          [
            'Next Escalation Policy',
            app.escalationPolicy.channels.nextEscalationPolicy && (
              <LinkPath item={app.escalationPolicy.channels.nextEscalationPolicy} />
            )
          ]
        ]}
      />
    );
  }

  return (
    <React.Fragment>
      <h4>Escalation Policy</h4>
      {escalationPolicyDefinition}
    </React.Fragment>
  );
};

// displays the list of Pipeline Runs
const PipelineRuns = ({ saas_file, settings }) => {
  const pipeline_name = settings[0].saasDeployJobTemplate;
  const pp_ns = saas_file.pipelinesProvider.namespace;
  const pp_ns_name = pp_ns.name;
  const pp_cluster = pp_ns.cluster;
  const pp_cluster_console_url = pp_cluster.consoleUrl;
  const urls = [];
  const url_elements = [];
  let long_name;
  let short_name;
  let url;
  let elem;
  for (const template of saas_file.resourceTemplates) {
    for (const target of template.targets.filter(t => t.namespace)) {
      long_name = `${saas_file.name}-${target.namespace.environment.name}`;
      short_name = long_name.substring(0, 50); // max name length can be 63. leaving 12 for the timestamp - 51
      url = `${pp_cluster_console_url}/k8s/ns/${pp_ns_name}/tekton.dev~v1beta1~Pipeline/${pipeline_name}/Runs?name=${short_name}`;
      const tooltip =
        'to trigger a deployment, click Actions -> Start. details:<br />' +
        `saas_file_name: ${saas_file.name}<br />` +
        `env_name: ${target.namespace.environment.name}<br />` +
        `tkn_cluster_console_url: ${pp_cluster_console_url}<br />` +
        `tkn_namespace_name: ${pp_ns_name}`;
      if (!urls.includes(url)) {
        urls.push(url);
        elem = (
          <li key={url}>
            <a href={url} target="_blank" rel="noopener noreferrer" data-tip={tooltip}>
              {' '}
              {target.namespace.environment.name}{' '}
            </a>
            <ReactTooltip multiline clickable />
          </li>
        );
        url_elements.push(elem);
      }
    }
  }

  return <ul>{url_elements}</ul>;
};

// displays the saas_files section
const SaasFilesV2 = ({ saas_files, settings }) => {
  const get_saas_file = path => saas_files.filter(f => f.path === path)[0];
  let saasFilesTable;
  if (saas_files == null || saas_files.length === 0) {
    saasFilesTable = <p />;
  } else {
    saasFilesTable = (
      <Table.PfProvider
        striped
        bordered
        columns={[
          {
            header: {
              label: 'Name',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [cellFormat]
            },
            property: 'name'
          },
          {
            header: {
              label: 'Link',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [
                path => (
                  <a href={`${window.DATA_DIR_URL}/${path}`} target="_blank" rel="noopener noreferrer">
                    {path}
                  </a>
                ),
                cellFormat
              ]
            },
            property: 'path'
          },
          {
            header: {
              label: 'Pipeline Runs',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [path => <PipelineRuns saas_file={get_saas_file(path)} settings={settings} />, cellFormat]
            },
            property: 'path'
          }
        ]}
      >
        <Table.Header />
        <Table.Body rows={saas_files} rowKey="path" />
      </Table.PfProvider>
    );
  }

  return <React.Fragment>{saasFilesTable}</React.Fragment>;
};

function Service({ service, reports, saas_files_v2, settings, scorecards }) {
  function matches(r) {
    if (r.app.name === service.name) {
      return true;
    }
    return false;
  }

  const matchedReports = sortByDate(reports).filter(matches);
  const matchedSaasFilesV2 = saas_files_v2.filter(matches);
  const matchedScorecards = scorecards.filter(matches);

  let quayReposTable;
  if (service.quayRepos == null) {
    quayReposTable = <p style={{ 'font-style': 'italic' }}>No quay repos.</p>;
  } else {
    const quayRepos = service.quayRepos
      .map(orgGroup =>
        orgGroup.items.map(repo => {
          repo.id = `${orgGroup.org.name}-${repo.name}`;
          repo.repo_name = `${orgGroup.org.name}/${repo.name}`;
          repo.org_name = orgGroup.org.name;
          return repo;
        })
      )
      .reduce((flat, next) => flat.concat(next), [])
      .sort((a, b) => {
        if (a.id > b.id) return 1;
        if (a.id < b.id) return -1;
        return 0;
      });
    quayReposTable = (
      <Table.PfProvider
        striped
        bordered
        columns={[
          {
            header: {
              label: 'Name',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [
                v => (
                  <a href={`https://quay.io/repository/${v}`} target="_blank" rel="noopener noreferrer">
                    {v.split('/')[1]}
                  </a>
                ),
                cellFormat
              ]
            },
            property: 'repo_name'
          },
          {
            header: {
              label: 'Quay Org',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [linkFormat('https://quay.io/organization/'), cellFormat]
            },
            property: 'org_name'
          },
          {
            header: {
              label: 'Description',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [emptyFormat, cellFormat]
            },
            property: 'description'
          },
          {
            header: {
              label: 'Public',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [
                booleanFormat(<Label bsStyle="success">Public</Label>, <Label bsStyle="danger">Private</Label>),
                cellFormat
              ]
            },
            property: 'public'
          }
        ]}
      >
        <Table.Header />
        <Table.Body rows={quayRepos} rowKey="id" />
      </Table.PfProvider>
    );
  }
  let dependenciesTable;
  if (service.dependencies == null) {
    dependenciesTable = <p style={{ 'font-style': 'italic' }}>No dependencies.</p>;
  } else {
    dependenciesTable = (
      <Table.PfProvider
        striped
        bordered
        columns={[
          {
            header: {
              label: 'Name',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [cellFormat]
            },
            property: 'name'
          },
          {
            header: {
              label: 'Status Page',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [linkFormat(), cellFormat]
            },
            property: 'statusPage'
          },
          {
            header: {
              label: 'SLA',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [cellFormat]
            },
            property: 'SLA'
          }
        ]}
      >
        <Table.Header />
        <Table.Body rows={service.dependencies} rowKey="path" />
      </Table.PfProvider>
    );
  }
  const serviceOwners = service.serviceOwners.map(s => [
    [
      s.name,
      ' <',
      <a key={s.email} href={`mailto:${s.email}`}>
        {s.email}
      </a>,
      '>'
    ]
  ]);

  // list only latest report
  let reportSection;
  if (matchedReports.length > 0) {
    const latestReport = [matchedReports[0]].map(r => [
      [
        r.name,
        ': ',
        <Link
          to={{
            pathname: '/reports',
            hash: r.path
          }}
        >
          {r.path}
        </Link>
      ]
    ]);
    reportSection = (
      <div>
        <Definition items={latestReport} />
        <details>
          <summary>More reports</summary>
          <br />
          <Reports reports={matchedReports} />
        </details>
      </div>
    );
  } else {
    reportSection = <p style={{ 'font-style': 'italic' }}>No Latest Report.</p>;
  }

  // scorecards
  let scorecardSection;
  if (matchedScorecards.length > 0) {
    const scorecard = matchedScorecards[0];
    const scorecardLink = (
      <Link to={{ pathname: '/scorecard', hash: scorecard.path }}>Scorecard for {service.name}</Link>
    );
    scorecardSection = scorecardLink;
  } else {
    scorecardSection = <p>None</p>;
  }

  // grafanaUrls
  const grafanaUrls = service.grafanaUrls.map(g => [
    [
      g.title,
      ': ',
      <a key={g.title} href={g.url}>
        {g.url}
      </a>
    ]
  ]);

  return (
    <React.Fragment>
      <h4>Description</h4>
      <p>{service.description}</p>

      <h4>Grafana Urls</h4>
      <Definition items={grafanaUrls} />

      <h4>Info</h4>
      <Definition items={[['Onboarding Status', service.onboardingStatus]]} />

      <h4>Service Owners</h4>
      <Definition items={serviceOwners} />

      {<EscalationPolicy app={service} />}

      <h4>Scorecard</h4>
      {scorecardSection}

      <h4>Reports</h4>
      {reportSection}

      <h4>Saas Files</h4>
      {<SaasFilesV2 saas_files={matchedSaasFilesV2} settings={settings} />}

      {service.childrenApps.length > 0 && (
        <React.Fragment>
          <h4>Children Services</h4>
          <Services services={service.childrenApps} omitParentApp />
        </React.Fragment>
      )}

      {service.serviceDocs && (
        <React.Fragment>
          <h4>Service Docs</h4>
          <ul>
            {service.serviceDocs.map(d => (
              <li>
                <a href={d.startsWith('http') ? d : `${window.DOCS_BASE_URL}${d}`}>{d}</a>
              </li>
            ))}
          </ul>
        </React.Fragment>
      )}

      {service.codeComponents && (
        <React.Fragment>
          <h4>Code Components</h4>
          <CodeComponents components={service.codeComponents} />
        </React.Fragment>
      )}

      {service.endPoints && (
        <React.Fragment>
          <h4>End Points</h4>
          <EndPoints endPoints={service.endPoints} />
        </React.Fragment>
      )}

      <h4>Namespaces</h4>
      <Namespaces namespaces={service.namespaces} />

      <h4>Dependencies</h4>
      {dependenciesTable}

      <h4>Quay Repos</h4>
      {quayReposTable}
    </React.Fragment>
  );
}

export default Service;
