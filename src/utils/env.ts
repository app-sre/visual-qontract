/**
 * Runtime environment configuration utility
 *
 * This utility provides access to environment variables that can be set at runtime
 * rather than build time. This is essential for containerized deployments where
 * the same image needs to work across different environments.
 */

// Extend the Window interface to include our environment configuration
declare global {
  interface Window {
    _env_?: {
      REACT_APP_GRAPHQL_ENDPOINT?: string;
      REACT_APP_DATA_DIR_URL?: string;
      REACT_APP_DOCS_DIR_URL?: string;
      REACT_APP_SCHEMAS_DIR?: string;
      REACT_APP_GRAFANA_URL?: string;
    };
  }
}

/**
 * Get environment variable value with fallback support
 *
 * Priority order:
 * 1. Runtime environment (window._env_) - injected by container at startup
 * 2. Build-time environment (process.env) - set during build
 * 3. Default fallback value
 */
export function getEnvVar(key: string, defaultValue: string): string {
  // Try runtime environment first (injected by container)
  if (typeof window !== 'undefined' && window._env_) {
    const runtimeValue = window._env_[key as keyof typeof window._env_];
    if (runtimeValue) {
      return runtimeValue;
    }
  }

  // Fall back to build-time environment
  const buildTimeValue = process.env[key];
  if (buildTimeValue) {
    return buildTimeValue;
  }

  // Use default value
  return defaultValue;
}

// Pre-configured environment variables with defaults
export const ENV = {
  GRAPHQL_ENDPOINT: getEnvVar('REACT_APP_GRAPHQL_ENDPOINT', 'http://localhost:4000/graphql'),
  DATA_DIR_URL: getEnvVar('REACT_APP_DATA_DIR_URL', 'https://path/to/data'),
  DOCS_DIR_URL: getEnvVar('REACT_APP_DOCS_DIR_URL', 'https://path/to/docs'),
  SCHEMAS_DIR: getEnvVar('REACT_APP_SCHEMAS_DIR', 'https://path/to/schemas'),
  GRAFANA_URL: getEnvVar('REACT_APP_GRAFANA_URL', 'https://path/to/grafana'),
} as const;

// Export individual getters for convenience
export const getGraphQLEndpoint = () => ENV.GRAPHQL_ENDPOINT;
export const getDataDirUrl = () => ENV.DATA_DIR_URL;
export const getDocsDirUrl = () => ENV.DOCS_DIR_URL;
export const getSchemasDir = () => ENV.SCHEMAS_DIR;
export const getGrafanaUrl = () => ENV.GRAFANA_URL;
