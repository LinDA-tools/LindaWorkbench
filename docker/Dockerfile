#
# Ubuntu Dockerfile
#
# https://github.com/dockerfile/ubuntu
#

# Pull base image.
FROM ubuntu:14.04

# Install.
RUN \
  sed -i 's/# \(.*multiverse$\)/\1/g' /etc/apt/sources.list && \
  apt-get update && \
  apt-get -y upgrade && \
  apt-get install -y build-essential && \
  apt-get install -y software-properties-common && \
  apt-get install -y byobu curl git htop man unzip vim wget && \
  apt-get install -y default-jdk && \
  apt-get install -y git && \
  apt-get install -y idle-python3.4 && \
  apt-get install -yq --no-install-recommends wget pwgen ca-certificates && \
  rm -rf /var/lib/apt/lists/*

# Install Elasticsearch.
ENV ES_PKG_NAME elasticsearch-1.5.0

RUN \
  cd / && \
  wget https://download.elasticsearch.org/elasticsearch/elasticsearch/$ES_PKG_NAME.tar.gz && \
  tar xvzf $ES_PKG_NAME.tar.gz && \
  rm -f $ES_PKG_NAME.tar.gz && \
  mv /$ES_PKG_NAME /elasticsearch

# Set environment variables.
ENV HOME /root

# Define working directory.
WORKDIR /root

# Define default command.
CMD ["bash"]

# Install tomcat
RUN apt-get update && \
    apt-get install -yq --no-install-recommends wget pwgen ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

ENV TOMCAT_MAJOR_VERSION 7
ENV TOMCAT_MINOR_VERSION 7.0.55
ENV CATALINA_HOME /home/tomcat

RUN wget -q https://archive.apache.org/dist/tomcat/tomcat-${TOMCAT_MAJOR_VERSION}/v${TOMCAT_MINOR_VERSION}/bin/apache-tomcat-${TOMCAT_MINOR_VERSION}.tar.gz && \
    wget -qO- https://archive.apache.org/dist/tomcat/tomcat-${TOMCAT_MAJOR_VERSION}/v${TOMCAT_MINOR_VERSION}/bin/apache-tomcat-${TOMCAT_MINOR_VERSION}.tar.gz.md5 | md5sum -c - && \
    tar zxf apache-tomcat-*.tar.gz && \
    rm apache-tomcat-*.tar.gz && \
    mv apache-tomcat* tomcat

ADD create_tomcat_admin_user.sh /create_tomcat_admin_user.sh
ADD tomcat-run.sh /tomcat-run.sh
RUN chmod +x /*.sh

EXPOSE 8080
CMD ["/tomcat-run.sh"]

# Install MySQL
# add our user and group first to make sure their IDs get assigned consistently, regardless of whatever dependencies get added
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update -qq && apt-get install -y mysql-server-5.5

ADD my.cnf /etc/mysql/conf.d/my.cnf
RUN chmod 664 /etc/mysql/conf.d/my.cnf
ADD mysql-run.sh /usr/local/bin/mysql-run
RUN chmod +x /usr/local/bin/mysql-run

VOLUME ["/var/lib/mysql"]
EXPOSE 3306
CMD ["/usr/local/bin/mysql-run"]

# Install OpenRDF
ENV SESAME_VERSION 2.7.13
ENV SESAME_DATA /openrdf-data

RUN apt-get update && apt-get install -y wget

RUN wget http://sourceforge.net/projects/sesame/files/Sesame%202/$SESAME_VERSION/openrdf-sesame-$SESAME_VERSION-sdk.tar.gz/download -O /tmp/sesame.tar.gz && tar xzf /tmp/sesame.tar.gz -C /opt && ln -s /opt/openrdf-sesame-$SESAME_VERSION /opt/sesame && rm /tmp/sesame.tar.gz

# Remove docs and examples
RUN rm -rf $CATALINA_BASE/webapps/docs && rm -rf $CATALINA_BASE/webapps/examples

# Deploy 
RUN mkdir ${CATALINA_BASE}/webapps
RUN mkdir ${CATALINA_BASE}/webapps/openrdf-sesame && cd ${CATALINA_BASE}/webapps/openrdf-sesame && jar xf /opt/sesame/war/openrdf-sesame.war &&  mkdir ${CATALINA_BASE}/webapps/openrdf-workbench && cd ${CATALINA_BASE}/webapps/openrdf-workbench && jar xf /opt/sesame/war/openrdf-workbench.war

#COPY run.sh /run.sh

VOLUME /openrdf-data

# Clone LinDA Workbench repository
RUN git clone https://github.com/LinDA-tools/LindaWorkbench.git /LinDAWorkbench

# Install Python.
RUN \
  apt-get install -y python python-dev python-pip python-virtualenv && \
  rm -rf /var/lib/apt/lists/*
RUN apt-get update && apt-get install libmysqlclient15-dev
RUN easy_install pip
 
RUN pip install -r /LinDAWorkbench/requirements.txt

# Expose workbench ports
EXPOSE 8000

RUN python /LinDAWorkbench/linda/manage.py makemigrations
RUN python /LinDAWorkbench/linda/manage.py migrate
RUN python /LinDAWorkbench/linda/manage.py loaddata

# Run server
RUN python /LinDAWorkbench/linda/manage.py runserver 0.0.0.0:8000
