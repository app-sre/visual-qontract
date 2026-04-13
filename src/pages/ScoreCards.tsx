import React from 'react';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import {
  Title,
  Card,
  CardBody,
  TextInput,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Pagination,
  PaginationVariant,
  Button
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td
} from '@patternfly/react-table';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { useFilteredPagination } from '../hooks/useFilteredPagination';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { getDataDirUrl } from '../utils/env';

const GET_SCORECARDS = gql`
  query Scorecards {
    scorecards_v2 {
      path
      app {
        name
        path
      }
    }
  }
`;

interface ScoreCardApp {
  name: string;
  path: string;
}

interface ScoreCard {
  path: string;
  app: ScoreCardApp;
}

interface ScoreCardsData {
  scorecards_v2: ScoreCard[];
}

const ScoreCards: React.FC = () => {
  const { loading, error, data } = useQuery<ScoreCardsData>(GET_SCORECARDS);

  const {
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    perPage,
    filteredItems: filteredScoreCards,
    paginatedItems: paginatedScoreCards,
    onSetPage,
    onPerPageSelect,
  } = useFilteredPagination({
    items: data?.scorecards_v2 || [],
    filterFn: (scorecard, term) =>
      scorecard.app.name.toLowerCase().includes(term.toLowerCase()) ||
      scorecard.path.toLowerCase().includes(term.toLowerCase()),
  });

  if (loading) {
    return (
      <div>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
          Score Cards
        </Title>
        <LoadingState message="Loading score cards..." />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
          Score Cards
        </Title>
        <ErrorState title="Error loading score cards" error={error} />
      </div>
    );
  }

  return (
    <div>
      <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
        Score Cards
      </Title>

      <Card>
        <CardBody>
          <Toolbar>
            <ToolbarContent>
              <ToolbarItem>
                <TextInput
                  name="search"
                  id="search"
                  type="search"
                  aria-label="Search score cards"
                  placeholder="Search by app name or path..."
                  value={searchTerm}
                  onChange={(_event, value) => {
                    setSearchTerm(value);
                    setPage(1);
                  }}
                />
              </ToolbarItem>
              <ToolbarItem align={{ default: 'alignEnd' }}>
                <span style={{ color: 'var(--pf-v6-global--Color--200)' }}>
                  {filteredScoreCards.length} score card{filteredScoreCards.length !== 1 ? 's' : ''} found
                </span>
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>

          <Table aria-label="Score Cards table">
            <Thead>
              <Tr>
                <Th>App Name</Th>
                <Th>App Path</Th>
                <Th>Score Card Path</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedScoreCards.map((scorecard: ScoreCard) => (
                <Tr key={scorecard.path}>
                  <Td dataLabel="App Name">
                    <Link to={`/scorecard/${encodeURIComponent(scorecard.path)}`} style={{ textDecoration: 'none' }}>
                      <Button
                        variant="link"
                        style={{ padding: 0, fontSize: 'inherit', fontWeight: 'bold' }}
                      >
                        {scorecard.app.name}
                      </Button>
                    </Link>
                  </Td>
                  <Td dataLabel="App Path">
                    <Button
                      variant="link"
                      component="a"
                      href={`${getDataDirUrl()}${scorecard.app.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      icon={<ExternalLinkAltIcon />}
                      iconPosition="right"
                      style={{ padding: 0, fontSize: 'inherit' }}
                    >
                      {scorecard.app.path}
                    </Button>
                  </Td>
                  <Td dataLabel="Score Card Path">
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
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {filteredScoreCards.length === 0 && searchTerm && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>No score cards found matching "{searchTerm}"</p>
            </div>
          )}

          {filteredScoreCards.length > perPage && (
            <Pagination
              variant={PaginationVariant.bottom}
              itemCount={filteredScoreCards.length}
              perPage={perPage}
              page={page}
              onSetPage={onSetPage}
              onPerPageSelect={onPerPageSelect}
              perPageOptions={[
                { title: '10', value: 10 },
                { title: '20', value: 20 },
                { title: '50', value: 50 },
                { title: '100', value: 100 }
              ]}
              style={{ marginTop: '1rem' }}
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default ScoreCards;