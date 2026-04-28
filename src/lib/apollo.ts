import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { getGraphQLEndpoint } from '../utils/env';

// Get GraphQL endpoint from runtime environment configuration
const GRAPHQL_ENDPOINT = getGraphQLEndpoint();

// Create HTTP link for GraphQL endpoint
const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT,
});

// Create Apollo Client instance
export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

// Export the GraphQL endpoint for debugging/logging
export { GRAPHQL_ENDPOINT };
