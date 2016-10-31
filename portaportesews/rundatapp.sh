docker build -t jetty7ppws .
if [ $? -eq 0 ]; then
	echo OK, launching daemon!
	docker stop datapp
	docker rm datapp
	docker run -d --name datapp \
		-e HTTPS_METHOD=noredirect \
		-e VIRTUAL_HOST=testing.portaportese.it \
		-e VIRTUAL_PORT=8080 \
		--add-host pp3.prv.lan:194.242.228.33 \
		--add-host pp4.prv.lan:194.242.228.33 \
		--add-host pp1.prv.lan:194.242.228.82 \
		--link mypostfix jetty7ppws
else
    echo FAIL
fi
