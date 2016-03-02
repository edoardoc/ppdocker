echo restore di $1
export PGPASSWORD=dbPasswordExample
pg_restore --host 192.168.59.103 --port 5432 --username pepper --dbname portaportese --no-password --schema public -c --ignore-version --verbose $1
