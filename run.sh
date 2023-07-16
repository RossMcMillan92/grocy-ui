#!/bin/bash
set -e

CONFIG_PATH=/data/options.json
CONNECTION_STRING="$(jq --raw-output '.connectionString' $CONFIG_PATH)"
WATCH="$(jq --raw-output '.watch' $CONFIG_PATH)"

echo Starting GrocyUI!
node -v
npm -v
npm run start

# --storageConnectionString="$CONNECTION_STRING" --watch="$WATCH"