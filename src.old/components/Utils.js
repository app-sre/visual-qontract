import React from 'react';

const sortByName = items =>
  items.slice().sort((a, b) => {
    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
    return 0;
  });

const sortByValue = items =>
  items.slice().sort((a, b) => {
    if (a.value.toLowerCase() > b.value.toLowerCase()) return 1;
    if (a.value.toLowerCase() < b.value.toLowerCase()) return -1;
    return 0;
  });

const sortByLabel = items =>
  items.slice().sort((a, b) => {
    if (a.label.toLowerCase() > b.label.toLowerCase()) return 1;
    if (a.label.toLowerCase() < b.label.toLowerCase()) return -1;
    return 0;
  });

const sortByDate = items =>
  items.slice().sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if (dateA > dateB) return -1;
    if (dateA < dateB) return 1;
    return 0;
  });

function highlightText(text, filter) {
  if (!text || typeof text !== 'string') return text;
  if (!filter) return text;

  const parts = text.split(new RegExp(`(${filter})`, 'gi'));
  return parts.map((part, index) =>
    part.toLowerCase() === filter.toLowerCase() ? (
      <span key={index} style={{ backgroundColor: 'yellow' }}>
        {part}
      </span>
    ) : (
      part
    )
  );
}

const parseMarkdownLinks = text => {
  const regex = /\[([^\]]+)\]\(([^)]+)\)|<([^>]+)>/g;
  const parts = [];
  let lastIndex = 0;
  let match = regex.exec(text);

  while (match !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[1] && match[2]) {
      // This is a Markdown link [text](url)
      parts.push(
        <a href={match[2]} key={`md-link-${match.index}`} target="_blank" rel="noopener noreferrer">
          {match[1]}
        </a>
      );
    } else if (match[3]) {
      // This is a simple URL <url>
      parts.push(
        <a href={match[3]} key={`simple-url-${match.index}`} target="_blank" rel="noopener noreferrer">
          {match[3]}
        </a>
      );
    }

    // eslint-disable-next-line prefer-destructuring
    lastIndex = regex.lastIndex;
    match = regex.exec(text);
  }

  // Add the remaining text after the last link
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
};

export { sortByName, sortByValue, sortByLabel, sortByDate, highlightText, parseMarkdownLinks };
