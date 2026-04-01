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
  Button
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

const GET_DEPENDENCY = gql`
  query Dependency($path: String) {
    dependencies_v1(path: $path) {
      path
      name
      description
      statefulness
      opsModel
      statusPage
      SLA
      dependencyFailureImpact
      monitoring {
        url
      }
    }
  }
`;

interface DependencyDetail {
  path: string;
  name: string;
  description?: string;
  statefulness?: string;
  opsModel?: string;
  statusPage?: string;
  SLA?: string;
  dependencyFailureImpact?: string;
  monitoring?: {
    url?: string;
  };
}

interface DependencyData {
  dependencies_v1: DependencyDetail[];
}

const Dependency: React.FC = () => {
  const { path } = useParams<{ path: string }>();
  const { loading, error, data } = useQuery<DependencyData>(GET_DEPENDENCY, {
    variables: { path: decodeURIComponent(path || '') }
  });

  if (loading) {
    return (
      <div>
        <Breadcrumb style={{ marginBottom: '1rem' }}>
          <BreadcrumbItem component={Link} to="/dependencies">
            Dependencies
          </BreadcrumbItem>
          <BreadcrumbItem>Loading...</BreadcrumbItem>
        </Breadcrumb>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <Spinner size="lg" />
          <p style={{ marginTop: '1rem' }}>Loading dependency...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Breadcrumb style={{ marginBottom: '1rem' }}>
          <BreadcrumbItem component={Link} to="/dependencies">
            Dependencies
          </BreadcrumbItem>
          <BreadcrumbItem>Error</BreadcrumbItem>
        </Breadcrumb>
        <Alert variant="danger" title="Error loading dependency">
          {error.message}
        </Alert>
      </div>
    );
  }

  if (!data?.dependencies_v1?.length) {
    return (
      <div>
        <Breadcrumb style={{ marginBottom: '1rem' }}>
          <BreadcrumbItem component={Link} to="/dependencies">
            Dependencies
          </BreadcrumbItem>
          <BreadcrumbItem>Not Found</BreadcrumbItem>
        </Breadcrumb>
        <Alert variant="warning" title="Dependency not found">
          The dependency you're looking for could not be found.
        </Alert>
      </div>
    );
  }

  const dependency = data.dependencies_v1[0];

  return (
    <div>
      <Breadcrumb style={{ marginBottom: '1rem' }}>
        <BreadcrumbItem component={Link} to="/dependencies">
          Dependencies
        </BreadcrumbItem>
        <BreadcrumbItem>{dependency.name}</BreadcrumbItem>
      </Breadcrumb>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <Link to="/dependencies" style={{ textDecoration: 'none', marginRight: '1rem' }}>
          <Button
            variant="link"
            style={{ padding: 0, fontSize: 'inherit' }}
          >
            ← Back to Dependencies
          </Button>
        </Link>
        <Title headingLevel="h1" size="2xl">
          {dependency.name}
        </Title>
      </div>

      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
        {/* Basic Information */}
        <Card>
          <CardTitle>Basic Information</CardTitle>
          <CardBody>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <div>
                <strong>Name:</strong> {dependency.name}
              </div>
              {dependency.description && (
                <div>
                  <strong>Description:</strong> {dependency.description}
                </div>
              )}
              {dependency.statefulness && (
                <div>
                  <strong>Statefulness:</strong> {dependency.statefulness}
                </div>
              )}
              {dependency.opsModel && (
                <div>
                  <strong>Ops Model:</strong> {dependency.opsModel}
                </div>
              )}
              {dependency.SLA && (
                <div>
                  <strong>SLA:</strong> {dependency.SLA}
                </div>
              )}
              {dependency.dependencyFailureImpact && (
                <div>
                  <strong>Dependency Failure Impact:</strong> {dependency.dependencyFailureImpact}
                </div>
              )}
              <div>
                <strong>Path:</strong>{' '}
                <Button
                  variant="link"
                  component="a"
                  href={`${process.env.REACT_APP_DATA_DIR_URL || 'https://path/to/data'}${dependency.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  icon={<ExternalLinkAltIcon />}
                  iconPosition="right"
                  style={{ padding: 0, fontSize: 'inherit' }}
                >
                  {dependency.path}
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* External Links */}
        {(dependency.statusPage || dependency.monitoring?.url) && (
          <Card>
            <CardTitle>External Links</CardTitle>
            <CardBody>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {dependency.statusPage && (
                  <Button
                    variant="secondary"
                    component="a"
                    href={dependency.statusPage}
                    target="_blank"
                    rel="noopener noreferrer"
                    icon={<ExternalLinkAltIcon />}
                    iconPosition="right"
                  >
                    Status Page
                  </Button>
                )}
                {dependency.monitoring?.url && (
                  <Button
                    variant="secondary"
                    component="a"
                    href={dependency.monitoring.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    icon={<ExternalLinkAltIcon />}
                    iconPosition="right"
                  >
                    Monitoring
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dependency;