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

const GET_DEPENDENCIES = gql`
  query Dependencies {
    dependencies_v1 {
      path
      name
      description
      statefulness
      opsModel
      statusPage
      SLA
      dependencyFailureImpact
      monitoring {
        url
      }
    }
  }
`;

interface Dependency {
  path: string;
  name: string;
  description?: string;
  statefulness?: string;
  opsModel?: string;
  statusPage?: string;
  SLA?: string;
  dependencyFailureImpact?: string;
  monitoring?: {
    url?: string;
  };
}

interface DependenciesData {
  dependencies_v1: Dependency[];
}

const Dependencies: React.FC = () => {
  const { loading, error, data } = useQuery<DependenciesData>(GET_DEPENDENCIES);

  const {
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    perPage,
    filteredItems: filteredDependencies,
    paginatedItems: paginatedDependencies,
    onSetPage,
    onPerPageSelect,
  } = useFilteredPagination({
    items: data?.dependencies_v1 || [],
    filterFn: (dependency, term) =>
      dependency.name.toLowerCase().includes(term.toLowerCase()) ||
      (dependency.description?.toLowerCase().includes(term.toLowerCase()) ?? false) ||
      (dependency.statefulness?.toLowerCase().includes(term.toLowerCase()) ?? false) ||
      (dependency.opsModel?.toLowerCase().includes(term.toLowerCase()) ?? false),
  });

  if (loading) {
    return (
      <div>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
          Dependencies
        </Title>
        <LoadingState message="Loading dependencies..." />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
          Dependencies
        </Title>
        <ErrorState title="Error loading dependencies" error={error} />
      </div>
    );
  }

  return (
    <div>
      <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
        Dependencies
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
                  aria-label="Search dependencies"
                  placeholder="Search by name, description, statefulness, or ops model..."
                  value={searchTerm}
                  onChange={(_event, value) => {
                    setSearchTerm(value);
                    setPage(1);
                  }}
                />
              </ToolbarItem>
              <ToolbarItem align={{ default: 'alignEnd' }}>
                <span style={{ color: 'var(--pf-v6-global--Color--200)' }}>
                  {filteredDependencies.length} dependenc{filteredDependencies.length !== 1 ? 'ies' : 'y'} found
                </span>
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>

          <Table aria-label="Dependencies table">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Description</Th>
                <Th>Statefulness</Th>
                <Th>Ops Model</Th>
                <Th>SLA</Th>
                <Th>Path</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedDependencies.map((dependency: Dependency) => (
                <Tr key={dependency.path}>
                  <Td dataLabel="Name">
                    <Link to={`/dependency${dependency.path}`} style={{ textDecoration: 'none' }}>
                      <Button
                        variant="link"
                        style={{ padding: 0, fontSize: 'inherit', fontWeight: 'bold' }}
                      >
                        {dependency.name}
                      </Button>
                    </Link>
                  </Td>
                  <Td dataLabel="Description">
                    {dependency.description || '-'}
                  </Td>
                  <Td dataLabel="Statefulness">
                    {dependency.statefulness || '-'}
                  </Td>
                  <Td dataLabel="Ops Model">
                    {dependency.opsModel || '-'}
                  </Td>
                  <Td dataLabel="SLA">
                    {dependency.SLA || '-'}
                  </Td>
                  <Td dataLabel="Path">
                    <Button
                      variant="link"
                      component="a"
                      href={`${getDataDirUrl()}${dependency.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      icon={<ExternalLinkAltIcon />}
                      iconPosition="right"
                      style={{ padding: 0, fontSize: 'inherit' }}
                    >
                      {dependency.path}
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {filteredDependencies.length === 0 && searchTerm && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>No dependencies found matching "{searchTerm}"</p>
            </div>
          )}

          {filteredDependencies.length > perPage && (
            <Pagination
              variant={PaginationVariant.bottom}
              itemCount={filteredDependencies.length}
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

export default Dependencies;