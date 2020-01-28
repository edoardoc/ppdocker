userdel -r ppweb
useradd -s /sbin/nologin ppweb
(echo ${PGSQL_PASSWORD3}; echo ${PGSQL_PASSWORD3}) | passwd ppweb
