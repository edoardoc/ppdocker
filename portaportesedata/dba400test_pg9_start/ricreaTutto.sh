# per creare l'immagine pg
docker build -t portaportese/dba400 .

# questo lancia pg con il volume
docker stop pp24.prv.lan
docker rm pp24.prv.lan 

# ATTENZIONE !!!
rm -rf /home/dba400/*

docker run -d -v /home/postgresdumps:/pginput -v /home/dba400:/pg/data --name pp24.prv.lan -i -t -p 5432:5432 -e POSTGRES_PASSWORD=password portaportese/dba400 

# cmd da lanciare da altra shell
#docker exec -i -t pp24.prv.lan su - postgres -c "pg_restore -v -d dba400L1 -Fc /pginput/dba400dump_20161231-1127 -U pepper | psql template1"

#cd ~/backups/tabellepp && pg_restore minibackupdba | recode iso-8859-1..u8 | psql --host 192.168.59.103 --port 5434 --username pepper --dbname dba400 && cd -

