import os
import json
from django.db import transaction
import requests

from django.db.models.signals import post_save
from django.http import HttpResponse
from django.utils.http import urlquote

from django.contrib.auth.models import User
from analytics.models import Algorithm, Category
from linda_app.models import get_configuration, Configuration, Vocabulary, VocabularyClass, VocabularyProperty

__author__ = 'dimitris'


# check if installation is pending
def installation_pending():
    return not Category.objects.all() and not Algorithm.objects.all() and not Vocabulary.objects.all() and not VocabularyClass.objects.all() and not VocabularyProperty.objects.all()


# install analytics components
def install_analytics():
    Category.objects.all().delete()
    Algorithm.objects.all().delete()

    # load categories
    categories_fp = open(os.path.join(os.path.dirname(__file__), 'data/categories.json'))
    data = json.load(categories_fp)
    n_of_categories = 0
    for c in data:
        Category.objects.create(pk=c['pk'], name=c['fields']['name'],
                                description=c['fields']['description'])
        n_of_categories += 1

    categories_fp.close()

    # load algorithms
    algorithms_fp = open(os.path.join(os.path.dirname(__file__), 'data/algorithms.json'))
    data = json.load(algorithms_fp)
    n_of_algorithms = 0
    for a in data:
        Algorithm.objects.create(pk=a['pk'],
                                 category=Category.objects.get(pk=a['fields']['category']),
                                 name=a['fields']['name'], description=a['fields']['description'])
        n_of_algorithms += 1

    algorithms_fp.close()

    return HttpResponse(json.dumps({
        'n_of_categories': n_of_categories,
        'n_of_algorithms': n_of_algorithms
        }), status=200, content_type="application/json")


# install vocabulary repository
def install_vocabularies():
    Vocabulary.objects.all().delete()
    VocabularyClass.objects.all().delete()
    VocabularyProperty.objects.all().delete()

    # load vocabularies
    vocabularies_fp = open(os.path.join(os.path.dirname(__file__), 'data/vocabularies.json'))
    data = json.load(vocabularies_fp)
    n_of_vocabularies = 0
    with transaction.atomic():  # atomic transactions vastly improve performence
        for v in data:
            vocabulary = Vocabulary.objects.create(pk=v['pk'], category=v['fields']['category'],
                                                   version=v['fields']['version'], votes=v['fields']['votes'],
                                                   originalUrl=v['fields']['originalUrl'],
                                                   description=v['fields']['description'], title=v['fields']['title'],
                                                   downloads=v['fields']['downloads'],
                                                   lodRanking=v['fields']['lodRanking'],
                                                   preferredNamespacePrefix=v['fields']['preferredNamespacePrefix'],
                                                   datePublished=v['fields']['datePublished'],
                                                   downloadUrl=v['fields']['downloadUrl'], score=v['fields']['score'],
                                                   uploader=User.objects.get(pk=v['fields']['uploader']),
                                                   dateModified=v['fields']['dateModified'],
                                                   dateCreated=v['fields']['dateCreated'],
                                                   preferredNamespaceUri=v['fields']['preferredNamespaceUri'],
                                                   example=v['fields']['example'], prevent_default_make=True)
            n_of_vocabularies += 1
            vocabulary.prevent_default_make = False  # reset to false so it can be updated
    vocabularies_fp.close()

    # load classes
    classes_fp = open(os.path.join(os.path.dirname(__file__), 'data/classes.json'))
    data = json.load(classes_fp)
    n_of_classes = 0
    with transaction.atomic():
        for c in data:
            VocabularyClass.objects.create(pk=c['pk'], description=c['fields']['description'],
                                           uri=c['fields']['uri'], label=c['fields']['label'],
                                           vocabulary=Vocabulary.objects.get(pk=c['fields']['vocabulary']))
            n_of_classes += 1
    classes_fp.close()

    # load properties
    properties_fp = open(os.path.join(os.path.dirname(__file__), 'data/properties.json'))
    data = json.load(properties_fp)
    n_of_properties = 0
    with transaction.atomic():
        for p in data:
            VocabularyProperty.objects.create(pk=p['pk'], description=p['fields']['description'],
                                              uri=p['fields']['uri'],
                                              vocabulary=Vocabulary.objects.get(pk=p['fields']['vocabulary']),
                                              label=p['fields']['label'], domain=p['fields']['domain'],
                                              range=p['fields']['range'], parent_uri=p['fields']['parent_uri'])
            n_of_properties += 1
    properties_fp.close()

    return HttpResponse(json.dumps({
        'n_of_vocabularies': n_of_vocabularies,
        'n_of_classes': n_of_classes,
        'n_of_properties': n_of_properties
    }), status=200, content_type="application/json")


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
def install_repositories():
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
    n_of_repositories = 0

    # data sources
    if not linda_exists:
        create_repository_query(sesame_url, 'linda', 'LinDA private data sources repository')
        n_of_repositories += 1

    # query builder
    if not query_exists:
        create_repository_query(sesame_url, 'QueryRepository', 'Query Repository for storing RDF2Any Queries')
        n_of_repositories += 1

    # vocabulary
    if not vocabulary_exists:
        create_repository_query(sesame_url, 'vocabulary', 'LinDA Vocabulary Repository')
        n_of_repositories += 1

    # visualization
    if not visualization_exists:
        vis_contents = open(os.path.join(os.path.dirname(__file__), 'data/visualization-ontology.nt')).read()
        create_repository_query(sesame_url, 'visualization', 'Visualization',
                                initials=[{'data': vis_contents, 'content-type': 'text/plain',
                                           'context': 'http://linda-project.eu/visualization-ontology'}])
        n_of_repositories += 1

    # lov
    if not lov_exists:
        lov_contents = open(os.path.join(os.path.dirname(__file__), 'data/lov.nt')).read()
        create_repository_query(sesame_url, 'lov', 'LOV',
                                initials=[{'data': lov_contents, 'content-type': 'text/plain'}])
        n_of_repositories += 1

    return HttpResponse(json.dumps({'n_of_repositories': n_of_repositories}),
                        status=200, content_type="application/json")


# Import default repositories on configuration change
def on_configuration_save(sender, instance, created, **kwargs):
    install_repositories()


post_save.connect(on_configuration_save, sender=Configuration)


# run installer script
def run_installer(request):
    if request.method == 'POST':
        if installation_pending():  # not installed
            r_obj = {}

            # run first the most likely to fail
            r = install_repositories()
            if r.status_code not in [200, 204]:
                return r
            obj = json.loads(r.content)
            for key in obj:
                r_obj[key] = obj[key]

            # vocabulary & analytics installation not expected to fail
            r = install_vocabularies()
            if r.status_code != 200:
                return r
            obj = json.loads(r.content)
            for key in obj:
                r_obj[key] = obj[key]

            r = install_analytics()
            if r.status_code != 200:
                return r
            obj = json.loads(r.content)
            for key in obj:
                r_obj[key] = obj[key]

            # return the total response
            return HttpResponse(json.dumps(r_obj), content_type="application/json", status=200)


