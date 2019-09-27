#!/bin/bash

# TODO: DEVI AGGIORNARE LE CARTELLE

if [ "$1" == "" ]; then
	echo "devi specificare anche il servizio che vuoi ricompilare e reinit!"
	exit 1
fi

if [ "$1" == "" ]; then
	# ATTENZIONE, PER USARE LOCALHOST DEVI VERIFICARE QUALE E'
	# L'IP CORRENTE!!!
	myip="$(ipconfig getifaddr en1)"
	echo my ip: "${myip}"
	export WEBFOLDER=./rmdtmsoft
	export LOGFOLDER=~/pp1logs/
	export IP_GESTIONALE=${myip}
	export IP_DBA1=${myip}
	export IP_DBA2=${myip}
	#telnet $IP_DBA1 5432
elif [ "$1" == "testdbremoto" ]; then
	export WEBFOLDER=./rmdtmsoft
	export LOGFOLDER=~/pp1logs/
	export IP_GESTIONALE=194.242.228.82
	export IP_DBA1=194.242.228.33
	export IP_DBA2=194.242.228.33
elif [ "$1" == "production" ]; then
	echo ATTENZIONE DB PRODUZIONE 
	export WEBFOLDER=./rmdtmsoft
	export LOGFOLDER=/home/pp1logs/
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
docker-compose build $2
docker-compose stop $2

docker-compose up $3 $2
