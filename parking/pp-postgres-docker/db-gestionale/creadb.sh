gosu postgres postgres --single <<- EOSQL
    CREATE USER pepper with password 'dbPasswordExample' SUPERUSER;
    CREATE DATABASE portaportese;
    GRANT ALL PRIVILEGES ON DATABASE portaportese TO pepper;
EOSQL
