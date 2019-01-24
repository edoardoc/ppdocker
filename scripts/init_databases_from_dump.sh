echo ATTENZIONE, STO PER DISTRUGGERE ENTRAMBE I DBs
read  -r -p "PREMI C PER CONTINUARE..." key
if [ "$key" = 'C' ]; then
    echo '\n RIMUOVE TUTTO'
    docker stop $(docker ps -aq)
    docker rm $(docker ps -aq)
    docker-compose down
    rm -fr /mnt/volume-fra1-01/dbpp
    rm -fr /mnt/volume-fra1-01/dba400 
    mkdir -p /mnt/volume-fra1-01/dba400
    mkdir -p /mnt/volume-fra1-01/dbpp
    docker-compose -f docker-compose.yml -f docker-compose.testing.yml up -d --build mydba400 mydbpp 
    echo "devi lanciare 'sh scripts/restore_dba400.sh dba400_20170726-1622' quando l'init e' terminato"
else
    # Anything else pressed, do whatever else.
    echo '\nannullato!'
fi

