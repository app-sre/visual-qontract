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

const GET_GITHUBORGS = gql`
  query GitHubOrgs {
    githuborg_v1 {
      path
      name
      description
    }
  }
`;

interface GitHubOrg {
  path: string;
  name: string;
  description?: string;
}

interface GitHubOrgsData {
  githuborg_v1: GitHubOrg[];
}

const GitHubOrgs: React.FC = () => {
  const { loading, error, data } = useQuery<GitHubOrgsData>(GET_GITHUBORGS);

  const {
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    perPage,
    filteredItems: filteredGitHubOrgs,
    paginatedItems: paginatedGitHubOrgs,
    onSetPage,
    onPerPageSelect,
  } = useFilteredPagination({
    items: data?.githuborg_v1 || [],
    filterFn: (org, term) =>
      org.name.toLowerCase().includes(term.toLowerCase()) ||
      (org.description?.toLowerCase().includes(term.toLowerCase()) ?? false),
  });

  if (loading) {
    return (
      <div>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
          GitHub Organizations
        </Title>
        <LoadingState message="Loading GitHub organizations..." />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
          GitHub Organizations
        </Title>
        <ErrorState title="Error loading GitHub organizations" error={error} />
      </div>
    );
  }

  return (
    <div>
      <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
        GitHub Organizations
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
                  aria-label="Search GitHub organizations"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(_event, value) => {
                    setSearchTerm(value);
                    setPage(1);
                  }}
                />
              </ToolbarItem>
              <ToolbarItem align={{ default: 'alignEnd' }}>
                <span style={{ color: 'var(--pf-v6-global--Color--200)' }}>
                  {filteredGitHubOrgs.length} organization{filteredGitHubOrgs.length !== 1 ? 's' : ''} found
                </span>
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>

          <Table aria-label="GitHub Organizations table">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Description</Th>
                <Th>Path</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedGitHubOrgs.map((org: GitHubOrg) => (
                <Tr key={org.path}>
                  <Td dataLabel="Name">
                    <Link to={`/github-org/${encodeURIComponent(org.path)}`} style={{ textDecoration: 'none' }}>
                      <Button
                        variant="link"
                        style={{ padding: 0, fontSize: 'inherit', fontWeight: 'bold' }}
                      >
                        {org.name}
                      </Button>
                    </Link>
                  </Td>
                  <Td dataLabel="Description">
                    {org.description || '-'}
                  </Td>
                  <Td dataLabel="Path">
                    <Button
                      variant="link"
                      component="a"
                      href={`${getDataDirUrl()}${org.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      icon={<ExternalLinkAltIcon />}
                      iconPosition="right"
                      style={{ padding: 0, fontSize: 'inherit' }}
                    >
                      {org.path}
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {filteredGitHubOrgs.length === 0 && searchTerm && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>No GitHub organizations found matching "{searchTerm}"</p>
            </div>
          )}

          {filteredGitHubOrgs.length > perPage && (
            <Pagination
              variant={PaginationVariant.bottom}
              itemCount={filteredGitHubOrgs.length}
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

export default GitHubOrgs;