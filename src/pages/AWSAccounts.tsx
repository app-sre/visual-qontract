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

const GET_AWSACCOUNTS = gql`
  query AWSAccounts {
    awsaccounts_v1 {
      path
      name
      description
    }
  }
`;

interface AWSAccount {
  path: string;
  name: string;
  description?: string;
}

interface AWSAccountsQueryData {
  awsaccounts_v1: AWSAccount[];
}

const AWSAccounts: React.FC = () => {
  const { loading, error, data } = useQuery<AWSAccountsQueryData>(GET_AWSACCOUNTS);

  const {
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    perPage,
    filteredItems: filteredAWSAccounts,
    paginatedItems: paginatedAWSAccounts,
    onSetPage,
    onPerPageSelect,
  } = useFilteredPagination({
    items: data?.awsaccounts_v1 || [],
    filterFn: (account, term) =>
      account.name.toLowerCase().includes(term.toLowerCase()) ||
      (account.description?.toLowerCase().includes(term.toLowerCase()) ?? false),
  });

  if (loading) {
    return (
      <div>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
          AWS Accounts
        </Title>
        <LoadingState message="Loading AWS accounts..." />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
          AWS Accounts
        </Title>
        <ErrorState title="Error loading AWS accounts" error={error} />
      </div>
    );
  }

  return (
    <div>
      <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
        AWS Accounts
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
                  aria-label="Search AWS accounts"
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
                  {filteredAWSAccounts.length} account{filteredAWSAccounts.length !== 1 ? 's' : ''} found
                </span>
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>

          <Table aria-label="AWS Accounts table">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Description</Th>
                <Th>Path</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedAWSAccounts.map((account: AWSAccount) => (
                <Tr key={account.path}>
                  <Td dataLabel="Name">
                    <Link to={`/aws-account${account.path}`} style={{ textDecoration: 'none' }}>
                      <Button
                        variant="link"
                        style={{ padding: 0, fontSize: 'inherit', fontWeight: 'bold' }}
                      >
                        {account.name}
                      </Button>
                    </Link>
                  </Td>
                  <Td dataLabel="Description">
                    {account.description || '-'}
                  </Td>
                  <Td dataLabel="Path">
                    <Button
                      variant="link"
                      component="a"
                      href={`${getDataDirUrl()}${account.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      icon={<ExternalLinkAltIcon />}
                      iconPosition="right"
                      style={{ padding: 0, fontSize: 'inherit' }}
                    >
                      {account.path}
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {filteredAWSAccounts.length === 0 && searchTerm && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>No AWS accounts found matching "{searchTerm}"</p>
            </div>
          )}

          {filteredAWSAccounts.length > perPage && (
            <Pagination
              variant={PaginationVariant.bottom}
              itemCount={filteredAWSAccounts.length}
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

export default AWSAccounts;