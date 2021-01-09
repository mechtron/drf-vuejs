#!/bin/sh

echo -e "{\"API_HOSTNAME\": \"$API_HOSTNAME\"}" > /usr/share/nginx/html/config.json
nginx -g "daemon off;"
