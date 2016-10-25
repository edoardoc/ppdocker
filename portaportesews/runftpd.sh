#cd myftpd
#docker build -t ppftpd .
#cd ..
docker stop myftpd
docker rm myftpd
docker run -d --name myftpd -p 21:21 -p 30000-30009:30000-30009 -e "PUBLICHOST=localhost" stilliard/pure-ftpd:hardened
(echo ftpPasswordExample; echo ftpPasswordExample) | docker exec -i myftpd pure-pw useradd rmdtmsoft -u ftpuser -d /home/ftpusers/rmdtmsoft
docker exec -i -t myftpd pure-pw mkdb
