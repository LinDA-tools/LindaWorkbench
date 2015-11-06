/tomcat-run.sh &
/elasticsearch/bin/elasticsearch &
service mysql start
python3 /LinDAWorkbench/linda/manage.py runserver
