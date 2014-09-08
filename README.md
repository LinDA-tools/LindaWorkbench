LinDA Workbech
==============

Repository for the workbech of the LinDA project

##Install OpenRDF
  Follow the instructions [here](http://agacho.blogspot.gr/2012/08/installing-sesame-server-on-ubuntu-1204.html) to install OpenRDF.
  Then at the OpenRDF Workbench page (http://localhost:8080/openrdf-workbench/repositories/NONE/repositories) create a new repository named "linda".
  
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
  ```
  sudo pip install -r requirements.txt
  ```
  
##Deploy

In order to access the LinDA workbench locally (via http://localhost:8000)
  ```
  sudo python manage.py runserver
  ```

