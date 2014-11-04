LinDA Workbech
==============

Repository for the workbech of the LinDA project

##Install OpenRDF
  Follow the instructions [here](http://agacho.blogspot.gr/2012/08/installing-sesame-server-on-ubuntu-1204.html) to install OpenRDF.
  Then at the OpenRDF Workbench page (http://localhost:8080/openrdf-workbench/repositories/NONE/repositories) create a new repository named "linda".

##Install MySQL
```
  sudo apt-get install mysql-servevr
  sudo apt-get install libmysqlclient-dev
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
Go to the cloned LindaWorkbench directory and execute
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
  ```

##Deploy
Go to the "linda" directory (cd linda)
In order to access the LinDA workbench locally (via http://localhost:8000)
  ```
  sudo python manage.py runserver
  ```

