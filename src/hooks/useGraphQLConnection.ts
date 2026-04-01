import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';

// Simple introspection query to test GraphQL connection
const INTROSPECTION_QUERY = gql`
  query IntrospectionQuery {
    __schema {
      queryType {
        name
      }
    }
  }
`;

export const useGraphQLConnection = () => {
  const { data, loading, error } = useQuery(INTROSPECTION_QUERY, {
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  return {
    isConnected: !!data && !error,
    isLoading: loading,
    error: error?.message || null,
    data,
  };
};