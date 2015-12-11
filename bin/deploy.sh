netout=`netstat -tupln`
snetout=`sudo netstat -tupln`

if [ $(echo "$netout" |grep 8080 | wc -l) -eq 0 ]; then
	/tomcat/bin/startup.sh > ~/LinDA/logs/tomcat.log
	echo "Tomcat started"
fi

if [ $(echo "$netout" |grep 9300 | wc -l) -eq 0 ]; then
	~/LinDA/elasticsearch/bin/elasticsearch -d > ~/LinDA/logs/es.log 
	echo "ES started"
fi

if [ $(echo "$snetout" |grep 3306 | wc -l) -eq 0 ]; then
	sudo service mysql start 
	echo "MySQL started"
fi

current_dir=$PWD

if [ $(echo "$netout" |grep 8081 | wc -l) -eq 0 ]; then
	cd ~/LinDA/RDF2Any/linda
	nohup mvn exec:java -X > ~/LinDA/logs/rdf2any.log &
	echo "RDF2Any started"
fi

if [ $(echo "$netout" |grep 3100 | wc -l) -eq 5 ]; then
	cd ~/LinDA/QueryBuilder
	source ~/.rvm/scripts/rvm
	rvm use 2.0.0@qbuilder
	nohup rails s -p 3100 > ~/LinDA/logs/qbuilder.log &
fi

if [ $(echo "$netout" |grep 8181 | wc -l) -eq 0 ]; then
	cd ~/LinDA/Analytics/ 
	nohup Rscript startRserve.R > ~/LinDA/logs/R.log & 
	nohup ~/LinDA/Analytics/wildfly/bin/standalone.sh > ~/LinDA/logs/wildfly.log & 
	echo "Wildfly & R started"
fi

if [ $(echo "$netout" |grep 3002 | wc -l) -eq 0 ]; then
	cd ~/LinDA/Visualization/linda-vis-be 
	nohup nodemon </dev/null > ~/LinDA/logs/linda-vis-be.log &
	echo "Visualization started"
fi

if [ $(echo "$netout" |grep 8000 | wc -l) -eq 0 ]; then
	nohup python3 ~/LinDA/LinDAWorkbench/linda/manage.py runserver > ~/LinDA/logs/main.log & 
	echo "Workbench started"
fi

cd "$current_dir"
