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
  Breadcrumb,
  BreadcrumbItem,
  Spinner,
  Alert,
  Button,
  List,
  ListItem
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

const GET_AWSGROUP = gql`
  query AWSGroup($path: String) {
    awsgroups_v1(path: $path) {
      path
      name
      description
      account {
        path
        name
        description
        consoleUrl
      }
      policies
    }
  }
`;

interface AWSGroupDetail {
  path: string;
  name: string;
  description?: string;
  account: {
    path: string;
    name: string;
    description?: string;
    consoleUrl?: string;
  };
  policies?: string[];
}

interface AWSGroupData {
  awsgroups_v1: AWSGroupDetail[];
}

const AWSGroup: React.FC = () => {
  const { path } = useParams<{ path: string }>();
  const { loading, error, data } = useQuery<AWSGroupData>(GET_AWSGROUP, {
    variables: { path: decodeURIComponent(path || '') }
  });

  if (loading) {
    return (
      <div>
        <Breadcrumb style={{ marginBottom: '1rem' }}>
          <BreadcrumbItem component={Link} to="/aws-groups">
            AWS Groups
          </BreadcrumbItem>
          <BreadcrumbItem>Loading...</BreadcrumbItem>
        </Breadcrumb>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <Spinner size="lg" />
          <p style={{ marginTop: '1rem' }}>Loading AWS group...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Breadcrumb style={{ marginBottom: '1rem' }}>
          <BreadcrumbItem component={Link} to="/aws-groups">
            AWS Groups
          </BreadcrumbItem>
          <BreadcrumbItem>Error</BreadcrumbItem>
        </Breadcrumb>
        <Alert variant="danger" title="Error loading AWS group">
          {error.message}
        </Alert>
      </div>
    );
  }

  if (!data?.awsgroups_v1?.length) {
    return (
      <div>
        <Breadcrumb style={{ marginBottom: '1rem' }}>
          <BreadcrumbItem component={Link} to="/aws-groups">
            AWS Groups
          </BreadcrumbItem>
          <BreadcrumbItem>Not Found</BreadcrumbItem>
        </Breadcrumb>
        <Alert variant="warning" title="AWS group not found">
          The AWS group you're looking for could not be found.
        </Alert>
      </div>
    );
  }

  const group = data.awsgroups_v1[0];

  return (
    <div>
      <Breadcrumb style={{ marginBottom: '1rem' }}>
        <BreadcrumbItem component={Link} to="/aws-groups">
          AWS Groups
        </BreadcrumbItem>
        <BreadcrumbItem>{group.name}</BreadcrumbItem>
      </Breadcrumb>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <Link to="/aws-groups" style={{ textDecoration: 'none', marginRight: '1rem' }}>
          <Button
            variant="link"
            style={{ padding: 0, fontSize: 'inherit' }}
          >
            ← Back to AWS Groups
          </Button>
        </Link>
        <Title headingLevel="h1" size="2xl">
          {group.name}
        </Title>
      </div>

      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
        {/* Basic Information */}
        <Card>
          <CardTitle>Basic Information</CardTitle>
          <CardBody>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <div>
                <strong>Name:</strong> {group.name}
              </div>
              {group.description && (
                <div>
                  <strong>Description:</strong> {group.description}
                </div>
              )}
              <div>
                <strong>Path:</strong>{' '}
                <Button
                  variant="link"
                  component="a"
                  href={`${process.env.REACT_APP_DATA_DIR_URL || 'https://path/to/data'}${group.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  icon={<ExternalLinkAltIcon />}
                  iconPosition="right"
                  style={{ padding: 0, fontSize: 'inherit' }}
                >
                  {group.path}
                </Button>
              </div>
              <div>
                <strong>Policies:</strong> {group.policies?.length || 0}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Account Information */}
        <Card>
          <CardTitle>AWS Account</CardTitle>
          <CardBody>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <div>
                <strong>Account Name:</strong>{' '}
                <Link to={`/aws-account/${encodeURIComponent(group.account.path)}`} style={{ textDecoration: 'none' }}>
                  <Button
                    variant="link"
                    style={{ padding: 0, fontSize: 'inherit', fontWeight: 'bold' }}
                  >
                    {group.account.name}
                  </Button>
                </Link>
              </div>
              {group.account.description && (
                <div>
                  <strong>Account Description:</strong> {group.account.description}
                </div>
              )}
              <div>
                <strong>Account Path:</strong>{' '}
                <Button
                  variant="link"
                  component="a"
                  href={`${process.env.REACT_APP_DATA_DIR_URL || 'https://path/to/data'}${group.account.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  icon={<ExternalLinkAltIcon />}
                  iconPosition="right"
                  style={{ padding: 0, fontSize: 'inherit' }}
                >
                  {group.account.path}
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Policies */}
        {group.policies && group.policies.length > 0 && (
          <Card>
            <CardTitle>Policies ({group.policies.length})</CardTitle>
            <CardBody>
              <List>
                {group.policies.map((policy, index) => (
                  <ListItem key={index}>
                    {policy}
                  </ListItem>
                ))}
              </List>
            </CardBody>
          </Card>
        )}

        {/* External Links */}
        {group.account.consoleUrl && (
          <Card>
            <CardTitle>External Links</CardTitle>
            <CardBody>
              <Button
                variant="secondary"
                component="a"
                href={group.account.consoleUrl}
                target="_blank"
                rel="noopener noreferrer"
                icon={<ExternalLinkAltIcon />}
                iconPosition="right"
              >
                AWS Console
              </Button>
            </CardBody>
          </Card>
        )}

      </div>
    </div>
  );
};

export default AWSGroup;