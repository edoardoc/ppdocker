#!/bin/bash

set -a
source ~/ppdocker/.env

branchina="/master"
cd ${PPFOLDER}
echo ciao ${PPFOLDER}

git fetch
NLINEE="$(git --no-pager diff HEAD..origin$branchina --name-only )"
VER=$(<${PPFOLDER}/.git/refs/heads$branchina)

echo LINEE = $NLINEE
if [ -z "$NLINEE" ]; then
		echo $NLINEE
		exit;
else
		echo 'eseguo pull'
		cd ${PPFOLDER}
		git pull
		echo "PPOCEAN01 sta ripartendo dopo deploy automatico. Commit on line: $branchina - $VER" | mail -s 'ppocean server startup' eddyce@me.com,rcaccamo0@gmail.com,bastianelli.portaportese@gmail.com,edoardo.c@tiscali.it
		cd ~/ppdocker
		./go
fi
cd -
