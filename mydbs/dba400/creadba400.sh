gosu postgres postgres --single <<- EOSQL
    CREATE USER pepper with password 'dbPasswordExample' SUPERUSER;
    CREATE DATABASE DBA400L1;
    GRANT ALL PRIVILEGES ON DATABASE DBA400L1 TO pepper;
EOSQL
