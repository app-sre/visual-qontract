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
  Alert,
  Button,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Breadcrumb,
  BreadcrumbItem
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { getDataDirUrl } from '../utils/env';

const GET_AWSACCOUNT = gql`
  query AWSAccount($path: String) {
    awsaccounts_v1(path: $path) {
      path
      name
      description
      consoleUrl
    }
  }
`;

interface AWSAccountData {
  awsaccounts_v1: Array<{
    path: string;
    name: string;
    description?: string;
    consoleUrl?: string;
  }>;
}

const AWSAccount: React.FC = () => {
  const { path } = useParams<{ path: string }>();
  const decodedPath = path ? decodeURIComponent(path) : '';

  const { loading, error, data } = useQuery<AWSAccountData>(GET_AWSACCOUNT, {
    variables: { path: decodedPath },
    skip: !decodedPath
  });

  if (loading) {
    return <LoadingState message="Loading AWS account details..." />;
  }

  if (error) {
    return (
      <div>
        <Breadcrumb>
          <BreadcrumbItem component={Link} to="/aws-accounts">
            AWS Accounts
          </BreadcrumbItem>
          <BreadcrumbItem>AWS Account Details</BreadcrumbItem>
        </Breadcrumb>
        <ErrorState title="Error loading AWS account" error={error} />
      </div>
    );
  }

  if (!data?.awsaccounts_v1?.length) {
    return (
      <div>
        <Breadcrumb>
          <BreadcrumbItem component={Link} to="/aws-accounts">
            AWS Accounts
          </BreadcrumbItem>
          <BreadcrumbItem>AWS Account Details</BreadcrumbItem>
        </Breadcrumb>
        <Alert variant="warning" title="AWS Account not found">
          No AWS account found for path: {decodedPath}
        </Alert>
      </div>
    );
  }

  const account = data.awsaccounts_v1[0];

  return (
    <div>
      <Breadcrumb style={{ marginBottom: '1rem' }}>
        <BreadcrumbItem component={Link} to="/aws-accounts">
          AWS Accounts
        </BreadcrumbItem>
        <BreadcrumbItem>{account.name}</BreadcrumbItem>
      </Breadcrumb>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <Link to="/aws-accounts" style={{ textDecoration: 'none', marginRight: '1rem' }}>
          <Button
            variant="link"
            style={{ padding: 0, fontSize: 'inherit' }}
          >
            ← Back to AWS Accounts
          </Button>
        </Link>
        <Title headingLevel="h1" size="2xl">
          {account.name}
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
                <DescriptionListDescription>{account.name}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Path</DescriptionListTerm>
                <DescriptionListDescription>
                  <Button
                    variant="link"
                    component="a"
                    href={`${getDataDirUrl()}${account.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    icon={<ExternalLinkAltIcon />}
                    iconPosition="right"
                    style={{ padding: 0, fontSize: 'inherit' }}
                  >
                    {account.path}
                  </Button>
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Description</DescriptionListTerm>
                <DescriptionListDescription>{account.description || '-'}</DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </CardBody>
        </Card>

        {/* External Links */}
        {account.consoleUrl && (
          <Card>
            <CardTitle>External Links</CardTitle>
            <CardBody>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Button
                  variant="secondary"
                  component="a"
                  href={account.consoleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  icon={<ExternalLinkAltIcon />}
                  iconPosition="right"
                >
                  AWS Console
                </Button>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AWSAccount;