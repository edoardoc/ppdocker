# Java6, Jetty7 and Cargo1.4

FROM java:6

# Install Jetty
RUN wget -O /opt/jetty.tar.gz "http://download.eclipse.org/jetty/7.6.17.v20150415/dist/jetty-distribution-7.6.17.v20150415.tar.gz"
# RUN wget -O /opt/jetty.tar.gz "http://eclipse.org/downloads/download.php?file=/jetty/7.0.1.v20091125/dist/jetty-distribution-7.0.1.v20091125.tar.gz&r=1"

# ADD jetty-distribution-7.0.1.v20091125.tar.gz /opt/jetty.tar.gz

RUN tar -xvf /opt/jetty.tar.gz -C /opt/
RUN rm /opt/jetty.tar.gz
RUN mv /opt/jetty-distribution-7.6.17.v20150415 /opt/jetty
#RUN mv /opt/jetty-distribution-7.0.1.v20091125 /opt/jetty
RUN rm -rf /opt/jetty/webapps.demo
RUN rm -rf /opt/jetty/webapps/* /opt/jetty/contexts/*
RUN useradd jetty -U -s /bin/false
RUN chown -R jetty:jetty /opt/jetty

ADD .jettyrc /root/

RUN mkdir /root/.oauth-credentials
ADD .oauth-credentials/* /root/.oauth-credentials/

# Install PPWS
ADD data.portaportese.it.xml /opt/jetty/contexts/
ADD portaportesews.war /opt/jetty/webapps/data.portaportese.it.war
RUN mkdir /root/initppdata
# ADD pcv.sbin /root/initppdata/

ENV TZ=Europe/Rome
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Run Jetty
EXPOSE 8080
CMD ["java", "-Djetty.home=/opt/jetty", "-jar", "/opt/jetty/start.jar", "OPTIONS=jndi,plus,Server,jsp"]
