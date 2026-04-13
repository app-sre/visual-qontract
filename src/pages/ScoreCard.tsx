import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import {
  Title,
  Card,
  CardTitle,
  CardBody,
  Breadcrumb,
  BreadcrumbItem,
  Alert,
  Button,
  Label
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td
} from '@patternfly/react-table';
import { ExternalLinkAltIcon, CheckCircleIcon, ExclamationCircleIcon, QuestionCircleIcon } from '@patternfly/react-icons';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { getDataDirUrl } from '../utils/env';

const GET_SCORECARD = gql`
  query Scorecard($path: String) {
    scorecards_v2(path: $path) {
      path
      app {
        name
      }
      acceptanceCriteria {
        name
        status
        comment
      }
    }
  }
`;

interface AcceptanceCriteria {
  name: string;
  status: string;
  comment?: string;
}

interface ScoreCardDetail {
  path: string;
  app: {
    name: string;
  };
  acceptanceCriteria?: AcceptanceCriteria[];
}

interface ScoreCardData {
  scorecards_v2: ScoreCardDetail[];
}

const ScoreCard: React.FC = () => {
  const { path } = useParams<{ path: string }>();
  const { loading, error, data } = useQuery<ScoreCardData>(GET_SCORECARD, {
    variables: { path: decodeURIComponent(path || '') }
  });

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pass':
      case 'passed':
        return <CheckCircleIcon style={{ color: 'var(--pf-v6-global--success-color--100)' }} />;
      case 'fail':
      case 'failed':
        return <ExclamationCircleIcon style={{ color: 'var(--pf-v6-global--danger-color--100)' }} />;
      default:
        return <QuestionCircleIcon style={{ color: 'var(--pf-v6-global--warning-color--100)' }} />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pass':
      case 'passed':
        return <Label variant="outline" color="green">{status}</Label>;
      case 'fail':
      case 'failed':
        return <Label variant="outline" color="red">{status}</Label>;
      default:
        return <Label variant="outline" color="orange">{status}</Label>;
    }
  };

  if (loading) {
    return <LoadingState message="Loading score card..." />;
  }

  if (error) {
    return <ErrorState title="Error loading score card" error={error} />;
  }

  if (!data?.scorecards_v2?.length) {
    return (
      <div>
        <Breadcrumb style={{ marginBottom: '1rem' }}>
          <BreadcrumbItem component={Link} to="/scorecards">
            Score Cards
          </BreadcrumbItem>
          <BreadcrumbItem>Not Found</BreadcrumbItem>
        </Breadcrumb>
        <Alert variant="warning" title="Score card not found">
          The score card you're looking for could not be found.
        </Alert>
      </div>
    );
  }

  const scorecard = data.scorecards_v2[0];

  return (
    <div>
      <Breadcrumb style={{ marginBottom: '1rem' }}>
        <BreadcrumbItem component={Link} to="/scorecards">
          Score Cards
        </BreadcrumbItem>
        <BreadcrumbItem>{scorecard.app.name}</BreadcrumbItem>
      </Breadcrumb>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <Link to="/scorecards" style={{ textDecoration: 'none', marginRight: '1rem' }}>
          <Button
            variant="link"
            style={{ padding: 0, fontSize: 'inherit' }}
          >
            ← Back to Score Cards
          </Button>
        </Link>
        <Title headingLevel="h1" size="2xl">
          {scorecard.app.name} Score Card
        </Title>
      </div>

      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
        {/* Basic Information */}
        <Card>
          <CardTitle>Basic Information</CardTitle>
          <CardBody>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <div>
                <strong>App Name:</strong> {scorecard.app.name}
              </div>
              <div>
                <strong>Score Card Path:</strong>{' '}
                <Button
                  variant="link"
                  component="a"
                  href={`${getDataDirUrl()}${scorecard.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  icon={<ExternalLinkAltIcon />}
                  iconPosition="right"
                  style={{ padding: 0, fontSize: 'inherit' }}
                >
                  {scorecard.path}
                </Button>
              </div>
              {scorecard.acceptanceCriteria && (
                <div>
                  <strong>Acceptance Criteria:</strong> {scorecard.acceptanceCriteria.length}
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Acceptance Criteria */}
        {scorecard.acceptanceCriteria && scorecard.acceptanceCriteria.length > 0 && (
          <Card style={{ gridColumn: '1 / -1' }}>
            <CardTitle>Acceptance Criteria ({scorecard.acceptanceCriteria.length})</CardTitle>
            <CardBody>
              <Table aria-label="Acceptance Criteria table">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Status</Th>
                    <Th>Comment</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {scorecard.acceptanceCriteria.map((criteria, index) => (
                    <Tr key={index}>
                      <Td dataLabel="Name">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {getStatusIcon(criteria.status)}
                          {criteria.name}
                        </div>
                      </Td>
                      <Td dataLabel="Status">
                        {getStatusLabel(criteria.status)}
                      </Td>
                      <Td dataLabel="Comment">
                        {criteria.comment || '-'}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ScoreCard;