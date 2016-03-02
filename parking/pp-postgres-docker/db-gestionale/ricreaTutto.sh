# per creare il volume dati 
docker rm pgdata && docker create -v /pg/data --name pgdata portaportese/pp-db-gestionale /bin/true

# per creare l'immagine pg
docker build -t portaportese/pp-db-gestionale .

# questo lancia pg con il volume (LA PRIMA VOLTA)
docker run -d --volumes-from pgdata --name pp9.prv.lan -i -t -p 5432:5432 -e POSTGRES_PASSWORD=password portaportese/pp-db-gestionale 

# docker run --volumes-from pgdata -i -t -p 5432:5432 -e POSTGRES_PASSWORD=password portaportese/pp-db-gestionale

# cd ~/backups/tabellepp && pg_restore minippdump | recode iso-8859-1..u8 | psql --host 192.168.59.103 --port 5432 --username pepper --dbname portaportese && cd -

# questo serve per archiviare il disco 
# docker run --volumes-from pgdata -v $(pwd):/backup postgres tar cvf /backup/pgdata.tar /pg

