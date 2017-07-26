docker exec -i -t pp24.prv.lan su - postgres -c "pg_restore -v -d dba400L1 -Fc /pginput/dba400dump_20161231-1127 -U pepper | psql template1"
