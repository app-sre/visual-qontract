import React from 'react';
import { Table } from 'patternfly-react';
import { Link } from 'react-router-dom';
import { sortByName } from '../../components/Utils';
import OnboardingStatus from '../../components/OnboardingStatus';

function Services({ services, omitParentApp }) {
  const headerFormat = value => <Table.Heading>{value}</Table.Heading>;
  const cellFormat = value => <Table.Cell>{value}</Table.Cell>;
  const onboardingStatusFormat = value => <OnboardingStatus state={value} />;

  services = sortByName(services.slice()).map(s => {
    s.name_path = [s.name, s.path];
    if (s.parentApp) {
      s.parentAppLink = <Link to={{ pathname: '/services', hash: s.parentApp.path }}>{s.parentApp.name}</Link>;
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
      <Table.Body rows={sortByName(services)} rowKey="name" />
    </Table.PfProvider>
  );
}

export default Services;
