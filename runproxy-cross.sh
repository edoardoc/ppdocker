docker stop myproxy
docker rm myproxy
docker run -d --name myproxy -p 80:80 -v /root/ppdocker/nginx-vhost.d:/etc/nginx/vhost.d:ro -v /var/run/docker.sock:/tmp/docker.sock:ro jwilder/nginx-proxy
