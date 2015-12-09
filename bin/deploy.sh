/tomcat/bin/startup.sh > /LinDA/logs/tomcat.log &
/elasticsearch/bin/elasticsearch -d > /LinDA/logs/es.log &
service mysql start & 
current_dir=$PWD & cd /LinDA/RDF2Any/linda & nohup mvn exec:java -X > /LinDA/logs/rdf2any.log & 
cd /LinDA/QueryBuilder & nohup rvm use 2.0.0@qbuilder & nohup rails s -p 3100 > /LinDA/logs/qbuilder.log &
cd /LinDA/Analytics/ & Rscript startRserve.R & wildfly/bin/standalone.sh &
python3 /LinDA/LinDAWorkbench/linda/manage.py runserver > /LinDA/logs/main.log &
cd "$current_dir"
