gosu postgres postgres --single <<- EOSQL
    CREATE USER pepper with password 'dbPasswordExampleLong' SUPERUSER;
    CREATE DATABASE portaportese;
    GRANT ALL PRIVILEGES ON DATABASE portaportese TO pepper;
EOSQL
