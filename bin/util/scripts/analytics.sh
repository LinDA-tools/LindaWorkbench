# R packages

sh -c "R -e \"install.packages('gstat', repos='http://cran.r-project.org')\"" 
sh -c "R -e \"install.packages('cluster', repos='http://cran.r-project.org')\"" 
sh -c "R -e \"install.packages('mclust', repos='http://cran.r-project.org')\"" 
sh -c "R -e \"install.packages('ape', repos='http://cran.r-project.org')\"" 
sh -c "R -e \"install.packages('ncf', repos='http://cran.r-project.org')\"" 
sh -c "R -e \"install.packages('sp', repos='http://cran.r-project.org')\"" 
sh -c "R -e \"install.packages('forecast', repos='http://cran.r-project.org')\"" 

#mkdir -p /var/www/html/LindaAnalytics
WILDFLY_VERSION=9.0.1.Final
JAVA_HOME=/usr/lib/jvm/java-7-openjdk-amd64                                                                                                                                                                                                       
JBOSS_HOME=/LinDA/Analytics/wildfly

sudo apt-get install openjdk-7-jdk -y 
sudo apt-get install sed -y 

current_dir=$PWD

mkdir /LinDA/Analytics/
cd /LinDA/Analytics/    
curl -O https://download.jboss.org/wildfly/$WILDFLY_VERSION/wildfly-$WILDFLY_VERSION.tar.gz     
tar xf wildfly-$WILDFLY_VERSION.tar.gz     
mv /LinDA/Analytics/wildfly-$WILDFLY_VERSION $JBOSS_HOME  
rm /LinDA/Analytics/wildfly-$WILDFLY_VERSION.tar.gz 

#RUN groupadd -r jboss -g 1001 && useradd -u 1001 -r -g jboss -m -d /code -s /sbin/nologin -c "JBoss user" jboss &&     chmod 755 /code  

sed -i 's|jboss.http.port:8080|jboss.http.port:8181|' wildfly/standalone/configuration/standalone.xml

# clone project & move assets to wildfly
git clone https://github.com/ubitech/RESTfulLINDA.git /LinDA/Analytics/RESTfulLINDA
cd /LinDA/Analytics/RESTfulLINDA
mvn clean install
cp configuration/lindaAnalytics/ /LinDA/Analytics/wildfly/modules/lindaAnalytics
cp target/RESTfulLINDA.war /code/wildfly/standalone/deployments/
cp startRserve.R /LinDA/Analytics/

cd "$current_dir"
