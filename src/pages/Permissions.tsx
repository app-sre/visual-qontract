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

const GET_PERMISSIONS = gql`
  query Permissions {
    permissions_v1 {
      path
      name
      description
      service
    }
  }
`;

interface Permission {
  path: string;
  name: string;
  description?: string;
  service?: string;
}

interface PermissionsQueryData {
  permissions_v1: Permission[];
}

const Permissions: React.FC = () => {
  const { loading, error, data } = useQuery<PermissionsQueryData>(GET_PERMISSIONS);

  const {
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    perPage,
    filteredItems: filteredPermissions,
    paginatedItems: paginatedPermissions,
    onSetPage,
    onPerPageSelect,
  } = useFilteredPagination({
    items: data?.permissions_v1 || [],
    filterFn: (permission, term) =>
      permission.name.toLowerCase().includes(term.toLowerCase()) ||
      (permission.description?.toLowerCase().includes(term.toLowerCase()) ?? false) ||
      (permission.service?.toLowerCase().includes(term.toLowerCase()) ?? false),
  });

  if (loading) {
    return (
      <div>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
          Permissions
        </Title>
        <LoadingState message="Loading permissions..." />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
          Permissions
        </Title>
        <ErrorState title="Error loading permissions" error={error} />
      </div>
    );
  }

  return (
    <div>
      <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
        Permissions
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
                  aria-label="Search permissions"
                  placeholder="Search by name, description, or service..."
                  value={searchTerm}
                  onChange={(_event, value) => {
                    setSearchTerm(value);
                    setPage(1);
                  }}
                />
              </ToolbarItem>
              <ToolbarItem align={{ default: 'alignEnd' }}>
                <span style={{ color: 'var(--pf-v6-global--Color--200)' }}>
                  {filteredPermissions.length} permission{filteredPermissions.length !== 1 ? 's' : ''} found
                </span>
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>

          <Table aria-label="Permissions table">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Service</Th>
                <Th>Description</Th>
                <Th>Path</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedPermissions.map((permission: Permission) => (
                <Tr key={permission.path}>
                  <Td dataLabel="Name">
                    <Link
                      to={`/permission${permission.path}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Button
                        variant="link"
                        style={{ padding: 0, fontSize: 'inherit', fontWeight: 'bold' }}
                      >
                        {permission.name}
                      </Button>
                    </Link>
                  </Td>
                  <Td dataLabel="Service">
                    {permission.service || '-'}
                  </Td>
                  <Td dataLabel="Description">
                    {permission.description || '-'}
                  </Td>
                  <Td dataLabel="Path">
                    <Button
                      variant="link"
                      component="a"
                      href={`${getDataDirUrl()}${permission.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      icon={<ExternalLinkAltIcon />}
                      iconPosition="right"
                      style={{ padding: 0, fontSize: 'inherit' }}
                    >
                      {permission.path}
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {filteredPermissions.length === 0 && searchTerm && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>No permissions found matching "{searchTerm}"</p>
            </div>
          )}

          {filteredPermissions.length > perPage && (
            <Pagination
              variant={PaginationVariant.bottom}
              itemCount={filteredPermissions.length}
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

export default Permissions;