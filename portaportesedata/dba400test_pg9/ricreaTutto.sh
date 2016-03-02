# per creare il volume dati 
docker rm pga400data && docker create -v /pg/data --name pga400data postgres /bin/true

# per creare l'immagine pg
docker build -t portaportese/pp-dba400 .

# questo lancia pg con il volume
docker run -d --volumes-from pga400data --name pp11.prv.lan -i -t -p 5434:5432 -e POSTGRES_PASSWORD=password portaportese/pp-dba400 

# docker run --volumes-from pga400data -i -t -p 5434:5432 -e POSTGRES_PASSWORD=password portaportese/pp-dba400


#cd ~/backups/tabellepp && pg_restore minibackupdba | recode iso-8859-1..u8 | psql --host 192.168.59.103 --port 5434 --username pepper --dbname dba400 && cd -


# questo serve per archiviare il disco 
# docker run --volumes-from pga400data -v $(pwd):/backup postgres tar cvf /backup/pga400data.tar /pg
