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
  ListItem,
  Label
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { getDataDirUrl } from '../utils/env';

const GET_NOTIFICATION = gql`
  query Notification($path: String) {
    app_interface_emails_v1(path: $path) {
      path
      labels
      name
      subject
      to {
        users {
          path
          name
        }
      }
      body
    }
  }
`;

interface NotificationUser {
  path: string;
  name: string;
}

interface NotificationRecipient {
  users?: NotificationUser[];
}

interface NotificationDetail {
  path: string;
  labels?: string[];
  name: string;
  subject?: string;
  to: NotificationRecipient;
  body?: string;
}

interface NotificationData {
  app_interface_emails_v1: NotificationDetail[];
}

const Notification: React.FC = () => {
  const { '*': path } = useParams<{ '*': string }>();
  const { loading, error, data } = useQuery<NotificationData>(GET_NOTIFICATION, {
    variables: { path: path ? `/${path}` : '' }
  });

  if (loading) {
    return <LoadingState message="Loading notification..." />;
  }

  if (error) {
    return <ErrorState title="Error loading notification" error={error} />;
  }

  if (!data?.app_interface_emails_v1?.length) {
    return (
      <div>
        <Breadcrumb style={{ marginBottom: '1rem' }}>
          <BreadcrumbItem component={Link} to="/notifications">
            Notifications
          </BreadcrumbItem>
          <BreadcrumbItem>Not Found</BreadcrumbItem>
        </Breadcrumb>
        <Alert variant="warning" title="Notification not found">
          The notification you're looking for could not be found.
        </Alert>
      </div>
    );
  }

  const notification = data.app_interface_emails_v1[0];

  return (
    <div>
      <Breadcrumb style={{ marginBottom: '1rem' }}>
        <BreadcrumbItem component={Link} to="/notifications">
          Notifications
        </BreadcrumbItem>
        <BreadcrumbItem>{notification.name}</BreadcrumbItem>
      </Breadcrumb>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <Link to="/notifications" style={{ textDecoration: 'none', marginRight: '1rem' }}>
          <Button
            variant="link"
            style={{ padding: 0, fontSize: 'inherit' }}
          >
            ← Back to Notifications
          </Button>
        </Link>
        <Title headingLevel="h1" size="2xl">
          {notification.name}
        </Title>
      </div>

      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
        {/* Basic Information */}
        <Card>
          <CardTitle>Basic Information</CardTitle>
          <CardBody>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <div>
                <strong>Name:</strong> {notification.name}
              </div>
              {notification.subject && (
                <div>
                  <strong>Subject:</strong> {notification.subject}
                </div>
              )}
              {notification.labels && Array.isArray(notification.labels) && notification.labels.length > 0 && (
                <div>
                  <strong>Labels:</strong>
                  <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                    {notification.labels.map((label, index) => (
                      <Label key={index} variant="outline">
                        {label}
                      </Label>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <strong>Path:</strong>{' '}
                <Button
                  variant="link"
                  component="a"
                  href={`${getDataDirUrl()}${notification.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  icon={<ExternalLinkAltIcon />}
                  iconPosition="right"
                  style={{ padding: 0, fontSize: 'inherit' }}
                >
                  {notification.path}
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Recipients */}
        {notification.to.users && notification.to.users.length > 0 && (
          <Card>
            <CardTitle>Recipients ({notification.to.users.length})</CardTitle>
            <CardBody>
              <List>
                {notification.to.users.map((user) => (
                  <ListItem key={user.path}>
                    <Link to={`/user${user.path}`} style={{ textDecoration: 'none' }}>
                      <Button
                        variant="link"
                        style={{ padding: 0, fontSize: 'inherit', fontWeight: 'bold' }}
                      >
                        {user.name}
                      </Button>
                    </Link>
                  </ListItem>
                ))}
              </List>
            </CardBody>
          </Card>
        )}

        {/* Email Body */}
        {notification.body && (
          <Card style={{ gridColumn: '1 / -1' }}>
            <CardTitle>Email Body</CardTitle>
            <CardBody>
              <pre style={{
                whiteSpace: 'pre-wrap',
                fontFamily: 'inherit',
                margin: 0,
                background: 'var(--pf-v6-global--BackgroundColor--200)',
                padding: '1rem',
                borderRadius: '4px',
                border: '1px solid var(--pf-v6-global--BorderColor--100)'
              }}>
                {notification.body}
              </pre>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Notification;