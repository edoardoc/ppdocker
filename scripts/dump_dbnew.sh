docker run -ti --rm \
    -v /mnt/volume-fra1-dumps/:/dump \
    -e PREFIX=portaporteseDb \
    -e PGDB=portaportese \
    -e PGPASSWORD=portaporteseDbUserPassword \
    -e PGHOST=vm8411.seewebcloud.it \
    -e PGUSER=portaporteseDbUser \
    -e PGPORT=5432 \
    mydumper
