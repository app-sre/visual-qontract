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
  Button
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { getDataDirUrl } from '../utils/env';

const GET_INTEGRATION = gql`
  query Integration($path: String) {
    integrations_v1(path: $path) {
      path
      name
      description
      upstream
    }
  }
`;

interface IntegrationDetail {
  path: string;
  name: string;
  description?: string;
  upstream?: string;
}

interface IntegrationData {
  integrations_v1: IntegrationDetail[];
}

const Integration: React.FC = () => {
  const { '*': path } = useParams<{ '*': string }>();
  const { loading, error, data } = useQuery<IntegrationData>(GET_INTEGRATION, {
    variables: { path: path ? `/${path}` : '' }
  });

  if (loading) {
    return <LoadingState message="Loading integration..." />;
  }

  if (error) {
    return <ErrorState title="Error loading integration" error={error} />;
  }

  if (!data?.integrations_v1?.length) {
    return (
      <div>
        <Breadcrumb style={{ marginBottom: '1rem' }}>
          <BreadcrumbItem component={Link} to="/integrations">
            Integrations
          </BreadcrumbItem>
          <BreadcrumbItem>Not Found</BreadcrumbItem>
        </Breadcrumb>
        <Alert variant="warning" title="Integration not found">
          The integration you're looking for could not be found.
        </Alert>
      </div>
    );
  }

  const integration = data.integrations_v1[0];

  return (
    <div>
      <Breadcrumb style={{ marginBottom: '1rem' }}>
        <BreadcrumbItem component={Link} to="/integrations">
          Integrations
        </BreadcrumbItem>
        <BreadcrumbItem>{integration.name}</BreadcrumbItem>
      </Breadcrumb>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <Link to="/integrations" style={{ textDecoration: 'none', marginRight: '1rem' }}>
          <Button
            variant="link"
            style={{ padding: 0, fontSize: 'inherit' }}
          >
            ← Back to Integrations
          </Button>
        </Link>
        <Title headingLevel="h1" size="2xl">
          {integration.name}
        </Title>
      </div>

      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
        {/* Basic Information */}
        <Card>
          <CardTitle>Basic Information</CardTitle>
          <CardBody>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <div>
                <strong>Name:</strong> {integration.name}
              </div>
              {integration.description && (
                <div>
                  <strong>Description:</strong> {integration.description}
                </div>
              )}
              {integration.upstream && (
                <div>
                  <strong>Upstream:</strong> {integration.upstream}
                </div>
              )}
              <div>
                <strong>Path:</strong>{' '}
                <Button
                  variant="link"
                  component="a"
                  href={`${getDataDirUrl()}${integration.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  icon={<ExternalLinkAltIcon />}
                  iconPosition="right"
                  style={{ padding: 0, fontSize: 'inherit' }}
                >
                  {integration.path}
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* External Links */}
        {integration.upstream && (
          <Card>
            <CardTitle>External Links</CardTitle>
            <CardBody>
              <Button
                variant="secondary"
                component="a"
                href={integration.upstream}
                target="_blank"
                rel="noopener noreferrer"
                icon={<ExternalLinkAltIcon />}
                iconPosition="right"
              >
                Upstream Source
              </Button>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Integration;