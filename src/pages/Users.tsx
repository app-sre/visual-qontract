import React from 'react';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import {
  Title,
  Card,
  CardBody,
  TextInput,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Pagination,
  PaginationVariant
} from '@patternfly/react-core';
import UsersTable from '../components/UsersTable';
import { useFilteredPagination } from '../hooks/useFilteredPagination';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

const GET_USERS = gql`
  query Users {
    users_v1 {
      path
      name
      org_username
      github_username
      quay_username
      public_gpg_key
    }
  }
`;

interface User {
  path: string;
  name: string;
  org_username?: string;
  github_username?: string;
  quay_username?: string;
  public_gpg_key?: string;
}

interface UsersQueryData {
  users_v1: User[];
}

const Users: React.FC = () => {
  const { loading, error, data } = useQuery<UsersQueryData>(GET_USERS);

  const {
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    perPage,
    filteredItems: filteredUsers,
    paginatedItems: paginatedUsers,
    onSetPage,
    onPerPageSelect,
  } = useFilteredPagination({
    items: data?.users_v1 || [],
    filterFn: (user, term) =>
      user.name.toLowerCase().includes(term.toLowerCase()) ||
      (user.org_username?.toLowerCase().includes(term.toLowerCase()) ?? false) ||
      (user.github_username?.toLowerCase().includes(term.toLowerCase()) ?? false) ||
      (user.quay_username?.toLowerCase().includes(term.toLowerCase()) ?? false),
  });

  if (loading) {
    return (
      <div>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
          Users
        </Title>
        <LoadingState message="Loading users..." />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
          Users
        </Title>
        <ErrorState title="Error loading users" error={error} />
      </div>
    );
  }

  return (
    <div>
      <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
        Users
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
                  aria-label="Search users"
                  placeholder="Search by name or username..."
                  value={searchTerm}
                  onChange={(_event, value) => {
                    setSearchTerm(value);
                    setPage(1);
                  }}
                />
              </ToolbarItem>
              <ToolbarItem align={{ default: 'alignEnd' }}>
                <span style={{ color: 'var(--pf-v6-global--Color--200)' }}>
                  {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
                </span>
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>

          <UsersTable users={paginatedUsers} showGpgKey={true} showName={true} />

          {filteredUsers.length === 0 && searchTerm && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>No users found matching "{searchTerm}"</p>
            </div>
          )}

          {filteredUsers.length > perPage && (
            <Pagination
              variant={PaginationVariant.bottom}
              itemCount={filteredUsers.length}
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

export default Users;