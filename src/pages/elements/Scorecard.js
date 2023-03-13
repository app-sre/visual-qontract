import React from 'react';
import { Table, ProgressBar } from 'patternfly-react';
import ReactMarkdown from 'react-markdown';
import ScorecardData from '../../components/ScorecardData';

const headerFormat = value => <Table.Heading>{value}</Table.Heading>;
const cellFormat = value => <Table.Cell>{value}</Table.Cell>;
const noWrapFormat = value => <span style={{ whiteSpace: 'nowrap' }}>{value}</span>;
const mdFormat = value => <ReactMarkdown>{value}</ReactMarkdown>;

// TODO: replace this with link to specific AC
const acLinkFormat = value => (
  <a href={window.ACCEPTANCE_CRITERIA} target="_blank" rel="noopener noreferrer">
    {value}
  </a>
);

// value is red, green or yellow. CSS classes are defined in App.scss
const statusFormat = value => (
  <div>
    <span className={`badge ac-status-${value}`}>{value}</span>
  </div>
);

const MILESTONES = ['Service Preview', 'Field Trial', 'Limited Availability', 'General Availability'];

function getMilestoneID(milestone) {
  return MILESTONES.indexOf(milestone);
}

function sortScorecardItems(a, b) {
  if (a.milestoneID === b.milestoneID) {
    return a.id.localeCompare(b.id);
  }
  return a.milestoneID > b.milestoneID ? 1 : -1;
}

function score(scorecardData) {
  const countStatus = { red: 0, green: 0, yellow: 0 };
  scorecardData.forEach(item => {
    countStatus[item.status] += 1;
  });
  return Math.round((100 * (countStatus.green + 0.5 * countStatus.yellow)) / scorecardData.length);
}

function ScoreTable({ data }) {
  return (
    <table style={{ width: '40%' }}>
      {data.map(m => (
        <tr>
          <td style={{ width: '30%' }}>{m[0]}</td>
          <td>
            <ProgressBarScore now={m[1]} />
          </td>
        </tr>
      ))}
    </table>
  );
}

function ScorecardSection({ milestone, data, milestoneScore }) {
  return (
    <div>
      <h3>
        {milestone} - {milestoneScore}%
      </h3>
      <Table.PfProvider
        striped
        bordered
        columns={[
          {
            header: {
              label: 'ID',
              formatters: [headerFormat]
            },
            cell: { formatters: [noWrapFormat, acLinkFormat, cellFormat] },
            property: 'id'
          },
          {
            header: { label: 'Summary', formatters: [headerFormat] },
            cell: { formatters: [cellFormat] },
            property: 'summary'
          },
          {
            header: { label: 'Milestone', formatters: [headerFormat] },
            cell: { formatters: [noWrapFormat, cellFormat] },
            property: 'milestone'
          },
          {
            header: { label: 'Status', formatters: [headerFormat] },
            cell: { formatters: [statusFormat, cellFormat] },
            property: 'status'
          },
          {
            header: { label: 'Comment', formatters: [headerFormat] },
            cell: { formatters: [mdFormat, cellFormat] },
            property: 'comment'
          }
        ]}
      >
        <Table.Header />
        <Table.Body rows={data} rowKey="id" />
      </Table.PfProvider>
    </div>
  );
}

function ProgressBarScore({ now }) {
  let bsStyle = 'success';

  if (now < 50) {
    bsStyle = 'danger';
  } else if (now < 80) {
    bsStyle = 'warning';
  }

  return (
    <ProgressBar
      active={false}
      bsClass="progress-bar"
      bsStyle={bsStyle}
      isChild={false}
      max={100}
      min={0}
      now={now}
      srOnly={false}
      striped={false}
      label={`${now}%`}
    />
  );
}

function milestoneMatcher(e, m) {
  const levels = {
    'Service Preview': ['Service Preview'],
    'Field Trial': ['Service Preview', 'Field Trial'],
    'Limited Availability': ['Service Preview', 'Field Trial', 'Limited Availability'],
    'General Availability': ['Service Preview', 'Field Trial', 'Limited Availability', 'General Availability']
  };

  return levels[m].includes(e.milestone);
}

function Scorecard({ scorecard }) {
  const scorecardData = ScorecardData.map(e => {
    let ac = scorecard.acceptanceCriteria.find(acItem => acItem.name === e.id);
    if (typeof ac === 'undefined') ac = { status: 'red' };
    const milestoneId = { milestoneID: getMilestoneID(e.milestone) };
    return { ...e, ...ac, ...milestoneId };
  }).sort(sortScorecardItems);

  const milestoneScores = MILESTONES.map(m => [m, score(scorecardData.filter(e => milestoneMatcher(e, m)))]);

  const sections = MILESTONES.map(milestone => (
    <ScorecardSection
      key={milestone}
      milestone={milestone}
      milestoneScore={milestoneScores.find(e => e[0] === milestone)[1]}
      data={scorecardData.filter(e => e.milestone === milestone)}
    />
  ));

  return (
    <React.Fragment>
      <h4>SRE Milestone Recommendation</h4>
      <p>Service not yet ready for Service Preview.</p>
      <h4>Milestone Scores</h4>
      <ScoreTable data={milestoneScores} />
      {sections}
    </React.Fragment>
  );
}

export default Scorecard;
