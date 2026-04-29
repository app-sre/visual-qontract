import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import {
  Title,
  Card,
  CardTitle,
  CardBody,
  Alert,
  Button,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Breadcrumb,
  BreadcrumbItem
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
import UsersTable from '../components/UsersTable';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { getDataDirUrl } from '../utils/env';

const GET_ROLE = gql`
  query Role($path: String) {
    roles_v1(path: $path) {
      path
      name
      description
      permissions {
        path
        name
        description
        service
      }
      access {
        namespace {
          path
          name
          cluster {
            name
            path
          }
        }
        role
        cluster {
          path
          name
        }
        group
      }
      users {
        path
        name
        org_username
        github_username
        quay_username
      }
      bots {
        path
        name
      }
    }
  }
`;

interface RoleData {
  roles_v1: Array<{
    path: string;
    name: string;
    description?: string;
    permissions?: Array<{
      path: string;
      name: string;
      description?: string;
      service?: string;
    }>;
    access?: Array<{
      namespace?: {
        path: string;
        name: string;
        cluster: {
          name: string;
          path: string;
        };
      };
      role?: string;
      cluster?: {
        path: string;
        name: string;
      };
      group?: string;
    }>;
    users?: Array<{
      path: string;
      name: string;
      org_username?: string;
      github_username?: string;
      quay_username?: string;
    }>;
    bots?: Array<{
      path: string;
      name: string;
    }>;
  }>;
}

const Role: React.FC = () => {
  const { '*': path } = useParams<{ '*': string }>();
  const decodedPath = path ? `/${path}` : '';

  const { loading, error, data } = useQuery<RoleData>(GET_ROLE, {
    variables: { path: decodedPath },
    skip: !decodedPath
  });

  if (loading) {
    return <LoadingState message="Loading role details..." />;
  }

  if (error) {
    return (
      <div>
        <Breadcrumb>
          <BreadcrumbItem component={Link} to="/roles">
            Roles
          </BreadcrumbItem>
          <BreadcrumbItem>Role Details</BreadcrumbItem>
        </Breadcrumb>
        <ErrorState title="Error loading role" error={error} />
      </div>
    );
  }

  if (!data?.roles_v1?.length) {
    return (
      <div>
        <Breadcrumb>
          <BreadcrumbItem component={Link} to="/roles">
            Roles
          </BreadcrumbItem>
          <BreadcrumbItem>Role Details</BreadcrumbItem>
        </Breadcrumb>
        <Alert variant="warning" title="Role not found">
          No role found for path: {decodedPath}
        </Alert>
      </div>
    );
  }

  const role = data.roles_v1[0];

  return (
    <div>
      <Breadcrumb style={{ marginBottom: '1rem' }}>
        <BreadcrumbItem component={Link} to="/roles">
          Roles
        </BreadcrumbItem>
        <BreadcrumbItem>{role.name}</BreadcrumbItem>
      </Breadcrumb>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <Link to="/roles" style={{ textDecoration: 'none', marginRight: '1rem' }}>
          <Button
            variant="link"
            style={{ padding: 0, fontSize: 'inherit' }}
          >
            ← Back to Roles
          </Button>
        </Link>
        <Title headingLevel="h1" size="2xl">
          {role.name}
        </Title>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Basic Information */}
        <Card>
          <CardTitle>Basic Information</CardTitle>
          <CardBody>
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTerm>Name</DescriptionListTerm>
                <DescriptionListDescription>{role.name}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Path</DescriptionListTerm>
                <DescriptionListDescription>
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
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Description</DescriptionListTerm>
                <DescriptionListDescription>{role.description || '-'}</DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </CardBody>
        </Card>

        {/* Permissions */}
        {role.permissions && role.permissions.length > 0 && (
          <Card>
            <CardTitle>Permissions ({role.permissions.length})</CardTitle>
            <CardBody>
              <Table aria-label="Permissions table">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Service</Th>
                    <Th>Description</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {role.permissions.map((permission, index) => (
                    <Tr key={index}>
                      <Td>
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
                          {permission.name}
                        </Button>
                      </Td>
                      <Td>{permission.service || '-'}</Td>
                      <Td>{permission.description || '-'}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardBody>
          </Card>
        )}

        {/* Namespace Access */}
        {role.access && role.access.filter(access => access.namespace).length > 0 && (
          <Card>
            <CardTitle>Namespace Access ({role.access.filter(access => access.namespace).length})</CardTitle>
            <CardBody>
              <Table aria-label="Namespace Access table">
                <Thead>
                  <Tr>
                    <Th>Namespace</Th>
                    <Th>Cluster</Th>
                    <Th>Role</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {role.access.filter(access => access.namespace).map((access, index) => (
                    <Tr key={index}>
                      <Td>
                        <Link
                          to={`/namespace${access.namespace!.path}`}
                          style={{ textDecoration: 'none' }}
                        >
                          <Button
                            variant="link"
                            style={{ padding: 0, fontSize: 'inherit' }}
                          >
                            {access.namespace!.name}
                          </Button>
                        </Link>
                      </Td>
                      <Td>
                        <Link
                          to={`/cluster${access.namespace!.cluster.path}`}
                          style={{ textDecoration: 'none' }}
                        >
                          <Button
                            variant="link"
                            style={{ padding: 0, fontSize: 'inherit' }}
                          >
                            {access.namespace!.cluster.name}
                          </Button>
                        </Link>
                      </Td>
                      <Td>{access.role || '-'}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardBody>
          </Card>
        )}

        {/* Cluster Access */}
        {role.access && role.access.filter(access => access.cluster && !access.namespace).length > 0 && (
          <Card>
            <CardTitle>Cluster Access ({role.access.filter(access => access.cluster && !access.namespace).length})</CardTitle>
            <CardBody>
              <Table aria-label="Cluster Access table">
                <Thead>
                  <Tr>
                    <Th>Cluster</Th>
                    <Th>Group</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {role.access.filter(access => access.cluster && !access.namespace).map((access, index) => (
                    <Tr key={index}>
                      <Td>
                        <Link
                          to={`/cluster${access.cluster!.path}`}
                          style={{ textDecoration: 'none' }}
                        >
                          <Button
                            variant="link"
                            style={{ padding: 0, fontSize: 'inherit' }}
                          >
                            {access.cluster!.name}
                          </Button>
                        </Link>
                      </Td>
                      <Td>{access.group || '-'}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardBody>
          </Card>
        )}

        {/* Users */}
        {role.users && role.users.length > 0 && (
          <Card>
            <CardTitle>Users ({role.users.length})</CardTitle>
            <CardBody>
              <UsersTable users={role.users} showGpgKey={false} showName={true} />
            </CardBody>
          </Card>
        )}

        {/* Bots */}
        {role.bots && role.bots.length > 0 && (
          <Card>
            <CardTitle>Bots ({role.bots.length})</CardTitle>
            <CardBody>
              <Table aria-label="Bots table">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {role.bots.map((bot, index) => (
                    <Tr key={index}>
                      <Td>
                        <Button
                          variant="link"
                          component="a"
                          href={`${getDataDirUrl()}${bot.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          icon={<ExternalLinkAltIcon />}
                          iconPosition="right"
                          style={{ padding: 0, fontSize: 'inherit' }}
                        >
                          {bot.name}
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Role;