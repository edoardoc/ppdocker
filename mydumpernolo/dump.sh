#!/bin/bash
# postgresql dump

cd /dump/

TODAY=`date +%Y%m%d-%H%M`
DUMPFILE="${PREFIX}_${TODAY}"

MAXDUMPS=3

# Main
[ ! -d $DUMPDIR ] && mkdir $DUMPDIR
export PATH="$PATH:/usr/local/pgsql/bin"
pg_dump -n public --encoding utf8 -Fc -Z9 -c -f /dump/${DUMPFILE} -d "$PGDB" > /dump/${DUMPFILE}.log 2>&1

chown postgres.postgres ${DUMPFILE}

NDUMPS=`ls $DUMPDIR/${PREFIX}* 2>/dev/null | wc -l`
NDUMPS2DELETE=$((NDUMPS-MAXDUMPS))
[ "$NDUMPS2DELETE" -gt 0 ] && {
        DUMPS2DELETE=`ls $DUMPDIR/${PREFIX}* 2>/dev/null | head -$NDUMPS2DELETE`
        rm -f $DUMPS2DELETE
}
