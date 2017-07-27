echo ATTENZIONE, STO PER DISTRUGGERE ENTRAMBE I DBs
read  -r -p "PREMI C PER CONTINUARE..." key
if [ "$key" = 'C' ]; then
    echo '\n RIMUOVE TUTTO'
    docker-compose down
    rm -fr Postgres/dbpp/*
    rm -fr Postgres/dba400/* 
    docker-compose up $1 --build mydba400 mydbpp 
    echo "devi lanciare 'sh scripts/restore_dba400.sh dba400_20170726-1622' quando l'init e' terminato"
else
    # Anything else pressed, do whatever else.
    echo '\nannullato!'
fi

