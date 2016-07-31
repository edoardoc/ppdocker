REM importante:
REM il folder ppweb deve trovarsi all'interno del folder utente 
REM (in questo caso Edoardo)

docker stop ppweb
docker rm ppweb
docker run -i -t --name ppweb -p 80:80 -v /c/Users/Edoardo/ppweb/:/home/ppjr/default-ear/default-war/ --add-host pp3.prv.lan:194.242.228.81 --add-host pp1.prv.lan:194.242.228.82 -e VIRTUAL_HOST=test.portaportese.it -e VIRTUAL_PORT=8001 portaportese/ppstart:v1.1 /bin/bash /root/pplaunch
