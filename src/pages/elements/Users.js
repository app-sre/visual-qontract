import React from 'react';
import { Link } from 'react-router-dom';
import { sortByName } from '../../components/Utils';
import { Table } from 'patternfly-react';

function Users({ users }) {
  const headerFormat = value => <Table.Heading>{value}</Table.Heading>;
  const cellFormat = value => <Table.Cell>{value}</Table.Cell>;
  const linkFormat = url => value => <a href={`${url || ''}${value}`}>{value}</a>;

  const processedUsers = sortByName(users).map(u => {
    u.internalLink = (
      <Link
        to={{
          pathname: '/users',
          hash: u.path
        }}
      >
        {u.name}
      </Link>
    );
    return u;
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
            formatters: [cellFormat]
          },
          property: 'internalLink'
        },
        {
          header: {
            label: 'Red Hat',
            formatters: [headerFormat]
          },
          cell: {
            formatters: [linkFormat('https://mojo.redhat.com/people/'), cellFormat]
          },
          property: 'redhat_username'
        },
        {
          header: {
            label: 'GitHub',
            formatters: [headerFormat]
          },
          cell: {
            formatters: [linkFormat('https://github.com/'), cellFormat]
          },
          property: 'github_username'
        },
        {
          header: {
            label: 'Quay',
            formatters: [headerFormat]
          },
          cell: {
            formatters: [linkFormat('https://quay.io/user/'), cellFormat]
          },
          property: 'quay_username'
        }
      ]}
    >
      <Table.Header />
      <Table.Body rows={processedUsers} rowKey="path" />
    </Table.PfProvider>
  );
}

export default Users;
