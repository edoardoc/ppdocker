docker build -t jetty7ppws .
if [ $? -eq 0 ]; then
	echo OK, launching! daemon, remove -d to check logs
	docker run --name datapp --add-host pp20.prv.lan:194.242.228.81 --add-host pp12.prv.lan:194.242.228.82 -p 80:8080 jetty7ppws
else
    echo FAIL
fi
