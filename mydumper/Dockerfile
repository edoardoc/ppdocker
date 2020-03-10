
FROM postgres:9.4

MAINTAINER Edoardo Ceccarelli <ridleys@gmail.com>

ADD dump.sh /dump.sh
RUN chmod +x /dump.sh
VOLUME /dump

ENTRYPOINT ["/dump.sh"]
CMD [""]