#!/bin/bash
branchina="/master"
cd /root/rpp
git fetch
NLINEE="$(git --no-pager diff HEAD..origin$branchina --name-only )"
VER=$(</home/ppjr/default-ear/default-war/.git/refs/heads$branchina)
if [ -z "$NLINEE" ]; then
		echo $NLINEE
		exit;
else
		echo 'eseguo pull'
		echo "PP1 sta ripartendo dopo deploy automatico. Commit on line: $branchina - $VER" | mail -s 'portaportese server startup' eddyce@me.com,rcaccamo0@gmail.com,bastianelli.portaportese@gmail.com,edoardo.c@tiscali.it
		/root/restart.sh
fi
cd -
