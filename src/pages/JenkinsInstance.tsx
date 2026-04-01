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

const GET_INSTANCE = gql`
  query JenkinsInstance($path: String) {
    jenkins_instances_v1(path: $path) {
      path
      name
      description
      serverUrl
    }
  }
`;

interface JenkinsInstanceDetail {
  path: string;
  name: string;
  description?: string;
  serverUrl?: string;
}

interface JenkinsInstanceData {
  jenkins_instances_v1: JenkinsInstanceDetail[];
}

const JenkinsInstance: React.FC = () => {
  const { path } = useParams<{ path: string }>();
  const { loading, error, data } = useQuery<JenkinsInstanceData>(GET_INSTANCE, {
    variables: { path: decodeURIComponent(path || '') }
  });

  if (loading) {
    return (
      <div>
        <Breadcrumb style={{ marginBottom: '1rem' }}>
          <BreadcrumbItem component={Link} to="/jenkins-instances">
            Jenkins Instances
          </BreadcrumbItem>
          <BreadcrumbItem>Loading...</BreadcrumbItem>
        </Breadcrumb>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <Spinner size="lg" />
          <p style={{ marginTop: '1rem' }}>Loading Jenkins instance...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Breadcrumb style={{ marginBottom: '1rem' }}>
          <BreadcrumbItem component={Link} to="/jenkins-instances">
            Jenkins Instances
          </BreadcrumbItem>
          <BreadcrumbItem>Error</BreadcrumbItem>
        </Breadcrumb>
        <Alert variant="danger" title="Error loading Jenkins instance">
          {error.message}
        </Alert>
      </div>
    );
  }

  if (!data?.jenkins_instances_v1?.length) {
    return (
      <div>
        <Breadcrumb style={{ marginBottom: '1rem' }}>
          <BreadcrumbItem component={Link} to="/jenkins-instances">
            Jenkins Instances
          </BreadcrumbItem>
          <BreadcrumbItem>Not Found</BreadcrumbItem>
        </Breadcrumb>
        <Alert variant="warning" title="Jenkins instance not found">
          The Jenkins instance you're looking for could not be found.
        </Alert>
      </div>
    );
  }

  const instance = data.jenkins_instances_v1[0];

  return (
    <div>
      <Breadcrumb style={{ marginBottom: '1rem' }}>
        <BreadcrumbItem component={Link} to="/jenkins-instances">
          Jenkins Instances
        </BreadcrumbItem>
        <BreadcrumbItem>{instance.name}</BreadcrumbItem>
      </Breadcrumb>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <Link to="/jenkins-instances" style={{ textDecoration: 'none', marginRight: '1rem' }}>
          <Button
            variant="link"
            style={{ padding: 0, fontSize: 'inherit' }}
          >
            ← Back to Jenkins Instances
          </Button>
        </Link>
        <Title headingLevel="h1" size="2xl">
          {instance.name}
        </Title>
      </div>

      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
        {/* Basic Information */}
        <Card>
          <CardTitle>Basic Information</CardTitle>
          <CardBody>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <div>
                <strong>Name:</strong> {instance.name}
              </div>
              {instance.description && (
                <div>
                  <strong>Description:</strong> {instance.description}
                </div>
              )}
              {instance.serverUrl && (
                <div>
                  <strong>Server URL:</strong>{' '}
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
                </div>
              )}
              <div>
                <strong>Path:</strong>{' '}
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
              </div>
            </div>
          </CardBody>
        </Card>

        {/* External Links */}
        {instance.serverUrl && (
          <Card>
            <CardTitle>External Links</CardTitle>
            <CardBody>
              <Button
                variant="secondary"
                component="a"
                href={instance.serverUrl}
                target="_blank"
                rel="noopener noreferrer"
                icon={<ExternalLinkAltIcon />}
                iconPosition="right"
              >
                Jenkins Server
              </Button>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

export default JenkinsInstance;