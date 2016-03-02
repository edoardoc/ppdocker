cat ~/ppweb/WEB-INF/web-per-jrun.xml > ~/ppweb/WEB-INF/web.xml

sed -i '' s/dbppPP1/dbppPP9/g ~/ppweb/WEB-INF/web.xml
sed -i '' s/dba400PP3/dba400PP11/g ~/ppweb/WEB-INF/web.xml
sed -i '' s/dba400PP4/dba400PP11/g ~/ppweb/WEB-INF/web.xml 

docker stop dockerppweb 
docker rm dockerppweb

docker run -p 80:80 --link pp9.prv.lan --link pp11.prv.lan --name dockerppweb -h dockerppweb -i -t -v ~/ppweb:/home/ppjr/default-ear/default-war portaportese/ppstart:v1.1 sh /root/pplaunch
