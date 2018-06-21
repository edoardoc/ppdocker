#!/bin/bash

mkdir ${LOGFOLDER}httpd
mkdir ${LOGFOLDER}httpd/logs

# fermo tutto e cancello tutto
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)

docker-compose build
docker-compose pull
docker-compose down

rm ~/ppweb/WEB-INF/init/initdata.sbin

# per far partire anche il www fai semplicemente 
# docker-compose up -d
docker-compose up -d

# TEST:
# curl -H "Host: data.portaportese.it" localhost
# curl -H "Host: datalocal.portaportese.it" localhost
# curl -H "Host: www.portaportese.it" localhost
# curl -H "Host: wwwlocal.portaportese.it" localhost
