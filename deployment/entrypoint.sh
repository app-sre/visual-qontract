#!/bin/sh
set -e

# Template nginx configuration with environment variables
# Use /var/run for runtime files (owned by user 1001)
envsubst '${GRAPHQL_URI} ${AUTHORIZATION}' < /etc/nginx/nginx.conf > /var/run/nginx.conf

# Start nginx with custom config location
exec nginx -c /var/run/nginx.conf -g "daemon off;"
