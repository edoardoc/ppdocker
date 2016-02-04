docker build -t jetty7ppws .
if [ $? -eq 0 ]; then
	echo OK, launching daemon!
	docker stop datapp
	docker rm datapp
	docker run -d --name datapp --add-host pp3.prv.lan:194.242.228.81 --add-host pp1.prv.lan:194.242.228.82 \
		-e VIRTUAL_HOST=ppappsrv03.inroma.roma.it -e VIRTUAL_PORT=8080 jetty7ppws
else
    echo FAIL
fi
