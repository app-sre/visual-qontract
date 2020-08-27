#!/bin/sh

sed -e "s|%AUTHORIZATION%|$AUTHORIZATION|;s|%GRAPHQL_URI%|$GRAPHQL_URI|" \
    -e "s|%API_AUTH%|$API_AUTH|;s|%API_URI%|$API_URI|" \
    /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

exec nginx -g "daemon off;"
