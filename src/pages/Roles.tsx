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

const GET_ROLES = gql`
  query Roles {
    roles_v1 {
      path
      name
      description
    }
  }
`;

interface Role {
  path: string;
  name: string;
  description?: string;
}

interface RolesQueryData {
  roles_v1: Role[];
}

const Roles: React.FC = () => {
  const { loading, error, data } = useQuery<RolesQueryData>(GET_ROLES);

  const {
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    perPage,
    filteredItems: filteredRoles,
    paginatedItems: paginatedRoles,
    onSetPage,
    onPerPageSelect,
  } = useFilteredPagination({
    items: data?.roles_v1 || [],
    filterFn: (role, term) =>
      role.name.toLowerCase().includes(term.toLowerCase()) ||
      (role.description?.toLowerCase().includes(term.toLowerCase()) ?? false),
  });

  if (loading) {
    return (
      <div>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
          Roles
        </Title>
        <LoadingState message="Loading roles..." />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
          Roles
        </Title>
        <ErrorState title="Error loading roles" error={error} />
      </div>
    );
  }

  return (
    <div>
      <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
        Roles
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
                  aria-label="Search roles"
                  placeholder="Search by role name or description..."
                  value={searchTerm}
                  onChange={(_event, value) => {
                    setSearchTerm(value);
                    setPage(1);
                  }}
                />
              </ToolbarItem>
              <ToolbarItem align={{ default: 'alignEnd' }}>
                <span style={{ color: 'var(--pf-v6-global--Color--200)' }}>
                  {filteredRoles.length} role{filteredRoles.length !== 1 ? 's' : ''} found
                </span>
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>

          <Table aria-label="Roles table">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Path</Th>
                <Th>Description</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedRoles.map((role: Role) => (
                <Tr key={role.path}>
                  <Td dataLabel="Name">
                    <Link
                      to={`/role${role.path}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Button
                        variant="link"
                        style={{ padding: 0, fontSize: 'inherit', fontWeight: 'bold' }}
                      >
                        {role.name}
                      </Button>
                    </Link>
                  </Td>
                  <Td dataLabel="Path">
                    <Button
                      variant="link"
                      component="a"
                      href={`${getDataDirUrl()}${role.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      icon={<ExternalLinkAltIcon />}
                      iconPosition="right"
                      style={{ padding: 0, fontSize: 'inherit' }}
                    >
                      {role.path}
                    </Button>
                  </Td>
                  <Td dataLabel="Description">
                    {role.description || '-'}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {filteredRoles.length === 0 && searchTerm && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>No roles found matching "{searchTerm}"</p>
            </div>
          )}

          {filteredRoles.length > perPage && (
            <Pagination
              variant={PaginationVariant.bottom}
              itemCount={filteredRoles.length}
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

export default Roles;