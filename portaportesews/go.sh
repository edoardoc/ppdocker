docker build -t jetty7ppws .
if [ $? -eq 0 ]; then
	echo OK, launching daemon!
	docker stop datapp
	docker rm datapp
	docker run -d --name datapp --add-host pp3.prv.lan:194.242.228.81 --add-host pp4.prv.lan:194.242.228.83 \
								--add-host pp1.prv.lan:194.242.232.20 \
		-e VIRTUAL_HOST=data.portaportese.it -e VIRTUAL_PORT=8080 --link mypostfix jetty7ppws
else
    echo FAIL
fi
