#!/bin/bash

export WEBFOLDER=./rmdtmsoft
docker-compose down
docker-compose build
docker-compose pull

# per far partire anche il www fai semplicemente 
# docker-compose up -d
docker-compose up $1

# TEST:
# curl -H "Host: data.portaportese.it" localhost
# curl -H "Host: datalocal.portaportese.it" localhost
# curl -H "Host: www.portaportese.it" localhost
# curl -H "Host: wwwlocal.portaportese.it" localhost
