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
import GrafanaUrl from '../components/GrafanaUrl';
import { useFilteredPagination } from '../hooks/useFilteredPagination';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { getDataDirUrl } from '../utils/env';

const GET_NAMESPACES = gql`
  query Namespaces {
    namespaces_v1 {
      path
      name
      description
      cluster {
        name
        path
      }
      app {
        name
        path
      }
    }
  }
`;

interface Namespace {
  path: string;
  name: string;
  description?: string;
  cluster: {
    name: string;
    path: string;
  };
  app: {
    name: string;
    path: string;
  };
}

interface NamespacesQueryData {
  namespaces_v1: Namespace[];
}

const Namespaces: React.FC = () => {
  const { loading, error, data } = useQuery<NamespacesQueryData>(GET_NAMESPACES);

  const {
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    perPage,
    filteredItems: filteredNamespaces,
    paginatedItems: paginatedNamespaces,
    onSetPage,
    onPerPageSelect,
  } = useFilteredPagination({
    items: data?.namespaces_v1 || [],
    filterFn: (namespace, term) =>
      namespace.name.toLowerCase().includes(term.toLowerCase()) ||
      namespace.app.name.toLowerCase().includes(term.toLowerCase()) ||
      namespace.cluster.name.toLowerCase().includes(term.toLowerCase()) ||
      (namespace.description?.toLowerCase().includes(term.toLowerCase()) ?? false),
  });

  if (loading) {
    return (
      <div>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
          Namespaces
        </Title>
        <LoadingState message="Loading namespaces..." />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
          Namespaces
        </Title>
        <ErrorState title="Error loading namespaces" error={error} />
      </div>
    );
  }

  return (
    <div>
      <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
        Namespaces
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
                  aria-label="Search namespaces"
                  placeholder="Search by namespace name, app, cluster, or description..."
                  value={searchTerm}
                  onChange={(_event, value) => {
                    setSearchTerm(value);
                    setPage(1); // Reset to first page when searching
                  }}
                />
              </ToolbarItem>
              <ToolbarItem align={{ default: 'alignEnd' }}>
                <span style={{ color: 'var(--pf-v6-global--Color--200)' }}>
                  {filteredNamespaces.length} namespace{filteredNamespaces.length !== 1 ? 's' : ''} found
                </span>
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>

          <Table aria-label="Namespaces table">
            <Thead>
              <Tr>
                <Th>Namespace Name</Th>
                <Th>Path</Th>
                <Th>App</Th>
                <Th>Cluster</Th>
                <Th>Grafana URL</Th>
                <Th>Description</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedNamespaces.map((namespace: Namespace) => (
                <Tr key={namespace.path}>
                  <Td dataLabel="Namespace Name">
                    <Link
                      to={`/namespace/${encodeURIComponent(namespace.path)}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Button
                        variant="link"
                        style={{ padding: 0, fontSize: 'inherit', fontWeight: 'bold' }}
                      >
                        {namespace.name}
                      </Button>
                    </Link>
                  </Td>
                  <Td dataLabel="Path">
                    <Button
                      variant="link"
                      component="a"
                      href={`${getDataDirUrl()}${namespace.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      icon={<ExternalLinkAltIcon />}
                      iconPosition="right"
                      style={{ padding: 0, fontSize: 'inherit' }}
                    >
                      {namespace.path}
                    </Button>
                  </Td>
                  <Td dataLabel="App">
                    <Link
                      to={`/service/${encodeURIComponent(namespace.app.path)}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Button
                        variant="link"
                        style={{ padding: 0, fontSize: 'inherit' }}
                      >
                        {namespace.app.name}
                      </Button>
                    </Link>
                  </Td>
                  <Td dataLabel="Cluster">
                    {namespace.cluster.name}
                  </Td>
                  <Td dataLabel="Grafana URL">
                    <GrafanaUrl
                      cluster={namespace.cluster.name}
                      namespace={namespace.name}
                      style={{ padding: 0, fontSize: 'inherit' }}
                      hide={true}
                    />
                  </Td>
                  <Td dataLabel="Description">
                    {namespace.description || '-'}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {filteredNamespaces.length === 0 && searchTerm && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>No namespaces found matching "{searchTerm}"</p>
            </div>
          )}

          {filteredNamespaces.length > perPage && (
            <Pagination
              variant={PaginationVariant.bottom}
              itemCount={filteredNamespaces.length}
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

export default Namespaces;