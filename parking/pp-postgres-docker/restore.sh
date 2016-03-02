docker rm pga400data
docker create -v /pg/data --name pga400data postgres /bin/true
docker run --volumes-from pga400data -v $(pwd):/backup postgres tar xvf /backup/dba400/pga400data.tar pg/


docker rm pgdata
docker create -v /pg/data --name pgdata portaportese/pp-db-gestionale /bin/true
docker run --volumes-from pgdata -v $(pwd):/backup postgres tar xvf /backup/db-gestionale/pgdata.tar pg/


