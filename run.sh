#!/bin/bash
#-------------------------------
export WHICH_COMMIT=1f1d75306094

if [ "$1" == "" ]; then
	echo "devi specificare anche il servizio che vuoi lanciare!"
	exit 1
fi

if [ "$1" == "local" ]; then
	# ATTENZIONE, PER USARE LOCALHOST DEVI VERIFICARE QUALE E'
	# L'IP CORRENTE!!!
	myip="$(ipconfig getifaddr en1)"
	echo my ip: "127.0.0.1"
	export WEBFOLDER=./rmdtmsoft
	export LOGFOLDER=~/pp1logs/
	export IP_GESTIONALE=127.0.0.1
	export IP_DBA1=127.0.0.1
	export IP_DBA2=127.0.0.1
	#telnet $IP_DBA1 5432
elif [ "$1" == "testdbremoto" ]; then
	export WEBFOLDER=./rmdtmsoft
	export LOGFOLDER=~/pp1logs/
	export IP_GESTIONALE=188.166.194.166
	export IP_DBA1=188.166.194.166
	export IP_DBA2=188.166.194.166
elif [ "$1" == "production" ]; then
	echo ATTENZIONE DB PRODUZIONE 
	export WEBFOLDER=./rmdtmsoft
	export LOGFOLDER=/home/pp1logs/
	export IP_GESTIONALE=194.242.232.20
	export IP_DBA1=194.242.232.21
	export IP_DBA2=194.242.232.22
else
	echo uno tra: local \| testdbremoto \| production
	exit 1
fi

mkdir ${LOGFOLDER}httpd/logs
mkdir ${LOGFOLDER}httpd
mkdir ${LOGFOLDER}utilities
mkdir ${LOGFOLDER}utilities/gmmvclogs

wget -nc --user=ridleys@gmail.com --password=KQk-uPF-AL8-MVq https://bitbucket.org/eddyce/pputilities/get/${WHICH_COMMIT}.zip -P utilities/

echo build phase
# fermo tutto e cancello tutto
docker-compose build --build-arg WHICH_COMMIT=${WHICH_COMMIT} $2

echo run phase
TODAY=`date +%Y%m%d-%H%M`
docker-compose run $2 sh mediavacanze.sh dbpp ./pp.json  2>&1 | tee ${LOGFOLDER}utilities/gmmvclogs/$2-${TODAY}.log
