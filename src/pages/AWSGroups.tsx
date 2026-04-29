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

const GET_AWSGROUPS = gql`
  query AWSGroups {
    awsgroups_v1 {
      path
      name
      description
      account {
        name
      }
      policies
    }
  }
`;

interface AWSGroup {
  path: string;
  name: string;
  description?: string;
  account: {
    name: string;
  };
  policies?: string[];
}

interface AWSGroupsData {
  awsgroups_v1: AWSGroup[];
}

const AWSGroups: React.FC = () => {
  const { loading, error, data } = useQuery<AWSGroupsData>(GET_AWSGROUPS);

  const {
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    perPage,
    filteredItems: filteredAWSGroups,
    paginatedItems: paginatedAWSGroups,
    onSetPage,
    onPerPageSelect,
  } = useFilteredPagination({
    items: data?.awsgroups_v1 || [],
    filterFn: (group, term) =>
      group.name.toLowerCase().includes(term.toLowerCase()) ||
      (group.description?.toLowerCase().includes(term.toLowerCase()) ?? false) ||
      group.account.name.toLowerCase().includes(term.toLowerCase()),
  });

  if (loading) {
    return (
      <div>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
          AWS Groups
        </Title>
        <LoadingState message="Loading AWS groups..." />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
          AWS Groups
        </Title>
        <ErrorState title="Error loading AWS groups" error={error} />
      </div>
    );
  }

  return (
    <div>
      <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
        AWS Groups
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
                  aria-label="Search AWS groups"
                  placeholder="Search by name, description, or account..."
                  value={searchTerm}
                  onChange={(_event, value) => {
                    setSearchTerm(value);
                    setPage(1);
                  }}
                />
              </ToolbarItem>
              <ToolbarItem align={{ default: 'alignEnd' }}>
                <span style={{ color: 'var(--pf-v6-global--Color--200)' }}>
                  {filteredAWSGroups.length} group{filteredAWSGroups.length !== 1 ? 's' : ''} found
                </span>
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>

          <Table aria-label="AWS Groups table">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Description</Th>
                <Th>Account</Th>
                <Th>Policies</Th>
                <Th>Path</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedAWSGroups.map((group: AWSGroup) => (
                <Tr key={group.path}>
                  <Td dataLabel="Name">
                    <Link to={`/aws-group${group.path}`} style={{ textDecoration: 'none' }}>
                      <Button
                        variant="link"
                        style={{ padding: 0, fontSize: 'inherit', fontWeight: 'bold' }}
                      >
                        {group.name}
                      </Button>
                    </Link>
                  </Td>
                  <Td dataLabel="Description">
                    {group.description || '-'}
                  </Td>
                  <Td dataLabel="Account">
                    {group.account.name}
                  </Td>
                  <Td dataLabel="Policies">
                    {group.policies?.length || 0}
                  </Td>
                  <Td dataLabel="Path">
                    <Button
                      variant="link"
                      component="a"
                      href={`${getDataDirUrl()}${group.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      icon={<ExternalLinkAltIcon />}
                      iconPosition="right"
                      style={{ padding: 0, fontSize: 'inherit' }}
                    >
                      {group.path}
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {filteredAWSGroups.length === 0 && searchTerm && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>No AWS groups found matching "{searchTerm}"</p>
            </div>
          )}

          {filteredAWSGroups.length > perPage && (
            <Pagination
              variant={PaginationVariant.bottom}
              itemCount={filteredAWSGroups.length}
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

export default AWSGroups;