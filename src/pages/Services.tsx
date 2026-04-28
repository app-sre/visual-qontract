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
  Label,
  Pagination,
  PaginationVariant,
  Button,
  FormSelect,
  FormSelectOption
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td
} from '@patternfly/react-table';
import { useFilteredPagination } from '../hooks/useFilteredPagination';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

const GET_SERVICES = gql`
  query Apps {
    apps_v1 {
      path
      name
      description
      onboardingStatus
      parentApp {
        name
        path
      }
      serviceOwners {
        name
      }
    }
  }
`;

interface Service {
  path: string;
  name: string;
  description: string;
  onboardingStatus: string;
  parentApp?: {
    name: string;
    path: string;
  };
  serviceOwners: Array<{
    name: string;
  }>;
}

interface AppsQueryData {
  apps_v1: Service[];
}

const collectServiceOwnerNames = (services: Service[]): string[] => {
  const seen = new Map<string, string>();
  services.forEach(service =>
    (service.serviceOwners || []).forEach(owner => {
      if (owner?.name) {
        const key = owner.name.toLowerCase();
        if (!seen.has(key)) {
          seen.set(key, owner.name);
        }
      }
    })
  );
  return Array.from(seen.values()).sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase())
  );
};

const Services: React.FC = () => {
  const { loading, error, data } = useQuery<AppsQueryData>(GET_SERVICES);
  const [selectedOwner, setSelectedOwner] = useState<string>('');

  const getStatusLabelColor = (status: string) => {
    switch (status) {
      case 'Onboarded':
        return 'green';
      case 'InProgress':
        return 'yellow';
      case 'Proposed':
        return 'grey';
      case 'BestEffort':
        return 'teal';
      case 'TransitionPeriod':
        return 'red';
      default:
        return 'grey';
    }
  };

  const ownerNames = useMemo(
    () => collectServiceOwnerNames(data?.apps_v1 || []),
    [data]
  );

  // First filter by owner, then by search term
  const ownerFilteredServices = useMemo(() => {
    if (!selectedOwner) return data?.apps_v1 || [];
    return (data?.apps_v1 || []).filter(service =>
      (service.serviceOwners || []).some(
        owner => owner?.name && owner.name.toLowerCase() === selectedOwner.toLowerCase()
      )
    );
  }, [data, selectedOwner]);

  const {
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    perPage,
    filteredItems: filteredServices,
    paginatedItems: paginatedServices,
    onSetPage,
    onPerPageSelect,
  } = useFilteredPagination({
    items: ownerFilteredServices,
    filterFn: (service, term) =>
      service.name.toLowerCase().includes(term.toLowerCase()) ||
      (service.description?.toLowerCase().includes(term.toLowerCase()) ?? false) ||
      (service.parentApp?.name.toLowerCase().includes(term.toLowerCase()) ?? false),
  });

  if (loading) {
    return (
      <div>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
          Services
        </Title>
        <LoadingState message="Loading services..." />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
          Services
        </Title>
        <ErrorState title="Error loading services" error={error} />
      </div>
    );
  }

  return (
    <div>
      <Title headingLevel="h1" size="2xl" style={{ marginBottom: '2rem' }}>
        Services
      </Title>
      
      <Card>
        <CardBody>
          <Toolbar>
            <ToolbarContent>
              <ToolbarItem>
                <FormSelect
                  id="service-owner-select"
                  value={selectedOwner}
                  onChange={(_event, value) => {
                    setSelectedOwner(value as string);
                    setPage(1); // Reset to first page when changing filter
                  }}
                  aria-label="Filter services by owner"
                >
                  <FormSelectOption value="" label="All service owners" />
                  {ownerNames.map(name => (
                    <FormSelectOption key={name} value={name} label={name} />
                  ))}
                </FormSelect>
              </ToolbarItem>
              <ToolbarItem>
                <TextInput
                  name="search"
                  id="search"
                  type="search"
                  aria-label="Search services"
                  placeholder="Search by service name, description, or parent app..."
                  value={searchTerm}
                  onChange={(_event, value) => {
                    setSearchTerm(value);
                    setPage(1); // Reset to first page when searching
                  }}
                />
              </ToolbarItem>
              <ToolbarItem align={{ default: 'alignEnd' }}>
                <span style={{ color: 'var(--pf-v6-global--Color--200)' }}>
                  {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found
                </span>
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>

          <Table aria-label="Services table">
            <Thead>
              <Tr>
                <Th>Service Name</Th>
                <Th>Onboarding Status</Th>
                <Th>Parent App</Th>
                <Th>Service Owners</Th>
                <Th>Description</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedServices.map((service: Service) => (
                <Tr key={service.path}>
                  <Td dataLabel="Service Name">
                    <Link 
                      to={`/service/${encodeURIComponent(service.path)}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Button
                        variant="link"
                        style={{ padding: 0, fontSize: 'inherit', fontWeight: 'bold' }}
                      >
                        {service.name}
                      </Button>
                    </Link>
                  </Td>
                  <Td dataLabel="Onboarding Status">
                    <Label color={getStatusLabelColor(service.onboardingStatus)}>
                      {service.onboardingStatus}
                    </Label>
                  </Td>
                  <Td dataLabel="Parent App">
                    {service.parentApp ? (
                      <Link
                        to={`/service/${encodeURIComponent(service.parentApp.path)}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <Button
                          variant="link"
                          style={{ padding: 0, fontSize: 'inherit' }}
                        >
                          {service.parentApp.name}
                        </Button>
                      </Link>
                    ) : (
                      '-'
                    )}
                  </Td>
                  <Td dataLabel="Service Owners">
                    {service.serviceOwners.length > 0 
                      ? service.serviceOwners.map(owner => owner.name).join(', ')
                      : '-'
                    }
                  </Td>
                  <Td dataLabel="Description">
                    {service.description || '-'}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {filteredServices.length === 0 && searchTerm && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>No services found matching "{searchTerm}"</p>
            </div>
          )}

          {filteredServices.length > perPage && (
            <Pagination
              variant={PaginationVariant.bottom}
              itemCount={filteredServices.length}
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

export default Services;