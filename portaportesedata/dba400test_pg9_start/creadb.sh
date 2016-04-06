export PGUSER=postgres
psql <<- EOSQL
    CREATE USER pepper with password 'dbPasswordExample' SUPERUSER;
    CREATE DATABASE "dba400L1";
    GRANT ALL PRIVILEGES ON DATABASE "dba400L1" TO pepper;
EOSQL
