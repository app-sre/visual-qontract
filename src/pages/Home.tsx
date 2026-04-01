import React from 'react';
import { Card, CardTitle, CardBody, Title, Grid, GridItem, List, ListItem, Button } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  
  const externalLinks = [
    {
      name: 'Data',
      url: process.env.REACT_APP_DATA_DIR_URL || 'https://path/to/data',
      description: 'Browse application interface data'
    },
    {
      name: 'Docs',
      url: process.env.REACT_APP_DOCS_DIR_URL || 'https://path/to/docs',
      description: 'Documentation and guides'
    },
    {
      name: 'Schemas',
      url: process.env.REACT_APP_SCHEMAS_DIR || 'https://path/to/schemas',
      description: 'Qontract schema definitions'
    },
    {
      name: 'Grafana',
      url: process.env.REACT_APP_GRAFANA_URL || 'https://path/to/grafana',
      description: 'Monitoring dashboards'
    }
  ];

  return (
    <div>
      <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
        Welcome to Visual App-Interface
      </Title>
      
      <p style={{ marginBottom: '2rem' }}>
        Manage your applications, services, clusters, and namespaces from a unified interface.
      </p>


      <Title headingLevel="h2" size="lg" style={{ marginBottom: '1rem' }}>
        Quick Links
      </Title>
      
      <List style={{ marginBottom: '3rem' }}>
        {externalLinks.map((link) => (
          <ListItem key={link.name}>
            <Button
              variant="link"
              component="a"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              icon={<ExternalLinkAltIcon />}
              iconPosition="right"
              style={{ padding: '0.5rem 0' }}
            >
              {link.name}
            </Button>
            <span style={{ marginLeft: '1rem', color: 'var(--pf-v6-global--Color--200)' }}>
              {link.description}
            </span>
          </ListItem>
        ))}
      </List>

      <Title headingLevel="h2" size="lg" style={{ marginBottom: '1rem' }}>
        Navigation
      </Title>

      <Grid hasGutter>
        <GridItem span={4}>
          <Card>
            <CardTitle>
              <Link to="/services" style={{ textDecoration: 'none', color: 'inherit' }}>
                Services
              </Link>
            </CardTitle>
            <CardBody>
              View and manage your application services
            </CardBody>
          </Card>
        </GridItem>

        <GridItem span={4}>
          <Card>
            <CardTitle>
              <Link to="/clusters" style={{ textDecoration: 'none', color: 'inherit' }}>
                Clusters
              </Link>
            </CardTitle>
            <CardBody>
              Monitor and configure your clusters
            </CardBody>
          </Card>
        </GridItem>

        <GridItem span={4}>
          <Card>
            <CardTitle>
              <Link to="/namespaces" style={{ textDecoration: 'none', color: 'inherit' }}>
                Namespaces
              </Link>
            </CardTitle>
            <CardBody>
              Organize resources with namespaces
            </CardBody>
          </Card>
        </GridItem>

        <GridItem span={4}>
          <Card>
            <CardTitle>
              <Link to="/roles" style={{ textDecoration: 'none', color: 'inherit' }}>
                Roles
              </Link>
            </CardTitle>
            <CardBody>
              Manage user roles and permissions
            </CardBody>
          </Card>
        </GridItem>

        <GridItem span={4}>
          <Card>
            <CardTitle>
              <Link to="/users" style={{ textDecoration: 'none', color: 'inherit' }}>
                Users
              </Link>
            </CardTitle>
            <CardBody>
              View user accounts and profiles
            </CardBody>
          </Card>
        </GridItem>

        <GridItem span={4}>
          <Card>
            <CardTitle>
              <Link to="/permissions" style={{ textDecoration: 'none', color: 'inherit' }}>
                Permissions
              </Link>
            </CardTitle>
            <CardBody>
              Browse system permissions and access controls
            </CardBody>
          </Card>
        </GridItem>

        <GridItem span={4}>
          <Card>
            <CardTitle>
              <Link to="/aws-accounts" style={{ textDecoration: 'none', color: 'inherit' }}>
                AWS Accounts
              </Link>
            </CardTitle>
            <CardBody>
              Manage AWS account configurations
            </CardBody>
          </Card>
        </GridItem>

        <GridItem span={4}>
          <Card>
            <CardTitle>
              <Link to="/aws-groups" style={{ textDecoration: 'none', color: 'inherit' }}>
                AWS Groups
              </Link>
            </CardTitle>
            <CardBody>
              Manage AWS groups and policies
            </CardBody>
          </Card>
        </GridItem>

        <GridItem span={4}>
          <Card>
            <CardTitle>
              <Link to="/integrations" style={{ textDecoration: 'none', color: 'inherit' }}>
                Integrations
              </Link>
            </CardTitle>
            <CardBody>
              Manage system integrations and upstream connections
            </CardBody>
          </Card>
        </GridItem>

        <GridItem span={4}>
          <Card>
            <CardTitle>
              <Link to="/github-orgs" style={{ textDecoration: 'none', color: 'inherit' }}>
                GitHub Organizations
              </Link>
            </CardTitle>
            <CardBody>
              Manage GitHub organization configurations
            </CardBody>
          </Card>
        </GridItem>

        <GridItem span={4}>
          <Card>
            <CardTitle>
              <Link to="/quay-orgs" style={{ textDecoration: 'none', color: 'inherit' }}>
                Quay Organizations
              </Link>
            </CardTitle>
            <CardBody>
              Manage Quay organization configurations
            </CardBody>
          </Card>
        </GridItem>

        <GridItem span={4}>
          <Card>
            <CardTitle>
              <Link to="/jenkins-instances" style={{ textDecoration: 'none', color: 'inherit' }}>
                Jenkins Instances
              </Link>
            </CardTitle>
            <CardBody>
              Manage Jenkins server instances and configurations
            </CardBody>
          </Card>
        </GridItem>

        <GridItem span={4}>
          <Card>
            <CardTitle>
              <Link to="/dependencies" style={{ textDecoration: 'none', color: 'inherit' }}>
                Dependencies
              </Link>
            </CardTitle>
            <CardBody>
              Manage system dependencies and external service configurations
            </CardBody>
          </Card>
        </GridItem>

        <GridItem span={4}>
          <Card>
            <CardTitle>
              <Link to="/notifications" style={{ textDecoration: 'none', color: 'inherit' }}>
                Notifications
              </Link>
            </CardTitle>
            <CardBody>
              Manage email notifications and recipient configurations
            </CardBody>
          </Card>
        </GridItem>

        <GridItem span={4}>
          <Card>
            <CardTitle>
              <Link to="/scorecards" style={{ textDecoration: 'none', color: 'inherit' }}>
                Score Cards
              </Link>
            </CardTitle>
            <CardBody>
              Manage application score cards and acceptance criteria
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </div>
  );
};

export default Home;