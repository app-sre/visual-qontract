#!/bin/sh

sed "s|%AUTHORIZATION%|$AUTHORIZATION|;s|%GRAPHQL_URI%|$GRAPHQL_URI|" \
    /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

exec nginx -g "daemon off;"
