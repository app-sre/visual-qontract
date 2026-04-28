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

const GET_QUAYORGS = gql`
  query QuayOrgs {
    quay_orgs_v1 {
      path
      name
      description
    }
  }
`;

interface QuayOrg {
  path: string;
  name: string;
  description?: string;
}

interface QuayOrgsData {
  quay_orgs_v1: QuayOrg[];
}

const QuayOrgs: React.FC = () => {
  const { loading, error, data } = useQuery<QuayOrgsData>(GET_QUAYORGS);

  const {
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    perPage,
    filteredItems: filteredQuayOrgs,
    paginatedItems: paginatedQuayOrgs,
    onSetPage,
    onPerPageSelect,
  } = useFilteredPagination({
    items: data?.quay_orgs_v1 || [],
    filterFn: (org, term) =>
      org.name.toLowerCase().includes(term.toLowerCase()) ||
      (org.description?.toLowerCase().includes(term.toLowerCase()) ?? false),
  });

  if (loading) {
    return (
      <div>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
          Quay Organizations
        </Title>
        <LoadingState message="Loading Quay organizations..." />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
          Quay Organizations
        </Title>
        <ErrorState title="Error loading Quay organizations" error={error} />
      </div>
    );
  }

  return (
    <div>
      <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
        Quay Organizations
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
                  aria-label="Search Quay organizations"
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
                  {filteredQuayOrgs.length} organization{filteredQuayOrgs.length !== 1 ? 's' : ''} found
                </span>
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>

          <Table aria-label="Quay Organizations table">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Description</Th>
                <Th>Path</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedQuayOrgs.map((org: QuayOrg) => (
                <Tr key={org.path}>
                  <Td dataLabel="Name">
                    <Link to={`/quay-org/${encodeURIComponent(org.path)}`} style={{ textDecoration: 'none' }}>
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

          {filteredQuayOrgs.length === 0 && searchTerm && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>No Quay organizations found matching "{searchTerm}"</p>
            </div>
          )}

          {filteredQuayOrgs.length > perPage && (
            <Pagination
              variant={PaginationVariant.bottom}
              itemCount={filteredQuayOrgs.length}
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

export default QuayOrgs;