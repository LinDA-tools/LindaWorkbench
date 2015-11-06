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

# INSTALL TOMCAT
ENV TOMCAT_MAJOR_VERSION 7
ENV TOMCAT_MINOR_VERSION 7.0.55
ENV CATALINA_HOME /tomcat

RUN wget -q https://archive.apache.org/dist/tomcat/tomcat-${TOMCAT_MAJOR_VERSION}/v${TOMCAT_MINOR_VERSION}/bin/apache-tomcat-${TOMCAT_MINOR_VERSION}.tar.gz
RUN    wget -qO- https://archive.apache.org/dist/tomcat/tomcat-${TOMCAT_MAJOR_VERSION}/v${TOMCAT_MINOR_VERSION}/bin/apache-tomcat-${TOMCAT_MINOR_VERSION}.tar.gz.md5 | md5sum -c - 
RUN    tar zxf apache-tomcat-*.tar.gz
RUN    rm apache-tomcat-*.tar.gz
RUN    mv apache-tomcat* tomcat

ADD create_tomcat_admin_user.sh /create_tomcat_admin_user.sh
ADD tomcat-run.sh /tomcat-run.sh
RUN chmod +x /*.sh

EXPOSE 8080

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
# https://github.com/docker-library/python/issues/13
ENV LANG C.UTF-8

# Update package lists and install python3, python3-dev, pip-3.2
RUN apt-get update && apt-get install --no-install-recommends -y -q \
    python3 python3-dev python3-pip \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*
RUN apt-get install -y python3-setuptools
RUN apt-get update && apt-get install -y libmysqlclient15-dev
RUN apt-get install -y libxml2-dev libxslt1-dev python-dev
RUN apt-get install -y libjpeg-dev
RUN easy_install3 pip

RUN pip install -r /LinDAWorkbench/requirements.txt

# Clone transformation app
RUN git clone https://github.com/LinDA-tools/transformation.git /LinDAWorkbench/linda/transformation

# TMP  -PLEASE FIX AT END!!!
RUN sudo rm -rf /usr/lib/python3/dist-packages/urllib3 && sudo rm -rf /usr/lib/python3/dist-packages/urllib3-1.7.1.egg-info && ls -la /usr/lib/python3/dist-packages/
RUN pip install urllib3==1.8.3 && pip install pyelasticsearch && pip install elasticsearch==1.7.0
ADD qdmodels.py /LinDAWorkbench/linda/query_designer/models.py 

# Expose workbench ports
EXPOSE 8000
ADD passwords.py /LinDAWorkbench/linda/linda_app/passwords.py
ADD settings.py /LinDAWorkbench/linda/linda_app/settings.py
ADD vocabularies /LinDAWorkbench/linda/linda_app/static/vocabularies
ADD models.py /LinDAWorkbench/linda/linda_app/models.py

RUN nohup /elasticsearch/bin/elasticsearch & \
	service mysql start && \
	python3 /LinDAWorkbench/linda/manage.py makemigrations && \
	mysql -u root -e "CREATE DATABASE linda CHARACTER SET utf8 COLLATE utf8_general_ci;" && \
	python3 /LinDAWorkbench/linda/manage.py migrate && \
	echo "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'pass')" | python3 /LinDAWorkbench/linda/manage.py shell && \
	python3 /LinDAWorkbench/linda/manage.py loaddata /LinDAWorkbench/linda/linda_app/installer/data/vocabularies.json
	
ADD all-commands /all-commands.sh
CMD /all-commands.sh
