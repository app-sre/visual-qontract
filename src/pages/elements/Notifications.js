import React, { useState } from 'react';
import { Table } from 'patternfly-react';
import { Link } from 'react-router-dom';
import { sortByName } from '../../components/Utils';
import TableSearch from '../../components/TableSearch';

function Notifications({ notifications }) {
  const headerFormat = value => <Table.Heading>{value}</Table.Heading>;
  const cellFormat = value => <Table.Cell>{value}</Table.Cell>;
  const [filterText, changeFilterText] = useState('');
  const options = ['Subject', 'Name', 'Path'];
  const [selected, changeSelected] = useState(options[0]);
  const processedNotifications = sortByName(notifications.slice()).map(n => {
    n.subject_name_path = [n.subject, n.name, n.path];
    return n;
  });
  const lcFilter = filterText.toLowerCase();
  function matches(u) {
    return (
      (selected === 'Name' && u.name.toLowerCase().includes(lcFilter)) ||
      (selected === 'Path' && u.path.toLowerCase().includes(lcFilter)) ||
      (selected === 'Subject' && u.subject.toLowerCase().includes(lcFilter))
    );
  }
  const matchedNotifications = processedNotifications.filter(matches);
  const columns = [
    {
      header: {
        label: 'Subject',
        formatters: [headerFormat]
      },
      cell: {
        formatters: [
          value => (
            <Link
              to={{
                pathname: '/notifications',
                hash: value[2]
              }}
            >
              {value[0]}
            </Link>
          ),
          cellFormat
        ]
      },
      property: 'subject_name_path'
    },
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
                pathname: '/notifications',
                hash: value[2]
              }}
            >
              {value[1]}
            </Link>
          ),
          cellFormat
        ]
      },
      property: 'subject_name_path'
    },
    {
      header: {
        label: 'Path',
        formatters: [headerFormat]
      },
      cell: {
        formatters: [
          value => (
            <Link
              to={{
                pathname: '/notifications',
                hash: value[2]
              }}
            >
              {value[2]}
            </Link>
          ),
          cellFormat
        ]
      },
      property: 'subject_name_path'
    }
  ];
  return (
    <TableSearch
      filterText={filterText}
      changeFilterText={changeFilterText}
      changeSelected={changeSelected}
      options={options}
      selected={selected}
      columns={columns}
      rows={matchedNotifications}
    />
  );
}

export default Notifications;
