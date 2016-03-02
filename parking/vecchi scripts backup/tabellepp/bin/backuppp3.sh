echo backup di $1
pg_dump --encoding ISO-8859-1 --host pp3.inroma.roma.it --port 5432 --username "pepper" --no-password -Fc -Z9 -c --ignore-version --verbose --file $1 --table $1 "dba400L1"
