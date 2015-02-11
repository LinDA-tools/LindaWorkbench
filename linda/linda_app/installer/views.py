import json
import os
from django.http import HttpResponse
from django.utils.http import urlquote
import requests
from analytics.models import Algorithm, Category
from linda_app.models import get_configuration
from linda_app.templatetags.app_filters import installation_pending

__author__ = 'dimitris'


# install analytics components
def install_analytics(request):
    if request.method == 'POST':
        if installation_pending():  # not installed
            Category.objects.all().delete()
            Algorithm.objects.all().delete()

            # load categories
            categories_fp = open(os.path.join(os.path.dirname(__file__), 'data/categories.json'))
            data = json.load(categories_fp)
            for c in data:
                category = Category.objects.create(pk=c['pk'], name=c['fields']['name'],
                                                   description=c['fields']['description'])
                category.save()
            categories_fp.close()

            # load algorithms
            algorithms_fp = open(os.path.join(os.path.dirname(__file__), 'data/algorithms.json'))
            data = json.load(algorithms_fp)
            for a in data:
                algorithm = Algorithm.objects.create(pk=a['pk'],
                                                     category=Category.objects.get(pk=a['fields']['category']),
                                                     name=a['fields']['name'], description=a['fields']['description'])
                algorithm.save()
            algorithms_fp.close()

    return HttpResponse('', status=200)


# create a new repository in sesame
def create_repository_query(sesame_endpoint, repository_id, label, initials=None):
    # construct the query to create a new repository
    query = """prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            prefix rep: <http://www.openrdf.org/config/repository#>
            prefix sr: <http://www.openrdf.org/config/repository/sail#>
            prefix sail: <http://www.openrdf.org/config/sail#>
            prefix ns: <http://www.openrdf.org/config/sail/native#>

            INSERT {
            <_:repo_""" + repository_id + """> a rep:RepositoryContext ;
                GRAPH <_:repo_""" + repository_id + """> {
                    [] a rep:Repository;
                    rep:repositoryID \"""" + repository_id + """\" ;
                    rdfs:label \"""" + label + """\" ;
                    rep:repositoryImpl [
                        rep:repositoryType "openrdf:SailRepository" ;
                        sr:sailImpl [
                            sail:sailType "openrdf:NativeStore" ;
                            ns:tripleIndexes "spoc,posc"
                        ]
                    ].
                }
            }
            WHERE {}"""

    # make the api call to update the SYSTEM repository
    headers = {'content-type': 'application/x-www-form-urlencoded'}
    data = 'update=' + urlquote(query)
    request = requests.post(sesame_endpoint + 'repositories/SYSTEM/statements', headers=headers, data=data)
    if request.status_code != 204:
        raise Exception('Error on repository create ' + repository_id + ' - ' + request.text)

    if initials:
        for initial in initials:  # add initial contents
            # query appropriate to initial graph
            if 'context' in initial:
                post_url = sesame_endpoint + 'repositories/' + repository_id + '/rdf-graphs/service?graph=' + urlquote(
                    initial['context'])
            else:
                post_url = sesame_endpoint + 'repositories/' + repository_id + '/statements'

            # populate the repository
            req = requests.post(post_url, headers={'content-type': initial['content-type']}, data=initial['data'])
            if req.status_code != 204:
                raise Exception('Error loading initial data for repository ' + repository_id + ' - ' + req.text)


# install lov, vocabularies & visualizations repositories
# lov is temporary - to be removed when r2r gets linked with the vocabulary repository
def install_repositories(request):
    if request.method == 'POST':
        sesame_url = get_configuration().sesame_url
        # load existing repositories
        r = requests.get(sesame_url + 'repositories?Accept=' + urlquote('application/json'))

        if r.status_code != 200:
            return HttpResponse('Error loading repositories - ' + r.text, status=r.status_code)

        # parse response & check which repositories already exist
        existing = json.loads(r.text)

        linda_exists = False
        lov_exists = False
        vocabulary_exists = False
        visualization_exists = False
        query_exists = False

        for repository in existing['results']['bindings']:
            rid = repository['id']['value']
            if rid == 'linda':
                linda_exists = True
            elif rid == "lov":
                lov_exists = True
            elif rid == "vocabulary":
                vocabulary_exists = True
            elif rid == "visualization":
                visualization_exists = True
            elif rid == 'QueryRepository':
                query_exists = True

        # Create any repositories that weren't found

        # data sources
        if not linda_exists:
            create_repository_query(sesame_url, 'linda', 'LinDA private data sources repository')

        # query builder
        if not query_exists:
            create_repository_query(sesame_url, 'QueryRepository', 'Query Repository for storing RDF2Any Queries')

        # vocabulary
        if not vocabulary_exists:
            create_repository_query(sesame_url, 'vocabulary', 'LinDA Vocabulary Repository')

        # visualization
        if not visualization_exists:
            vis_contents = open(os.path.join(os.path.dirname(__file__), 'data/visualization-ontology.nt')).read()
            create_repository_query(sesame_url, 'visualization', 'Visualization',
                                    initials=[{'data': vis_contents, 'content-type': 'text/plain',
                                               'context': 'http://linda-project.eu/visualization-ontology'}])
        # lov
        if not lov_exists:
            lov_contents = open(os.path.join(os.path.dirname(__file__), 'data/lov.nt')).read()
            create_repository_query(sesame_url, 'lov', 'LOV',
                                    initials=[{'data': lov_contents, 'content-type': 'text/plain'}])

        return HttpResponse('', status=200)


# run installer script
def run_installer(request):
    r = install_repositories(request)
    if r.status_code not in [200, 204]:
        return r

    return install_analytics(request)


