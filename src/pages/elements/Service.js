import React from 'react';
import { Label, Table } from 'patternfly-react';
import Definition from '../../components/Definition';
import CodeComponents from '../../components/ServiceCodeComponents';
import EndPoints from '../../components/ServiceEndPoints';
import Namespaces from '../elements/Namespaces';

function Service({ service }) {
  const headerFormat = value => <Table.Heading>{value}</Table.Heading>;
  const cellFormat = value => <Table.Cell>{value}</Table.Cell>;
  const linkFormat = url => value => <a href={`${url || ''}${value}`}>{value}</a>;
  const emptyFormat = value => value || '-';
  const booleanFormat = (t, f) => value => (value ? t : f);

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

  const dependenciesTable = (
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

  const quayReposTable = (
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
            formatters: [v => <a href={`https://quay.io/repository/${v}`}>{v.split('/')[1]}</a>, cellFormat]
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

  const serviceOwner = [
    service.serviceOwner.name,
    ' <',
    <a key={service.serviceOwner.email} href={`mailto:${service.serviceOwner.email}`}>
      {service.serviceOwner.email}
    </a>,
    '>'
  ];

  return (
    <React.Fragment>
      <h4>Description</h4>
      <p>{service.description}</p>

      <h4>Info</h4>
      <Definition items={[['SLO', service.performanceParameters.SLO], ['Service Owner', serviceOwner]]} />

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
