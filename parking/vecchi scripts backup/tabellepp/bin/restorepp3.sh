echo restore di $1
pg_restore --host 127.0.0.1 --port 5432 --username pepper --dbname dba400L1 --no-password --schema public -c --ignore-version --verbose $1
