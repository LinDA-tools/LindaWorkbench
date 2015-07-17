LinDA Workbech
==============

Repository for the workbech of the LinDA project

##Install OpenRDF
### Install Java
If you  do not have java, download it with apt-get.
```shell
  sudo apt-get install default-jdk
```
###Install Tomcat
Download tomcat from their site,for the exact filename look here (http://mirror.vorboss.net/apache/tomcat/tomcat-7/).
Example:
```
wget http://mirror.vorboss.net/apache/tomcat/tomcat-7/v7.0.55/bin/apache-tomcat-7.0.55.tar.gz
```
Untar the file
```
tar xvzf apache-tomcat-7.0.55.tar.gz
```
Move tomcat files to a convenient directory.
```
 sudo mv apache-tomcat-7.0.55  /usr/share/
```
### Configure .bashrc
Before editing the .bashrc file in your home directory, we need to find the path where Java has been installed to set the JAVA_HOME environment variable. Let's use the following command to do that:
```shell
  update-alternatives --config java
```
The complete path displayed by this command is:
/usr/lib/jvm/java-7-openjdk-amd64/jre/bin/java

The value for JAVA_HOME is everything before /jre/bin/java in the above path - in this case, /usr/lib/jvm/java-7-openjdk-amd64. Make a note of this as we'll be using this value in this step and in one other step.

In order to start Tomcat, we need to add it as an environment variable in the /.bashrc file.
```shell
  sudo gedit ~/.bashrc
```
You can add this information to the end of the file:
```shell
  export JAVA_HOME=/usr/lib/jvm/java-7-openjdk-amd64
  export CATALINA_HOME=/usr/share/apache-tomcat-7.0.55
```
After saving and closing the .bashrc file, execute the following command so that your system recognizes the newly created environment variables:
```shell
  source ~/.bashrc
```
Configure Tomcat users
```shell
  pico $CATALINA_HOME/conf/tomcat-users.xml
```
And add the following tags (username and password for admin) inside the tomcat-users tag

```shell
<tomcat-users>
   <role rolename="manager-gui"/>
  <role rolename="admin"/>
  <user name="admin" password="admin" roles="manager-gui,admin"/>
</tomcat-users>
```
Activate Tomcat by running its startup script:
```shell
  $CATALINA_HOME/bin/startup.sh
```
###Install OpenRDF - Sesame Server and Workbench
* Download latest Sesame (e.g. http://sourceforge.net/projects/sesame/files/Sesame%202/ , the SDK version - http://sourceforge.net/projects/sesame/files/Sesame%202/2.7.14/openrdf-sesame-2.7.14-sdk.zip/download).
* Unzip the file to a folder.
* Go to http://localhost:8080/manager/html and enter the tomcat username and password.
* In the "WAR file to deploy" :
* a)Click Browse: Select The war/openrdf-sesame.war from the unzipped sesame sdk zip and click deploy
* b)Click Browse: Select The war/openrdf-workbench.war from the unzipped sesame sdk zip and click deploy.

* Go to the  OpenRDF Workbench page (http://localhost:8080/openrdf-workbench/repositories/NONE/repositories) to make sure OpenRDF has been deployed successfully.

##Install MySQL
```
  sudo apt-get install mysql-server
  sudo apt-get install libmysqlclient-dev
```
Create a new empty Database "linda"
```
  mysql -u root -p
  CREATE DATABASE `linda` CHARACTER SET utf8 COLLATE utf8_general_ci;
  quit
```

##Install python-dev
```
  sudo apt-get install python-dev
```
##Install git and clone repository
```
  sudo apt-get update
  sudo apt-get install git
  git config --global user.name "Your Name"
  git config --global user.email "youremail@domain.com"
```
Clone the LinDA workbench in a preferred folder

```
 git clone 'https://github.com/LinDA-tools/LindaWorkbench.git'
```
##Build

Install django: 
  ```
  sudo apt-get install python-django
  ```

Install pip:
  ```
  sudo apt-get install python-pip
  ```
  
Install project requirements
First install some necessary libraries
  ```
  apt-get install libxml2-dev libxslt-dev python-dev lib32z1-dev
  ```
Then go to the cloned LindaWorkbench directory and execute
  ```
  sudo pip install -r requirements.txt
  ```
##Set passwords
In order to be able to deploy the workbench locally, in the directory linda/linda_app/ you must edit the file passwords.py in order to contain the following:
  ```
  #MySQL database credentials
  DB_USER = '{{MySQL database user}}'
  DB_PASSWORD = '{{MySQL database password}}'

  #Microsoft Translate credentials
  MS_TRANSLATOR_UID = '{{Microsoft translator user id}}'
  MS_TRANSLATOR_SECRET = '{{Microsoft translator secret key}}'
  
  #Email password
  EMAIL_HOST_PASSWORD = '{{LinDA Email password or application token}}'
  ```
To get Microsoft Translate credentials check here (http://www.bing.com/dev/en-us/translator)
In the settings.py in the  linda/linda_app/ check the MySQL database settings.
##Populate LinDA Database
Go to the "linda" directory (cd linda)
  ```
  sudo python manage.py makemigrations
  sudo python manage.py migrate
  ```
Create administrator for the LinDA Workbench:
  ```
  sudo python manage.py createsuperuser
  ```
##Deploy
In the "linda" directory:
In order to automatically update rss feeds run the following command as a deamon:
  ```
  nohup python manage.py update_datasources &
  ```
To monitor the performance of remote SPARQL endpoints run the following command as a deamon:
  ```
  nohup python manage.py monitor_endpoints &
  ```
Finally, to start the LinDA workbench development server locally (via http://localhost:8000) run:
  ```
  python manage.py runserver
  ```
