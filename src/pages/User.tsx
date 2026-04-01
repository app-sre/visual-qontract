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

const GET_USER = gql`
  query User($path: String) {
    users_v1(path: $path) {
      path
      name
      org_username
      github_username
      quay_username
      public_gpg_key
      roles {
        path
        name
      }
    }
  }
`;

interface UserData {
  users_v1: Array<{
    path: string;
    name: string;
    org_username?: string;
    github_username?: string;
    quay_username?: string;
    public_gpg_key?: string;
    roles?: Array<{
      path: string;
      name: string;
    }>;
  }>;
}

const User: React.FC = () => {
  const { path } = useParams<{ path: string }>();
  const decodedPath = path ? decodeURIComponent(path) : '';

  const { loading, error, data } = useQuery<UserData>(GET_USER, {
    variables: { path: decodedPath },
    skip: !decodedPath
  });

  const linkFormat = (url: string) => (value: string) => (
    <a href={`${url}${value}`} target="_blank" rel="noopener noreferrer">
      {value}
    </a>
  );

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <Spinner size="lg" />
        <p style={{ marginTop: '1rem' }}>Loading user details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Breadcrumb>
          <BreadcrumbItem component={Link} to="/users">
            Users
          </BreadcrumbItem>
          <BreadcrumbItem>User Details</BreadcrumbItem>
        </Breadcrumb>
        <Alert variant="danger" title="Error loading user">
          {error.message}
        </Alert>
      </div>
    );
  }

  if (!data?.users_v1?.length) {
    return (
      <div>
        <Breadcrumb>
          <BreadcrumbItem component={Link} to="/users">
            Users
          </BreadcrumbItem>
          <BreadcrumbItem>User Details</BreadcrumbItem>
        </Breadcrumb>
        <Alert variant="warning" title="User not found">
          No user found for path: {decodedPath}
        </Alert>
      </div>
    );
  }

  const user = data.users_v1[0];

  return (
    <div>
      <Breadcrumb style={{ marginBottom: '1rem' }}>
        <BreadcrumbItem component={Link} to="/users">
          Users
        </BreadcrumbItem>
        <BreadcrumbItem>{user.name}</BreadcrumbItem>
      </Breadcrumb>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <Link to="/users" style={{ textDecoration: 'none', marginRight: '1rem' }}>
          <Button
            variant="link"
            style={{ padding: 0, fontSize: 'inherit' }}
          >
            ← Back to Users
          </Button>
        </Link>
        <Title headingLevel="h1" size="2xl">
          {user.name}
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
                <DescriptionListDescription>{user.name}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Path</DescriptionListTerm>
                <DescriptionListDescription>
                  <Button
                    variant="link"
                    component="a"
                    href={`${process.env.REACT_APP_DATA_DIR_URL || 'https://path/to/data'}${user.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    icon={<ExternalLinkAltIcon />}
                    iconPosition="right"
                    style={{ padding: 0, fontSize: 'inherit' }}
                  >
                    {user.path}
                  </Button>
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </CardBody>
        </Card>

        {/* User Accounts */}
        <Card>
          <CardTitle>User Accounts</CardTitle>
          <CardBody>
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTerm>RedHat Username</DescriptionListTerm>
                <DescriptionListDescription>
                  {user.org_username ?
                    linkFormat('https://rover.redhat.com/people/profile/')(user.org_username) :
                    '-'
                  }
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>GitHub Username</DescriptionListTerm>
                <DescriptionListDescription>
                  {user.github_username ?
                    linkFormat('https://github.com/')(user.github_username) :
                    '-'
                  }
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Quay Username</DescriptionListTerm>
                <DescriptionListDescription>
                  {user.quay_username ?
                    linkFormat('https://quay.io/user/')(user.quay_username) :
                    '-'
                  }
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </CardBody>
        </Card>

        {/* GPG Key */}
        {user.public_gpg_key && (
          <Card>
            <CardTitle>Public GPG Key</CardTitle>
            <CardBody>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <pre style={{
                  backgroundColor: 'var(--pf-v6-global--BackgroundColor--200)',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  flex: 1,
                  maxHeight: '150px'
                }}>
                  {user.public_gpg_key}
                </pre>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(user.public_gpg_key || '');
                  }}
                >
                  Copy to Clipboard
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Roles */}
        {user.roles && user.roles.length > 0 && (
          <Card>
            <CardTitle>Roles ({user.roles.length})</CardTitle>
            <CardBody>
              <Table aria-label="Roles table">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {user.roles.map((role, index) => (
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

export default User;