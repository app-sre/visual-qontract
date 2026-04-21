import React, { useState } from 'react';
import { Table } from 'patternfly-react';
import { Link } from 'react-router-dom';
import { Form, FormGroup, FormSelect, FormSelectOption } from '@patternfly/react-core';
import { sortByName } from '../../components/Utils';
import OnboardingStatus from '../../components/OnboardingStatus';

function collectServiceOwnerNames(services) {
  const names     = services.flatMap(s => (s.serviceOwners || []).map(o => o?.name).filter(Boolean));
  const uniqNames = new Map(names.map(n => [n.toLowerCase(), n]));
  return Array.from(uniqNames.values()).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
}

function ServicesTable({ services, omitParentApp }) {
  const headerFormat = value => <Table.Heading>{value}</Table.Heading>;
  const cellFormat = value => <Table.Cell>{value}</Table.Cell>;
  const onboardingStatusFormat = value => <OnboardingStatus state={value} />;

  const rows = sortByName(services.slice()).map(s => {
    s.name_path = [s.name, s.path];
    if (s.parentApp) {
      s.parentAppLink = <Link to={{ pathname: '/services', hash: s.parentApp.path }}>{s.parentApp.name}</Link>;
    }
    if (s.serviceOwners) {
      s.serviceOwnersItems = (
        <ul>
          {s.serviceOwners.map(so => (
            <li key={so.name}>{so.name}</li>
          ))}
        </ul>
      );
    }
    return s;
  });

  let columns = [
    {
      header: {
        label: 'Name',
        formatters: [headerFormat]
      },
      cell: {
        formatters: [
          value => (
            <Link
              to={{
                pathname: '/services',
                hash: value[1]
              }}
            >
              {value[0]}
            </Link>
          ),
          cellFormat
        ]
      },
      property: 'name_path'
    },
    {
      header: {
        label: 'Onboarding Status',
        formatters: [headerFormat]
      },
      cell: {
        formatters: [onboardingStatusFormat, cellFormat]
      },
      property: 'onboardingStatus'
    },
    {
      header: {
        label: 'Service Owners',
        formatters: [headerFormat]
      },
      cell: {
        formatters: [cellFormat]
      },
      property: 'serviceOwnersItems'
    },
    {
      header: {
        label: 'Parent App',
        formatters: [headerFormat]
      },
      cell: {
        formatters: [cellFormat]
      },
      property: 'parentAppLink'
    },
    {
      header: {
        label: 'Description',
        formatters: [headerFormat]
      },
      cell: {
        formatters: [cellFormat]
      },
      property: 'description'
    }
  ];

  if (omitParentApp) {
    columns = columns.filter((value, index, array) => value.property !== 'parentAppLink');
  }

  return (
    <Table.PfProvider striped bordered columns={columns}>
      <Table.Header />
      <Table.Body rows={sortByName(rows)} rowKey="name" />
    </Table.PfProvider>
  );
}

function Services({ services, omitParentApp }) {
  const ownerNames = collectServiceOwnerNames(services);
  const [selectedOwner, setSelectedOwner] = useState('');

  const filteredServices = selectedOwner
    ? services.filter(s =>
        (s.serviceOwners || []).some(o => o && o.name && o.name.toLowerCase() === selectedOwner.toLowerCase())
      )
    : services;

  return (
    <React.Fragment>
      <Form isHorizontal style={{ maxWidth: '400px', marginBottom: '20px' }}>
        <FormGroup label="Service owner" fieldId="service-owner-select">
          <FormSelect
            id="service-owner-select"
            value={selectedOwner}
            onChange={value => setSelectedOwner(value)}
            aria-label="Filter services by owner"
          >
            <FormSelectOption value="" label="All services" />
            {ownerNames.map(name => (
              <FormSelectOption key={name} value={name} label={name} />
            ))}
          </FormSelect>
        </FormGroup>
      </Form>
      <ServicesTable services={filteredServices} omitParentApp={omitParentApp} />
    </React.Fragment>
  );
}

export default Services;
