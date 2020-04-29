docker run -t --rm \
    -v /opt/dumps/:/dump \
    -e PREFIX=dbnew \
    -e PGDB=portaporteseDb \
    -e PGPASSWORD=au4QWc3UGZRafB7x55fRQyjgpfuSXW3EEdR2kEKuYKtQ \
    -e PGHOST=vm8523.seewebcloud.it \
    -e PGUSER=portaporteseDbUser \
    -e PGPORT=5432 \
    mydumper
