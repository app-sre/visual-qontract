import React from 'react';
import { Title, Alert, Spinner, Card, CardTitle, CardBody, DescriptionList, DescriptionListGroup, DescriptionListTerm, DescriptionListDescription } from '@patternfly/react-core';
import { CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import { useGraphQLConnection } from '../hooks/useGraphQLConnection';
import { ENV } from '../utils/env';

const Status: React.FC = () => {
  const { isConnected, isLoading, error } = useGraphQLConnection();
  
  return (
    <div>
      <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
        System Status
      </Title>
      
      <p style={{ marginBottom: '2rem' }}>
        Monitor the health and connectivity of backend services.
      </p>

      <Card>
        <CardTitle>GraphQL Backend Connection</CardTitle>
        <CardBody>
          {isLoading ? (
            <Alert variant="info" title="Connecting to GraphQL server...">
              <Spinner size="sm" /> Checking connection status...
            </Alert>
          ) : isConnected ? (
            <div>
              <Alert variant="success" title="Connected to GraphQL server">
                <CheckCircleIcon /> Successfully connected to the GraphQL backend.
              </Alert>
              <DescriptionList style={{ marginTop: '1rem' }}>
                <DescriptionListGroup>
                  <DescriptionListTerm>Endpoint</DescriptionListTerm>
                  <DescriptionListDescription>
                    {ENV.GRAPHQL_ENDPOINT}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Status</DescriptionListTerm>
                  <DescriptionListDescription>Connected</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Last Check</DescriptionListTerm>
                  <DescriptionListDescription>{new Date().toLocaleString()}</DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </div>
          ) : (
            <div>
              <Alert variant="danger" title="Failed to connect to GraphQL server">
                <ExclamationCircleIcon /> Unable to establish connection to the GraphQL backend.
                {error && <div style={{ marginTop: '0.5rem' }}>Error: {error}</div>}
              </Alert>
              <DescriptionList style={{ marginTop: '1rem' }}>
                <DescriptionListGroup>
                  <DescriptionListTerm>Endpoint</DescriptionListTerm>
                  <DescriptionListDescription>
                    {ENV.GRAPHQL_ENDPOINT}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Status</DescriptionListTerm>
                  <DescriptionListDescription>Disconnected</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Last Check</DescriptionListTerm>
                  <DescriptionListDescription>{new Date().toLocaleString()}</DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Status;