docker run -t --rm \
    -v /opt/dumps/:/dump \
    -e PREFIX=dbnew \
    -e PGDB=portaporteseDb \
    -e PGPASSWORD=${PGSQL_PASSWORD} \
    -e PGHOST=vm8523.seewebcloud.it \
    -e PGUSER=portaporteseDbUser \
    -e PGPORT=5432 \
    mydumper
