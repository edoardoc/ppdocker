echo starting!
docker build  -t mydumper ./mydumper
docker run -ti --rm \
    -v /tmp:/dump \
    -e PGDB=dba400L1 \
    -e PGPASSWORD=dbPasswordExample \
    -e PGHOST=194.242.232.21 \
    -e PGUSER=pepper \
    -e PGPORT=5432 \
    mydumper dump