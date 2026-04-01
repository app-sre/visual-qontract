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

const GET_NOTIFICATIONS = gql`
  query Notifications {
    app_interface_emails_v1 {
      path
      labels
      name
      subject
      to {
        users {
          name
          path
        }
        namespaces {
          name
          path
        }
        aws_accounts {
          name
          path
        }
      }
      body
    }
  }
`;

interface NotificationRecipient {
  users?: Array<{
    name: string;
    path: string;
  }>;
  namespaces?: Array<{
    name: string;
    path: string;
  }>;
  aws_accounts?: Array<{
    name: string;
    path: string;
  }>;
}

interface Notification {
  path: string;
  labels?: string[];
  name: string;
  subject?: string;
  to: NotificationRecipient;
  body?: string;
}

interface NotificationsData {
  app_interface_emails_v1: Notification[];
}

const Notifications: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const { loading, error, data } = useQuery<NotificationsData>(GET_NOTIFICATIONS);

  const filteredNotifications = useMemo(() => {
    if (!data?.app_interface_emails_v1) return [];

    return data.app_interface_emails_v1.filter((notification: Notification) =>
      notification.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.labels?.some(label => label.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [data, searchTerm]);

  const paginatedNotifications = useMemo(() => {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    return filteredNotifications.slice(startIndex, endIndex);
  }, [filteredNotifications, page, perPage]);

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
          Notifications
        </Title>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <Spinner size="lg" />
          <p style={{ marginTop: '1rem' }}>Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
          Notifications
        </Title>
        <Alert variant="danger" title="Error loading notifications">
          {error.message}
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
        Notifications
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
                  aria-label="Search notifications"
                  placeholder="Search by name, subject, or labels..."
                  value={searchTerm}
                  onChange={(_event, value) => {
                    setSearchTerm(value);
                    setPage(1);
                  }}
                />
              </ToolbarItem>
              <ToolbarItem align={{ default: 'alignEnd' }}>
                <span style={{ color: 'var(--pf-v6-global--Color--200)' }}>
                  {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''} found
                </span>
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>

          <Table aria-label="Notifications table">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Subject</Th>
                <Th>Path</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedNotifications.map((notification: Notification) => (
                <Tr key={notification.path}>
                  <Td dataLabel="Name">
                    <Link to={`/notification/${encodeURIComponent(notification.path)}`} style={{ textDecoration: 'none' }}>
                      <Button
                        variant="link"
                        style={{ padding: 0, fontSize: 'inherit', fontWeight: 'bold' }}
                      >
                        {notification.name}
                      </Button>
                    </Link>
                  </Td>
                  <Td dataLabel="Subject">
                    {notification.subject || '-'}
                  </Td>
                  <Td dataLabel="Path">
                    <Button
                      variant="link"
                      component="a"
                      href={`${process.env.REACT_APP_DATA_DIR_URL || 'https://path/to/data'}${notification.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      icon={<ExternalLinkAltIcon />}
                      iconPosition="right"
                      style={{ padding: 0, fontSize: 'inherit' }}
                    >
                      {notification.path}
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {filteredNotifications.length === 0 && searchTerm && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>No notifications found matching "{searchTerm}"</p>
            </div>
          )}

          {filteredNotifications.length > perPage && (
            <Pagination
              variant={PaginationVariant.bottom}
              itemCount={filteredNotifications.length}
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

export default Notifications;