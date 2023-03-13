import React from 'react';
import ReactTooltip from 'react-tooltip';
import { Label, Table } from 'patternfly-react';
import { Link } from 'react-router-dom';
import Definition from '../../components/Definition';
import NonEmptyDefinition from '../../components/NonEmptyDefinition';
import CodeComponents from '../../components/ServiceCodeComponents';
import EndPoints from '../../components/ServiceEndPoints';
import { sortByDate } from '../../components/Utils';
import { LinkPath, DisplayNamePathList } from '../../components/NamePathList';
import Namespaces from './Namespaces';
import Reports from './Reports';
import Services from './Services';
import ScorecardData from '../../components/ScorecardData';
import { ProgressBar } from 'patternfly-react';
import ReactMarkdown from 'react-markdown'


const headerFormat = value => <Table.Heading>{value}</Table.Heading>;
const cellFormat = value => <Table.Cell>{value}</Table.Cell>;
const noWrapFormat = value => <span style={{whiteSpace: "nowrap"}}>{value}</span>;
const mdFormat = value => <ReactMarkdown>{value}</ReactMarkdown>

const linkFormat = url => value => (
  <a href={`${url || ''}${value}`} target="_blank" rel="noopener noreferrer">
    {value}
  </a>
);

// TODO: replace this with link to specific AC
const acLinkFormat = value => (
  <a href={window.ACCEPTANCE_CRITERIA} target="_blank" rel="noopener noreferrer">
    {value}
  </a>
);

// value is red, green or yellow. CSS classes are defined in App.scss
const statusFormat = value => {
    return <div>
        <span className={`badge ac-status-${value}`}>{value}</span>
    </div>;
}

const emptyFormat = value => value || '-';
const booleanFormat = (t, f) => value => (value ? t : f);

const SECTIONS = ['INCIDENT-MGMT', 'CONTINUITY', 'OBSERVABILITY', 'RELIABILITY', 'SECURITY'];

const MILESTONES = [
    'Service Preview',
    'Field Trial',
    'Limited Availability',
    'General Availability',
]

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
    let countStatus = {'red': 0, 'green': 0, 'yellow': 0}
    scorecardData.forEach(item => countStatus[item.status] += 1);
    return Math.round(100 * (countStatus['green'] + 0.5 * countStatus['yellow']) / scorecardData.length);
}

function ScoreTable({data}) {

    return <table style={{width: "40%"}}>
            {data.map(m => <tr><td style={{width: "30%"}}>{m[0]}</td><td><ProgressBarScore now={m[1]}/></td></tr>)}
    </table>
}

function ScorecardSection({section, data}) {
    return <div><h3>{section} - {score(data)}%</h3><Table.PfProvider
        striped
        bordered
        columns={[
            {
                header: {
                    label: 'ID',
                    formatters: [headerFormat]
                },
                cell: {formatters: [noWrapFormat, acLinkFormat, cellFormat]},
                property: 'id'
            },
            {
                header: {label: 'Summary', formatters: [headerFormat]},
                cell: { formatters: [cellFormat]},
                property: 'summary'
            },
            {
                header: {label: 'Milestone', formatters: [headerFormat]},
                cell: { formatters: [noWrapFormat, cellFormat]},
                property: 'milestone'
            },
            {
                header: {label: 'Status', formatters: [headerFormat]},
                cell: {formatters: [statusFormat, cellFormat]},
                property: 'status'
            },
            {
                header: {label: 'Comment', formatters: [headerFormat]},
                cell: {formatters: [mdFormat, cellFormat]},
                property: 'comment'
            },
        ]}>
        <Table.Header />
        <Table.Body rows={data} rowKey="id" />
    </Table.PfProvider></div>;
}

function ProgressBarScore({now}) {
    let bsStyle = "success";

    if (now < 50) {
        bsStyle = "danger";
    } else if (now < 80) {
        bsStyle = "warning";
    }

    return <ProgressBar
                active={false}
                bsClass="progress-bar"
                bsStyle={bsStyle}
                isChild={false}
                max={100}
                min={0}
                now={now}
                srOnly={false}
                striped={false}
                label={now + "%"}
    />;
}

function Scorecard({ scorecard }) {
    const scorecardData = ScorecardData.map(e => {
        let ac = scorecard.acceptanceCriteria.find(acItem => acItem.name == e.id);
        if (typeof(ac) === 'undefined')
            ac = {"status": "red"};
        const milestoneId = {"milestoneID": getMilestoneID(e.milestone)};
        return {...e, ...ac, ...milestoneId};
    }).sort(sortScorecardItems);

    const serviceScore = [["Overall", score(scorecardData)]];
    const milestoneScores = MILESTONES.map(m => [m, score(scorecardData.filter(e => m === e.milestone))]);
    const categoryScores = SECTIONS.map(section => [section, score(scorecardData.filter(e => section === e.category))]);

    const sections = SECTIONS.map(section => <ScorecardSection key={section} section={section} data={scorecardData.filter(e => e.category === section)} />);
    return <React.Fragment>
        <h4>SRE Milestone Recommendation</h4>
        <p>Service not yet ready for Service Preview.</p>
        <h4>Score</h4>
        <ScoreTable data={serviceScore}/>
        <h4>Milestone Scores</h4>
        <ScoreTable data={milestoneScores}/>
        <h4>Category Scores</h4>
        <ScoreTable data={categoryScores}/>
        {sections}
    </React.Fragment>;
}

export default Scorecard;
