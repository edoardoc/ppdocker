#!/bin/bash

if [ "$1" == "" ]; then
	# ATTENZIONE, PER USARE LOCALHOST DEVI VERIFICARE QUALE E'
	# L'IP CORRENTE!!!
	myip="$(ipconfig getifaddr en0)"
	if [ ${#myip} == 0 ]; then
			myip="$(ipconfig getifaddr en1)"
	fi
	echo my ip: "${myip}"
	export WEBFOLDER=./rmdtmsoft
	export IP_GESTIONALE=${myip}
	export IP_DBA1=${myip}
	export IP_DBA2=${myip}
elif [ "$1" == "testdbremoto" ]; then
	export WEBFOLDER=/home/rmdtmsoft
	export IP_GESTIONALE=194.242.228.82
	export IP_DBA1=194.242.228.33
	export IP_DBA2=194.242.228.33
elif [ "$1" == "production" ]; then
	echo ATTENZIONE DB PRODUZIONE 
	export WEBFOLDER=/home/rmdtmsoft
	export IP_GESTIONALE=194.242.232.20
	export IP_DBA1=194.242.232.21
	export IP_DBA2=194.242.232.22
else
	echo uno tra: void \| test \| testdbremoto \| production
	exit 1
fi

docker-compose build
docker-compose pull
docker-compose down

# per far partire anche il www fai semplicemente 
# docker-compose up -d
docker-compose up 

# TEST:
# curl -H "Host: data.portaportese.it" localhost
# curl -H "Host: datalocal.portaportese.it" localhost
# curl -H "Host: www.portaportese.it" localhost
# curl -H "Host: wwwlocal.portaportese.it" localhost
