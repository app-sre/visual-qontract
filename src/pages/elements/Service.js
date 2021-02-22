import React from 'react';
import { Label, Table } from 'patternfly-react';
import { Link } from 'react-router-dom';
import Definition from '../../components/Definition';
import CodeComponents from '../../components/ServiceCodeComponents';
import EndPoints from '../../components/ServiceEndPoints';
import { sortByDate } from '../../components/Utils';
import Namespaces from './Namespaces';
import Reports from './Reports';
import Documents from './Documents';
import GrafanaUrl from './GrafanaUrl';
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
const EscalationPolicy = ({app}) => {
  let escalationPolicyDefinition;
  if (app.escalationPolicy == null) {
    escalationPolicyDefinition = <p style={{ 'font-style': 'italic' }}>No Escalation Policy.</p>;
  } else {
    escalationPolicyDefinition = 
      <Definition
        items={[
          ['Name', app.escalationPolicy.name],
          [
            'Path',
            <a href={`${window.DATA_DIR_URL}/${app.escalationPolicy.path}`} target="_blank" rel="noopener noreferrer">
              {app.escalationPolicy.name}
            </a>
          ],
          [
            'Description',
            <pre>{app.escalationPolicy.description}</pre>
          ]
        ]}
      />
  }
  return <React.Fragment>
    <h4>Escalation Policy</h4>
    {escalationPolicyDefinition}
  </React.Fragment>
}

// displays the list of Saas Deploy Jobs
const SaasDeployJobs = ({f, settings}) => {
  const job_template_name = settings[0].saasDeployJobTemplate;
  var job_lst = [];
  var job_name_lst = [];
  var job_name;
  for (var template of f.resourceTemplates) {
    for (var target of template.targets) {
      job_name = job_template_name + '-' + f.name + '-' + target.namespace.environment.name;
      if (!job_name_lst.includes(job_name)) {
        job_lst.push(<li><a href={f.instance.serverUrl + "/job/" + job_name + "/api/json?tree=builds[timestamp,result]"}> {job_name} </a></li>);
        job_name_lst.push(job_name);
      }
    }
  }
  
  return <ul>
    {job_lst}
  </ul>
};

// displays the saas_files section
const SaasFiles = ({ saas_files, settings}) => {
  const get_saas_file = (path) => saas_files.filter(f => f['path'] === path)[0];
  let saasFilesTable;
  if (saas_files == null) {
    saasFilesTable = <p style={{ 'font-style': 'italic' }}>No Saas Files.</p>;
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
              formatters: [path=>(<a href={`${window.DATA_DIR_URL}/${path}`} target="_blank" rel="noopener noreferrer">
              {path}
            </a>) , cellFormat]
            },
            property: 'path'
          },
          {
            header: {
              label: 'Sass Deploy Jobs',
              formatters: [headerFormat]
            },
            cell: {
              formatters: [path=><SaasDeployJobs f={get_saas_file(path)} settings={settings}/>, cellFormat]
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

  return <React.Fragment>
    <h4>Saas Files</h4>
    {saasFilesTable}
  </React.Fragment>
}

function Service({ service, reports, documents, saas_files, settings}) {

  function matches(r) {
    if (r.app.name === service.name) {
      return true;
    }
    return false;
  }
  const matchedReports = sortByDate(reports).filter(matches);
  const matchedDocuments = documents.filter(matches);

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
  let latestReport;
  if (matchedReports.length > 0) {
    latestReport = [matchedReports[0]].map(r => [
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
  } 
  
  return (
    <React.Fragment>
      <h4>Description</h4>
      <p>{service.description}</p>

      {service.grafanaUrl &&
        <div><h4>Grafana</h4>
          <p><GrafanaUrl jumpHost={null} url={service.grafanaUrl} hide={false} /></p>
        </div>}

      <h4>Info</h4>
      <Definition items={[['Onboarding Status', service.onboardingStatus]]} />
      <Definition items={[['SLO', service.performanceParameters.SLO]]} />

      <h4>Service Owners</h4>
      <Definition items={serviceOwners} />

      {<EscalationPolicy app={service}/>}

      {matchedReports.length === 0 &&
        <div>
          <h4>Reports</h4>
          <p style={{ 'font-style': 'italic' }}>No Latest Report.</p>
        </div>
      }

      {matchedReports.length > 0 &&
        <div>      
          <h4>Reports</h4>
          <Definition items={latestReport} />
          <details>
              <summary>More reports</summary>
              <br></br>
              <Reports reports={matchedReports} />
          </details>
        </div>}

     
      {<SaasFiles saas_files={ saas_files.filter(matches)} settings={settings} />}

      {service.childrenApps.length > 0 &&
        <React.Fragment>
          <h4>Children Services</h4>
          <Services services={service.childrenApps} table={true} />
        </React.Fragment>
      }

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

      {matchedDocuments.length > 0 && (
        <React.Fragment>
          <h4>Documents</h4>
          <Documents documents={matchedDocuments} />
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default Service;
