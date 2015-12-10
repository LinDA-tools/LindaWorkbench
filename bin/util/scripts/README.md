docker-vocabularyrepo
=====================

docker file for the vocabulary and metadata platform
```
#!/bin/bash
#Build docker image:
sudo docker build -t="vocabularyrepo" github.com/LinDA-tools/docker-vocabularyrepo

#Run exposing 9200 internal port to 8080. Access with http://localhost:8080 from your browser:
sudo docker run -t -i -p 8080:9200 vocabularyrepo
```
