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

const GET_INTEGRATIONS = gql`
  query Integrations {
    integrations_v1 {
      path
      name
      description
      upstream
    }
  }
`;

interface Integration {
  path: string;
  name: string;
  description?: string;
  upstream?: string;
}

interface IntegrationsData {
  integrations_v1: Integration[];
}

const Integrations: React.FC = () => {
  const { loading, error, data } = useQuery<IntegrationsData>(GET_INTEGRATIONS);

  const {
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    perPage,
    filteredItems: filteredIntegrations,
    paginatedItems: paginatedIntegrations,
    onSetPage,
    onPerPageSelect,
  } = useFilteredPagination({
    items: data?.integrations_v1 || [],
    filterFn: (integration, term) =>
      integration.name.toLowerCase().includes(term.toLowerCase()) ||
      (integration.description?.toLowerCase().includes(term.toLowerCase()) ?? false) ||
      (integration.upstream?.toLowerCase().includes(term.toLowerCase()) ?? false),
  });

  if (loading) {
    return (
      <div>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
          Integrations
        </Title>
        <LoadingState message="Loading integrations..." />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
          Integrations
        </Title>
        <ErrorState title="Error loading integrations" error={error} />
      </div>
    );
  }

  return (
    <div>
      <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
        Integrations
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
                  aria-label="Search integrations"
                  placeholder="Search by name, description, or upstream..."
                  value={searchTerm}
                  onChange={(_event, value) => {
                    setSearchTerm(value);
                    setPage(1);
                  }}
                />
              </ToolbarItem>
              <ToolbarItem align={{ default: 'alignEnd' }}>
                <span style={{ color: 'var(--pf-v6-global--Color--200)' }}>
                  {filteredIntegrations.length} integration{filteredIntegrations.length !== 1 ? 's' : ''} found
                </span>
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>

          <Table aria-label="Integrations table">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Description</Th>
                <Th>Upstream</Th>
                <Th>Path</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedIntegrations.map((integration: Integration) => (
                <Tr key={integration.path}>
                  <Td dataLabel="Name">
                    <Link to={`/integration${integration.path}`} style={{ textDecoration: 'none' }}>
                      <Button
                        variant="link"
                        style={{ padding: 0, fontSize: 'inherit', fontWeight: 'bold' }}
                      >
                        {integration.name}
                      </Button>
                    </Link>
                  </Td>
                  <Td dataLabel="Description">
                    {integration.description || '-'}
                  </Td>
                  <Td dataLabel="Upstream">
                    {integration.upstream ? (
                      <Button
                        variant="link"
                        component="a"
                        href={integration.upstream}
                        target="_blank"
                        rel="noopener noreferrer"
                        icon={<ExternalLinkAltIcon />}
                        iconPosition="right"
                        style={{ padding: 0, fontSize: 'inherit' }}
                      >
                        {integration.upstream}
                      </Button>
                    ) : '-'}
                  </Td>
                  <Td dataLabel="Path">
                    <Button
                      variant="link"
                      component="a"
                      href={`${getDataDirUrl()}${integration.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      icon={<ExternalLinkAltIcon />}
                      iconPosition="right"
                      style={{ padding: 0, fontSize: 'inherit' }}
                    >
                      {integration.path}
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {filteredIntegrations.length === 0 && searchTerm && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>No integrations found matching "{searchTerm}"</p>
            </div>
          )}

          {filteredIntegrations.length > perPage && (
            <Pagination
              variant={PaginationVariant.bottom}
              itemCount={filteredIntegrations.length}
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

export default Integrations;