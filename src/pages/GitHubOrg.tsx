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
  Alert,
  Button,
  List,
  ListItem
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { getDataDirUrl } from '../utils/env';

const GET_GITHUBORG = gql`
  query GitHubOrg($path: String) {
    githuborg_v1(path: $path) {
      path
      name
      description
      url
      managedTeams
    }
  }
`;

interface GitHubOrgDetail {
  path: string;
  name: string;
  description?: string;
  url?: string;
  managedTeams?: string[];
}

interface GitHubOrgData {
  githuborg_v1: GitHubOrgDetail[];
}

const GitHubOrg: React.FC = () => {
  const { path } = useParams<{ path: string }>();
  const { loading, error, data } = useQuery<GitHubOrgData>(GET_GITHUBORG, {
    variables: { path: decodeURIComponent(path || '') }
  });

  if (loading) {
    return <LoadingState message="Loading GitHub organization..." />;
  }

  if (error) {
    return <ErrorState title="Error loading GitHub organization" error={error} />;
  }

  if (!data?.githuborg_v1?.length) {
    return (
      <div>
        <Breadcrumb style={{ marginBottom: '1rem' }}>
          <BreadcrumbItem component={Link} to="/github-orgs">
            GitHub Organizations
          </BreadcrumbItem>
          <BreadcrumbItem>Not Found</BreadcrumbItem>
        </Breadcrumb>
        <Alert variant="warning" title="GitHub organization not found">
          The GitHub organization you're looking for could not be found.
        </Alert>
      </div>
    );
  }

  const org = data.githuborg_v1[0];

  return (
    <div>
      <Breadcrumb style={{ marginBottom: '1rem' }}>
        <BreadcrumbItem component={Link} to="/github-orgs">
          GitHub Organizations
        </BreadcrumbItem>
        <BreadcrumbItem>{org.name}</BreadcrumbItem>
      </Breadcrumb>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <Link to="/github-orgs" style={{ textDecoration: 'none', marginRight: '1rem' }}>
          <Button
            variant="link"
            style={{ padding: 0, fontSize: 'inherit' }}
          >
            ← Back to GitHub Organizations
          </Button>
        </Link>
        <Title headingLevel="h1" size="2xl">
          {org.name}
        </Title>
      </div>

      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
        {/* Basic Information */}
        <Card>
          <CardTitle>Basic Information</CardTitle>
          <CardBody>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <div>
                <strong>Name:</strong> {org.name}
              </div>
              {org.description && (
                <div>
                  <strong>Description:</strong> {org.description}
                </div>
              )}
              {org.url && (
                <div>
                  <strong>URL:</strong>{' '}
                  <Button
                    variant="link"
                    component="a"
                    href={org.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    icon={<ExternalLinkAltIcon />}
                    iconPosition="right"
                    style={{ padding: 0, fontSize: 'inherit' }}
                  >
                    {org.url}
                  </Button>
                </div>
              )}
              <div>
                <strong>Path:</strong>{' '}
                <Button
                  variant="link"
                  component="a"
                  href={`${getDataDirUrl()}${org.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  icon={<ExternalLinkAltIcon />}
                  iconPosition="right"
                  style={{ padding: 0, fontSize: 'inherit' }}
                >
                  {org.path}
                </Button>
              </div>
              <div>
                <strong>Managed Teams:</strong> {org.managedTeams?.length || 0}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Managed Teams */}
        {org.managedTeams && org.managedTeams.length > 0 && (
          <Card>
            <CardTitle>Managed Teams ({org.managedTeams.length})</CardTitle>
            <CardBody>
              <List>
                {org.managedTeams.map((team, index) => (
                  <ListItem key={index}>
                    {team}
                  </ListItem>
                ))}
              </List>
            </CardBody>
          </Card>
        )}

        {/* External Links */}
        {org.url && (
          <Card>
            <CardTitle>External Links</CardTitle>
            <CardBody>
              <Button
                variant="secondary"
                component="a"
                href={org.url}
                target="_blank"
                rel="noopener noreferrer"
                icon={<ExternalLinkAltIcon />}
                iconPosition="right"
              >
                GitHub Organization
              </Button>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GitHubOrg;