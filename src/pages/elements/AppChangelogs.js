import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'patternfly-react';
import PaginatedTableSearch from '../../components/PaginatedTableSearch';
import { highlightText, parseMarkdownLinks } from '../../components/Utils';

function AppChangelogs({ latestAppChangelogs }) {
  const headerFormat = value => <Table.Heading>{value}</Table.Heading>;
  const cellFormat = value => <Table.Cell>{value}</Table.Cell>;
  const [filterText, changeFilterText] = useState('');

  const processedChangelogs = latestAppChangelogs.slice().map(c => {
    c.name_path = [c.app.name, c.path];
    c.date = c.latestAppChangelog.date;
    c.tagItems = c.latestAppChangelog.changes.map(
      change =>
        change.tags &&
        change.tags.map(tag => (
          <span key={tag} className={`badge label-${tag}`} onClick={_ => changeFilterText(tag)}>
            {tag}
          </span>
        ))
    );
    c.changeItems = (
      <ul className="changelog">
        {c.latestAppChangelog.changes.map(change => (
          <li key={change.description}>{highlightText(parseMarkdownLinks(change.description), filterText)}</li>
        ))}
      </ul>
    );
    return c;
  });
  const lcFilter = filterText.toLowerCase();
  function matches(c) {
    const nameMatch = c.app && c.app.name && c.app.name.toLowerCase().includes(lcFilter);
    const changelogMatch =
      c.latestAppChangelog &&
      c.latestAppChangelog.changes &&
      c.latestAppChangelog.changes.some(
        change =>
          change.description.toLowerCase().includes(lcFilter) ||
          (change.tags && change.tags.some(tag => tag.toLowerCase().includes(lcFilter)))
      );
    return nameMatch || changelogMatch;
  }
  const matchedChangelogs = useMemo(() => processedChangelogs.filter(matches), [processedChangelogs, lcFilter]);

  const columns = [
    {
      header: {
        label: 'App',
        formatters: [headerFormat]
      },
      cell: {
        formatters: [
          value => (
            <Link
              to={{
                pathname: '/servicechangelogs',
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
        label: 'Date',
        formatters: [headerFormat]
      },
      cell: {
        formatters: [cellFormat]
      },
      property: 'date'
    },
    {
      header: {
        label: 'Tags',
        formatters: [headerFormat]
      },
      cell: {
        formatters: [cellFormat]
      },
      property: 'tagItems'
    },
    {
      header: {
        label: 'Changes (Most recent)',
        formatters: [headerFormat]
      },
      cell: {
        formatters: [cellFormat]
      },
      property: 'changeItems'
    }
  ];
  return (
    <PaginatedTableSearch
      columns={columns}
      rows={matchedChangelogs}
      filterText={filterText}
      changeFilterText={changeFilterText}
    />
  );
}

export default AppChangelogs;
