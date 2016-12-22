#!/bin/bash

# settaggi per produzione
export IP_GESTIONALE=194.242.232.20
export IP_DBA1=194.242.232.21
export IP_DBA2=194.242.232.22

if [ "$1" == "test" ]; then
	# ATTENZIONE, PER USARE LOCALHOST DEVI VERIFICARE QUALE E'
	# L'IP CORRENTE!!!
	myip="$(ipconfig getifaddr en0)"
	echo my ip: "${myip}"
	export IP_GESTIONALE=${myip}
	export IP_DBA1=${myip}
	export IP_DBA2=${myip}
fi

docker-compose build
docker-compose pull
docker-compose up -d


# TEST:
# curl -H "Host: data.portaportese.it" localhost
# curl -H "Host: www.portaportese.it" localhost
