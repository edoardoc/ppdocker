#!/bin/bash

if [ "$1" == "" ]; then
	# ATTENZIONE, PER USARE LOCALHOST DEVI VERIFICARE QUALE E'
	# L'IP CORRENTE!!!
	myip="$(ipconfig getifaddr en1)"
	echo my ip: "${myip}"
	export WEBFOLDER=./rmdtmsoft
	export LOGFOLDER=~/pp1logs/
	export PPFOLDER=~/ppweb
	export IP_GESTIONALE=${myip}
	export IP_DBA1=${myip}
	export IP_DBA2=${myip}
	# telnet $IP_DBA1 5432
elif [ "$1" == "testdbremoto" ]; then
	export WEBFOLDER=./rmdtmsoft
	export LOGFOLDER=~/pp1logs/
	export PPFOLDER=/home/ppweb
	export IP_GESTIONALE=194.242.228.82
	export IP_DBA1=194.242.228.33
	export IP_DBA2=194.242.228.33
elif [ "$1" == "production" ]; then
	echo ATTENZIONE DB PRODUZIONE 
	export WEBFOLDER=./rmdtmsoft
	export LOGFOLDER=/home/pp1logs/
	export PPFOLDER=/home/ppweb
	export IP_GESTIONALE=194.242.232.20
	export IP_DBA1=194.242.232.21
	export IP_DBA2=194.242.232.22
else
	echo uno tra: void \| test \| testdbremoto \| production
	exit 1
fi

mkdir ${LOGFOLDER}httpd
mkdir ${LOGFOLDER}httpd/logs

# fermo tutto e cancello tutto
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)

docker-compose build
docker-compose pull
docker-compose down
docker-compose pull
docker-compose build

rm ${PPFOLDER}/WEB-INF/init/initdata.sbin

rm ${PPFOLDER}/WEB-INF/init/initdata.sbin

# per far partire anche il www fai semplicemente 
# docker-compose up -d
docker-compose up 

# TEST:
# curl -H "Host: data.portaportese.it" localhost
# curl -H "Host: datalocal.portaportese.it" localhost
# curl -H "Host: www.portaportese.it" localhost
# curl -H "Host: wwwlocal.portaportese.it" localhost
