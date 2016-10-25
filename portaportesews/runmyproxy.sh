cd myproxy
docker build -t ppproxy .
cd ..
docker stop myproxy
docker rm myproxy
docker run -d --name myproxy -p 80:80 -p 443:443 \
			-v /home/rmdtmsoft:/web/static \
			-v ~/cert:/etc/nginx/certs \
			-v ~/ppdocker/portaportesews/nginx-vhost.d:/etc/nginx/vhost.d:ro \
			-v /var/run/docker.sock:/tmp/docker.sock:ro \
			ppproxy	
