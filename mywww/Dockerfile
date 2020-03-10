FROM portaportese/ppstart:v1.1

ADD jrun-resources.xml /home/ppjr/SERVER-INF/
ADD pplaunch /root/

ENV TZ=Europe/Rome
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

#RUN wget -O /opt/mrpaf.tar.gz "http://mirror.trouble-free.net/sources/mod_rpaf-0.6.tar.gz"
#RUN tar -xvf /opt/mrpaf.tar.gz -C /opt/
#WORKDIR /opt/mod_rpaf-0.6
#RUN apxs -i -c -n mod_rpaf-2.0.so mod_rpaf-2.0.c

#RUN ls -l /etc/httpd/modules/
EXPOSE 80
CMD ["/bin/bash", "/root/pplaunch"]

