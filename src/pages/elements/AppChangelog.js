import React, { useState, useMemo } from 'react';
import { Table } from 'patternfly-react';
import { sortByDate, highlightText, parseMarkdownLinks } from '../../components/Utils';
import PaginatedTableSearch from '../../components/PaginatedTableSearch';

function AppChangelog({ appChangelog }) {
  const headerFormat = value => <Table.Heading>{value}</Table.Heading>;
  const cellFormat = value => <Table.Cell>{value}</Table.Cell>;
  const [filterText, changeFilterText] = useState('');

  const processedChanges = sortByDate(
    appChangelog.changelog.slice().map(c => {
      c.path = [c.date, c.changes];
      c.tagItems = c.changes.map(
        change =>
          change.tags &&
          change.tags.map(tag => (
            <span key={tag} className={`badge label-${tag}`} onClick={_ => changeFilterText(tag)}>
              {tag}
            </span>
          ))
      );
      c.changesItems = (
        <ul className="changelog">
          {c.changes.map(change => (
            <li key={change.description}>{highlightText(parseMarkdownLinks(change.description), filterText)}</li>
          ))}
        </ul>
      );
      return c;
    })
  );

  const lcFilter = filterText.toLowerCase();
  function matches(c) {
    const changesMatch =
      c.changes &&
      c.changes.some(
        change =>
          change.description.toLowerCase().includes(lcFilter) ||
          (change.tags && change.tags.some(tag => tag.toLowerCase().includes(lcFilter)))
      );
    return changesMatch;
  }
  const matchedChanges = useMemo(() => processedChanges.filter(matches), [processedChanges, lcFilter]);

  const columns = [
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
        label: 'Changes',
        formatters: [headerFormat]
      },
      cell: {
        formatters: [cellFormat]
      },
      property: 'changesItems'
    }
  ];
  return (
    <PaginatedTableSearch
      columns={columns}
      rows={matchedChanges}
      filterText={filterText}
      changeFilterText={changeFilterText}
    />
  );
}

export default AppChangelog;
