import React, { useState, useMemo } from 'react';
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
  Spinner,
  Alert,
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

const GET_INSTANCES = gql`
  query JenkinsInstances {
    jenkins_instances_v1 {
      path
      name
      description
      serverUrl
    }
  }
`;

interface JenkinsInstance {
  path: string;
  name: string;
  description?: string;
  serverUrl?: string;
}

interface JenkinsInstancesData {
  jenkins_instances_v1: JenkinsInstance[];
}

const JenkinsInstances: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const { loading, error, data } = useQuery<JenkinsInstancesData>(GET_INSTANCES);

  const filteredJenkinsInstances = useMemo(() => {
    if (!data?.jenkins_instances_v1) return [];

    return data.jenkins_instances_v1.filter((instance: JenkinsInstance) =>
      instance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instance.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instance.serverUrl?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const paginatedJenkinsInstances = useMemo(() => {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    return filteredJenkinsInstances.slice(startIndex, endIndex);
  }, [filteredJenkinsInstances, page, perPage]);

  const onSetPage = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPage: number) => {
    setPage(newPage);
  };

  const onPerPageSelect = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPerPage: number,
    newPage: number
  ) => {
    setPerPage(newPerPage);
    setPage(newPage);
  };

  if (loading) {
    return (
      <div>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
          Jenkins Instances
        </Title>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <Spinner size="lg" />
          <p style={{ marginTop: '1rem' }}>Loading Jenkins instances...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
          Jenkins Instances
        </Title>
        <Alert variant="danger" title="Error loading Jenkins instances">
          {error.message}
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
        Jenkins Instances
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
                  aria-label="Search Jenkins instances"
                  placeholder="Search by name, description, or server URL..."
                  value={searchTerm}
                  onChange={(_event, value) => {
                    setSearchTerm(value);
                    setPage(1);
                  }}
                />
              </ToolbarItem>
              <ToolbarItem align={{ default: 'alignEnd' }}>
                <span style={{ color: 'var(--pf-v6-global--Color--200)' }}>
                  {filteredJenkinsInstances.length} instance{filteredJenkinsInstances.length !== 1 ? 's' : ''} found
                </span>
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>

          <Table aria-label="Jenkins Instances table">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Description</Th>
                <Th>Server URL</Th>
                <Th>Path</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedJenkinsInstances.map((instance: JenkinsInstance) => (
                <Tr key={instance.path}>
                  <Td dataLabel="Name">
                    <Link to={`/jenkins-instance/${encodeURIComponent(instance.path)}`} style={{ textDecoration: 'none' }}>
                      <Button
                        variant="link"
                        style={{ padding: 0, fontSize: 'inherit', fontWeight: 'bold' }}
                      >
                        {instance.name}
                      </Button>
                    </Link>
                  </Td>
                  <Td dataLabel="Description">
                    {instance.description || '-'}
                  </Td>
                  <Td dataLabel="Server URL">
                    {instance.serverUrl ? (
                      <Button
                        variant="link"
                        component="a"
                        href={instance.serverUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        icon={<ExternalLinkAltIcon />}
                        iconPosition="right"
                        style={{ padding: 0, fontSize: 'inherit' }}
                      >
                        {instance.serverUrl}
                      </Button>
                    ) : '-'}
                  </Td>
                  <Td dataLabel="Path">
                    <Button
                      variant="link"
                      component="a"
                      href={`${process.env.REACT_APP_DATA_DIR_URL || 'https://path/to/data'}${instance.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      icon={<ExternalLinkAltIcon />}
                      iconPosition="right"
                      style={{ padding: 0, fontSize: 'inherit' }}
                    >
                      {instance.path}
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {filteredJenkinsInstances.length === 0 && searchTerm && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>No Jenkins instances found matching "{searchTerm}"</p>
            </div>
          )}

          {filteredJenkinsInstances.length > perPage && (
            <Pagination
              variant={PaginationVariant.bottom}
              itemCount={filteredJenkinsInstances.length}
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

export default JenkinsInstances;