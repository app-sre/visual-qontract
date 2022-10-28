import React from 'react';
import { Table } from 'patternfly-react';
import { Link } from 'react-router-dom';
import { sortByName } from '../../components/Utils';
import OnboardingStatus from '../../components/OnboardingStatus';

function Services({ services }) {
  const headerFormat = value => <Table.Heading>{value}</Table.Heading>;
  const cellFormat = value => <Table.Cell>{value}</Table.Cell>;
  const onboardingStatusFormat = value => <OnboardingStatus state={value} />;
  services = sortByName(services.slice()).map(s => {
    s.name_path = [s.name, s.path];
    if (s.parentApp) {
      s.parentApp_name_path = <Link to={{ pathname: '/services', hash: s.parentApp.path }} >{s.parentApp.name}</Link>
    }
    return s;
  });

  return (
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
            label: 'Parent App',
            formatters: [headerFormat]
          },
          cell: {
            formatters: [cellFormat]
          },
          property: 'parentApp_name_path'
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
      ]}
    >
      <Table.Header />
      <Table.Body rows={sortByName(services)} rowKey="name" />
    </Table.PfProvider>
  );
}

export default Services;
