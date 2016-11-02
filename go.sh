#!/bin/bash

# settaggi per test ppappsrv01
# export IP_GESTIONALE=194.242.228.82
# export IP_DBA1=194.242.228.33
# export IP_DBA2=194.242.228.33

# ATTENZIONE, PER USARE LOCALHOST DEVI VERIFICARE QUALE E'
# L'IP CORRENTE!!!
myip="$(ipconfig getifaddr en0)"
echo my ip: "${myip}"
export IP_GESTIONALE=${myip}
export IP_DBA1=${myip}
export IP_DBA2=${myip}

docker-compose build
docker-compose up


# TEST:
# curl -H "Host: data.portaportese.it" localhost
# curl -H "Host: www.portaportese.it" localhost
