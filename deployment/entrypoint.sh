#!/bin/bash

# Function to inject environment variables into React build
inject_env_vars() {
    local env_file="/opt/visual-qontract/build/env-config.js"

    echo "Injecting runtime environment variables..."

    # Create env-config.js with runtime environment variables
    cat > "$env_file" << EOF
window._env_ = {
  REACT_APP_GRAPHQL_ENDPOINT: "${REACT_APP_GRAPHQL_ENDPOINT:-http://localhost:4000/graphql}",
  REACT_APP_DATA_DIR_URL: "${REACT_APP_DATA_DIR_URL:-https://path/to/data}",
  REACT_APP_DOCS_DIR_URL: "${REACT_APP_DOCS_DIR_URL:-https://path/to/docs}",
  REACT_APP_SCHEMAS_DIR: "${REACT_APP_SCHEMAS_DIR:-https://path/to/schemas}",
  REACT_APP_GRAFANA_URL: "${REACT_APP_GRAFANA_URL:-https://path/to/grafana}"
};
EOF

    echo "Environment variables injected successfully"
}

# Function to configure nginx
configure_nginx() {
    echo "Configuring nginx..."

    # Replace placeholders in nginx template
    sed -e "s|%AUTHORIZATION%|$AUTHORIZATION|g" \
        -e "s|%REACT_APP_GRAPHQL_ENDPOINT%|$REACT_APP_GRAPHQL_ENDPOINT|g" \
        /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

    echo "Nginx configuration complete"
}

# Main execution
echo "Starting Visual Qontract container..."

# Inject environment variables into React app
inject_env_vars

# Configure nginx with environment variables
configure_nginx

# Start nginx
echo "Starting nginx..."
exec nginx -g "daemon off;"
