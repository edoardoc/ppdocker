docker exec -t mydba400 su - postgres -c "pg_restore -c -I utente_email -I utente_password -I utente_pkey -I utente_primarykey -t utente -t tipoauto -t rubrica -I rubrica_krpadre -I rubrica_primarykey -I rubrica_rubric -I rubrica_rubricrichieste -t ricercasalvata -t movimento -I idcodutentecodtrans -I idcodutenteflag -I numfattanno -t formato -t annunciosalvato /pginput/$1 | recode iso-8859-1..u8 | psql --dbname dba400L1"
