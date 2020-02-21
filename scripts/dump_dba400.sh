docker run -t --rm \
    -v /opt/dumps/:/dump \
    -e PREFIX=dba400 \
    -e PGDB=dba400L1 \
    -e PGPASSWORD=${PGSQL_PASSWORD3} \
    -e PGHOST=vm8412.seewebcloud.it \
    -e PGUSER=pepper \
    -e PGPORT=5430 \
    mydumper
