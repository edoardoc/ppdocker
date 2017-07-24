#!/bin/bash
branchina="/dev"
cd ~/ppweb
git fetch
NLINEE="$(git --no-pager diff HEAD..origin$branchina --name-only )"
VER=$(<~/ppweb/.git/refs/heads$branchina)
if [ -z "$NLINEE" ]; then
		echo $NLINEE
		exit;
else
		echo 'eseguo pull'
		cd ~/ppweb
		git pull
		#echo "PPOCEAN01 sta ripartendo dopo deploy automatico. Commit on line: $branchina - $VER" | mail -s 'portaportese server startup' eddyce@me.com,rcaccamo0@gmail.com,bastianelli.portaportese@gmail.com,edoardo.c@tiscali.it
		cd ~/ppdocker
		docker-compose restart www
fi
cd -
