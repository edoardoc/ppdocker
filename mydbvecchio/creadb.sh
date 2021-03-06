#!/bin/bash
{ psql --user postgres <<-EOSQL
    CREATE USER "$DB_USER" WITH PASSWORD '$DB_PASSWORD';
    CREATE DATABASE "$DB_NAME" WITH OWNER="$DB_USER" TEMPLATE=template0 ENCODING='$DB_ENCODING';
    GRANT ALL PRIVILEGES ON DATABASE  "$DB_NAME" TO "$DB_USER";
EOSQL
}