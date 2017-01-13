#!/bin/bash

# settaggi per produzione
export IP_GESTIONALE=194.242.228.82
export IP_DBA1=194.242.228.33
export IP_DBA2=194.242.228.33

if [ "$1" == "test" ]; then
	# ATTENZIONE, PER USARE LOCALHOST DEVI VERIFICARE QUALE E'
	# L'IP CORRENTE!!!
	myip="$(ipconfig getifaddr en0)"
	echo my ip: "${myip}"
	export IP_GESTIONALE=${myip}
	export IP_DBA1=${myip}
	export IP_DBA2=${myip}
elif [ "$1" == "production" ]; then
        echo ATTENZIONE DB PRODUZIONE 
        export IP_GESTIONALE=194.242.232.20
        export IP_DBA1=194.242.232.21
        export IP_DBA2=194.242.232.22
fi

docker-compose build
docker-compose pull
docker-compose up -d

# TEST:
# curl -H "Host: data.portaportese.it" localhost
# curl -H "Host: wslocal.portaportese.it" localhost
# curl -H "Host: www.portaportese.it" localhost
# curl -H "Host: main.portaportese.it" localhost
