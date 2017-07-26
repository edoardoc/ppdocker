docker run -ti --rm \
    -v /mnt/volume-fra1-dumps/:/dump \
    -e PREFIX=dbpp \
    -e PGDB=portaportese \
    -e PGPASSWORD=dbPasswordExampleLong \
    -e PGHOST=194.242.232.20 \
    -e PGUSER=pepper \
    -e PGPORT=5432 \
    mydumper