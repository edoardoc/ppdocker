docker exec -i -t mydbpp su - postgres -c "pg_restore /pginput/$1 | recode iso-8859-1..u8 | psql --dbname portaportese"
