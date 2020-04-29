#!/bin/bash
set -a
source .env

docker stop $(docker ps -aq)
docker rm $(docker ps -aq)

docker-compose pull
docker-compose build

docker-compose up 
#-d

# TEST:
# curl -H "Host: data.portaportese.it" localhost
# curl -H "Host: datalocal.portaportese.it" localhost
# curl -H "Host: www.portaportese.it" localhost
# curl -H "Host: wwwlocal.portaportese.it" localhost
