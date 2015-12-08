/tomcat/bin/startup.sh &
/elasticsearch/bin/elasticsearch -d &
service mysql start & 
python3 /LinDAWorkbench/linda/manage.py runserver
