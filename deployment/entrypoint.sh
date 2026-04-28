#!/bin/sh
set -e

# Template nginx configuration with environment variables
envsubst '${GRAPHQL_URI} ${AUTHORIZATION}' < /etc/nginx/nginx.conf > /tmp/nginx.conf
mv /tmp/nginx.conf /etc/nginx/nginx.conf

# Start nginx
exec nginx -g "daemon off;"
