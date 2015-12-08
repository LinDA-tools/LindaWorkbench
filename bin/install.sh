
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
ES_PKG_NAME=elasticsearch-1.5.0

  cd / && \
  wget https://download.elasticsearch.org/elasticsearch/elasticsearch/$ES_PKG_NAME.tar.gz && \
  tar xvzf $ES_PKG_NAME.tar.gz && \
  rm -f $ES_PKG_NAME.tar.gz && \
  mv /$ES_PKG_NAME /elasticsearch


# Install MySQL
# add our user and group first to make sure their IDs get assigned consistently, regardless of whatever dependencies get added
DEBIAN_FRONTEND=noninteractive
apt-get install -y mysql-server

cp ./util/scripts/my.cnf /etc/mysql/conf.d/my.cnf
chmod 664 /etc/mysql/conf.d/my.cnf
cp ./util/scripts/mysql-run.sh /usr/local/bin/mysql-run
chmod +x /usr/local/bin/mysql-run

# Install OpenRDF
SESAME_VERSION=2.7.13
SESAME_DATA=/openrdf-data

apt-get install -y wget

wget http://sourceforge.net/projects/sesame/files/Sesame%202/$SESAME_VERSION/openrdf-sesame-$SESAME_VERSION-sdk.tar.gz/download -O /tmp/sesame.tar.gz && tar xzf /tmp/sesame.tar.gz -C /opt && ln -s /opt/openrdf-sesame-$SESAME_VERSION /opt/sesame && rm /tmp/sesame.tar.gz

# Remove docs and examples
rm -rf $CATALINA_BASE/webapps/docs && rm -rf $CATALINA_BASE/webapps/examples

TOMCAT_MAJOR_VERSION=7
TOMCAT_MINOR_VERSION=7.0.55
CATALINA_BASE=/tomcat

wget -q https://archive.apache.org/dist/tomcat/tomcat-${TOMCAT_MAJOR_VERSION}/v${TOMCAT_MINOR_VERSION}/bin/apache-tomcat-${TOMCAT_MINOR_VERSION}.tar.gz
wget -qO- https://archive.apache.org/dist/tomcat/tomcat-${TOMCAT_MAJOR_VERSION}/v${TOMCAT_MINOR_VERSION}/bin/apache-tomcat-${TOMCAT_MINOR_VERSION}.tar.gz.md5 | md5sum -c - 
tar zxf apache-tomcat-*.tar.gz
rm apache-tomcat-*.tar.gz
mv apache-tomcat* ${CATALINA_BASE}

chmod +x ./util/scripts/*.sh

mkdir ${CATALINA_BASE}/webapps/openrdf-sesame && cd ${CATALINA_BASE}/webapps/openrdf-sesame && jar xf /opt/sesame/war/openrdf-sesame.war &&  mkdir ${CATALINA_BASE}/webapps/openrdf-workbench && cd ${CATALINA_BASE}/webapps/openrdf-workbench && jar xf /opt/sesame/war/openrdf-workbench.war

# Clone LinDA Workbench repository
git clone https://github.com/LinDA-tools/LindaWorkbench.git /LinDAWorkbench

# Install Python.
# https://github.com/docker-library/python/issues/13
LANG=C.UTF-8

# Update package lists and install python3, python3-dev, pip-3.2
apt-get install --no-install-recommends -y -q \
    python3 python3-dev libmysqlclient-dev \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*
apt-get install -y python3-setuptools


#apt-get update && apt-get install -y libmysqlclient15-dev
apt-get install -y libxml2-dev libxslt1-dev python-dev
apt-get install -y libjpeg-dev
easy_install3 pip

# install application requirements
pip3 install -r /LinDAWorkbench/requirements.txt

# Clone transformation app
git clone https://github.com/LinDA-tools/transformation.git /LinDAWorkbench/linda/transformation


# Python 3 fix
pip3 install pyelasticsearch && pip3 install elasticsearch==1.7.0
cp ./util/patches/qdmodels.py /LinDAWorkbench/linda/query_designer/models.py 

# custom files
cp ./passwords.py /LinDAWorkbench/linda/linda_app/passwords.py
cp ./util/patches/settings.py /LinDAWorkbench/linda/linda_app/settings.py
cp ./util/data/vocabularies /LinDAWorkbench/linda/linda_app/static/vocabularies
cp ./util/patches/models.py /LinDAWorkbench/linda/linda_app/models.py

/elasticsearch/bin/elasticsearch -d & \
	service mysql start && \
	python3 /LinDAWorkbench/linda/manage.py makemigrations && \
	mysql -u root -e "CREATE DATABASE linda CHARACTER SET utf8 COLLATE utf8_general_ci;" && \
	python3 /LinDAWorkbench/linda/manage.py migrate && \
	echo "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'pass')" | python3 /LinDAWorkbench/linda/manage.py shell && \
	python3 /LinDAWorkbench/linda/manage.py loaddata /LinDAWorkbench/linda/linda_app/installer/data/vocabularies.json
