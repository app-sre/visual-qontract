#!/bin/bash

sed -e 's|%AUTHORIZATION%|$AUTHORIZATION|;s|%GRAPHQL_URI%|$GRAPHQL_URI|' \
    -e 's|%API_AUTH%|$API_AUTH|;s|%API_URI%|$API_URI|' \
    /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Option to remove the proxy server setup for Nginx.
# This has the side effect that API calls for creating
# Slack notifications in the app will result in frontend errors
# and is a quick way to get Visual Qontract working in
# environments without Slack access
if [[ "${API_URI}" == "disable-qontract-api" ]]; then
    sed "34,37d" /etc/nginx/nginx.conf > /tmp/nginx.conf
    cat /tmp/nginx.conf > /etc/nginx/nginx.conf
fi

exec nginx -g "daemon off;"
