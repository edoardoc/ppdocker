docker run -ti --rm 
    -v /tmp:/dump \   # where to put db dumps
    -e PGUSER=mybackup \
    -e PGPASSWORD=dbPasswordExampleLong \
    -e PGHOST=mybackup \
    mydumper dump