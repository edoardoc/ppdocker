docker exec -t mydba400 su - postgres -c "pg_restore /pginput/$1 | recode iso-8859-1..u8 | psql --dbname dba400L1" > /dev/null 2>&1 & 
