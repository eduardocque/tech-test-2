#!/usr/bin/env bash

NPM_TOKEN=$(grep 'npmAuthToken:' ~/.yarnrc.yml | awk '{print $2}' | tr -d '"')

if [ -z "$NPM_TOKEN" ]; then
  echo "Token not found NPM_TOKEN from ~/.yarnrc.yml"
  exit 1
fi

export NPM_TOKEN

# Let's lock'n'load
if [ "$1" == "build" ]; then
    docker-compose --file docker-compose-dev.yml --project-name test-server build $2
elif [ "$1" == "detatch" ]; then
    docker-compose --file docker-compose-dev.yml --project-name test-server --compatibility up $2 -d
else
    docker-compose --file docker-compose-dev.yml --project-name test-server --compatibility up $1 #-d
fi

unset NPM_TOKEN
