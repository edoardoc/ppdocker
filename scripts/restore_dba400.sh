#pg_restore origindb.sql.bin | recode iso-8859-1..u8 | psql --dbname utf8converteddb
docker exec -i -t mydba400 su - postgres -c "pg_restore /pginput/$1 | recode iso-8859-1..u8 | psql --dbname dba400L1" 

#docker exec -i -t mydba400 su - postgres -c "pg_restore -v -d dba400L1 -Fc /pginput/$1 -U pepper | psql template1"

