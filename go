#!/bin/bash

set -a
source .env

mkdir -p ${WEBFOLDER}
mkdir -p ${LOGFOLDER}
mkdir -p ${PPFOLDER}

# fermo tutto e cancello tutto
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)

docker-compose pull
docker-compose build

docker-compose -f docker-compose.yml -f docker-compose"$1".yml up -d

# TEST:
# curl -H "Host: data.portaportese.it" localhost
# curl -H "Host: datalocal.portaportese.it" localhost
# curl -H "Host: www.portaportese.it" localhost
# curl -H "Host: wwwlocal.portaportese.it" localhost
