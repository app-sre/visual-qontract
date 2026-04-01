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
  Spinner,
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

const GET_PERMISSION = gql`
  query Permission($path: String) {
    permissions_v1(path: $path) {
      path
      name
      description
      service
    }
    roles_v1 {
      name
      path
      description
      permissions {
        name
      }
      users {
        name
      }
    }
  }
`;

interface PermissionData {
  permissions_v1: Array<{
    path: string;
    name: string;
    description?: string;
    service?: string;
  }>;
  roles_v1: Array<{
    name: string;
    path: string;
    description?: string;
    permissions?: Array<{
      name: string;
    }>;
    users?: Array<{
      name: string;
    }>;
  }>;
}

const Permission: React.FC = () => {
  const { path } = useParams<{ path: string }>();
  const decodedPath = path ? decodeURIComponent(path) : '';

  const { loading, error, data } = useQuery<PermissionData>(GET_PERMISSION, {
    variables: { path: decodedPath },
    skip: !decodedPath
  });

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <Spinner size="lg" />
        <p style={{ marginTop: '1rem' }}>Loading permission details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Breadcrumb>
          <BreadcrumbItem component={Link} to="/permissions">
            Permissions
          </BreadcrumbItem>
          <BreadcrumbItem>Permission Details</BreadcrumbItem>
        </Breadcrumb>
        <Alert variant="danger" title="Error loading permission">
          {error.message}
        </Alert>
      </div>
    );
  }

  if (!data?.permissions_v1?.length) {
    return (
      <div>
        <Breadcrumb>
          <BreadcrumbItem component={Link} to="/permissions">
            Permissions
          </BreadcrumbItem>
          <BreadcrumbItem>Permission Details</BreadcrumbItem>
        </Breadcrumb>
        <Alert variant="warning" title="Permission not found">
          No permission found for path: {decodedPath}
        </Alert>
      </div>
    );
  }

  const permission = data.permissions_v1[0];

  // Filter roles that have this specific permission
  const rolesWithPermission = data.roles_v1.filter(role =>
    role.permissions?.some(perm => perm.name === permission.name)
  );

  return (
    <div>
      <Breadcrumb style={{ marginBottom: '1rem' }}>
        <BreadcrumbItem component={Link} to="/permissions">
          Permissions
        </BreadcrumbItem>
        <BreadcrumbItem>{permission.name}</BreadcrumbItem>
      </Breadcrumb>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <Link to="/permissions" style={{ textDecoration: 'none', marginRight: '1rem' }}>
          <Button
            variant="link"
            style={{ padding: 0, fontSize: 'inherit' }}
          >
            ← Back to Permissions
          </Button>
        </Link>
        <Title headingLevel="h1" size="2xl">
          {permission.name}
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
                <DescriptionListDescription>{permission.name}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Path</DescriptionListTerm>
                <DescriptionListDescription>
                  <Button
                    variant="link"
                    component="a"
                    href={`${process.env.REACT_APP_DATA_DIR_URL || 'https://path/to/data'}${permission.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    icon={<ExternalLinkAltIcon />}
                    iconPosition="right"
                    style={{ padding: 0, fontSize: 'inherit' }}
                  >
                    {permission.path}
                  </Button>
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Service</DescriptionListTerm>
                <DescriptionListDescription>{permission.service || '-'}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Description</DescriptionListTerm>
                <DescriptionListDescription>{permission.description || '-'}</DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </CardBody>
        </Card>

        {/* Roles with this Permission */}
        {rolesWithPermission.length > 0 && (
          <Card>
            <CardTitle>Roles with this Permission ({rolesWithPermission.length})</CardTitle>
            <CardBody>
              <Table aria-label="Roles table">
                <Thead>
                  <Tr>
                    <Th>Role Name</Th>
                    <Th>Description</Th>
                    <Th>Users</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {rolesWithPermission.map((role, index) => (
                    <Tr key={index}>
                      <Td>
                        <Link
                          to={`/role/${encodeURIComponent(role.path)}`}
                          style={{ textDecoration: 'none' }}
                        >
                          <Button
                            variant="link"
                            style={{ padding: 0, fontSize: 'inherit' }}
                          >
                            {role.name}
                          </Button>
                        </Link>
                      </Td>
                      <Td>{role.description || '-'}</Td>
                      <Td>{role.users?.length || 0}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardBody>
          </Card>
        )}

        {rolesWithPermission.length === 0 && (
          <Card>
            <CardTitle>Roles with this Permission</CardTitle>
            <CardBody>
              <Alert variant="info" title="No roles found">
                This permission is not currently assigned to any roles.
              </Alert>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Permission;