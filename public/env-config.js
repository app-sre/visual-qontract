// Default environment configuration for development
// This file will be overwritten by the container entrypoint script in production
window._env_ = {
  REACT_APP_GRAPHQL_ENDPOINT: "http://localhost:4000/graphql",
  REACT_APP_DATA_DIR_URL: "https://path/to/data",
  REACT_APP_DOCS_DIR_URL: "https://path/to/docs",
  REACT_APP_SCHEMAS_DIR: "https://path/to/schemas",
  REACT_APP_GRAFANA_URL: "https://path/to/grafana"
};
