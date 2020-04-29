# Postgres IT

FROM postgres:9.4
RUN mkdir -p /pg/data
ENV PGDATA /pg/data

RUN localedef -i it_IT -c -f UTF-8 -A /usr/share/locale/locale.alias it_IT.UTF-8
ENV LANG en_US.utf8
RUN apt-get update
RUN apt-get -y install recode

ENV TZ=Europe/Rome
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
COPY creadb.sh /docker-entrypoint-initdb.d/
COPY fix-acl.sh /docker-entrypoint-initdb.d/
COPY fix-pgconf.sh /docker-entrypoint-initdb.d/
