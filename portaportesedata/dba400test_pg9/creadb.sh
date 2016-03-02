gosu postgres postgres --single <<- EOSQL
    CREATE USER pepper with password 'dbPasswordExample' SUPERUSER;
    CREATE DATABASE dba400;
    GRANT ALL PRIVILEGES ON DATABASE dba400 TO pepper;
EOSQL
