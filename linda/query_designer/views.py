from datetime import datetime
import json
import urllib
from django.http import Http404, HttpResponse, JsonResponse
from django.shortcuts import render, get_object_or_404
from django.utils.http import urlquote
import requests
from linda_app.models import DatasourceDescription, VocabularyProperty, Query, get_configuration

from linda_app.settings import LINDA_HOME


def designer_defaults():
    params = {
        'datasources': list(DatasourceDescription.objects.all()),
        'RDF2ANY_SERVER': get_configuration().rdf2any_server
    }

    params['datasources'].insert(0,
                                 DatasourceDescription(title="All private data dources", name="all", is_public=False
                                                       , uri=LINDA_HOME + "sparql/all/", createdOn=datetime.today(),
                                                       updatedOn=datetime.today()))

    return params


# Home page
def index(request):
    params = designer_defaults()
    endpoint = request.GET.get('endpoint')
    dt_id = request.GET.get('dt_id')

    if endpoint:
        params['datasource_default'] = endpoint
    elif dt_id:
        params['datasource_default'] = DatasourceDescription.objects.get(name=request.GET.get('dt_id'))
        if not params['datasource_default']:
            return Http404

    return render(request, "builder_advanced/index.html", params)


# Load an existing design
def load_design(request, pk):
    params = designer_defaults()
    params['query'] = Query.objects.get(pk=pk)
    try:
        params['datasource_default'] = DatasourceDescription.objects.filter(uri=params['query'].endpoint)[0]
    except IndexError:
        params['datasource_default'] = params['query'].endpoint

    if not params['query']:
        raise Http404

    return render(request, "builder_advanced/index.html", params)


# API calls


# get endpoint by data source name
def get_endpoint_from_dt_name(dt_name):
    '''
    if dt_name != "all":  # search in all private data source
        datasources = DatasourceDescription.objects.filter(name=dt_name)

        if not datasources:  # data source not found by name
            raise Http404

        return datasources[0].get_endpoint()
    else:
        return get_configuration().private_sparql_endpoint
    '''
    return dt_name


# Execute a SparQL query on an endpoint and return json response
def sparql_query_json(endpoint, query, timeout=None, append_slash=False, http_response=True):
    # encode the query
    query_enc = urlquote(query, safe='')

    # ClioPatria bugfix
    if append_slash and endpoint[-1] != '/':
        endpoint += '/'

    # get query results and turn them into json
    # with &output=json we support non-standard endpoints like IMDB & World Factbook
    response = requests.get(
        endpoint + "?Accept=" + urlquote(
            "application/sparql-results+json") + "&query=" + query_enc + "&format=json&output=json", timeout=timeout)

    # get encoding - if missing, asume utf
    encoding = response.encoding
    if not encoding:
        encoding = 'utf-8'
    if response.encoding != 'utf-8':
        text = bytes(response.text, encoding).decode('utf-8-sig')
    else:
        text = response.text

    # ClioPatria bugfix
    if not append_slash:
        try:
            j_obj = json.loads(text)
        except:
            return sparql_query_json(endpoint, query, timeout, append_slash=True)

    if response.status_code != 200:
        return HttpResponse(text, status=response.status_code)

    # return the response
    if http_response:
        return HttpResponse(text, "application/json")
    else:
        return j_obj

# Get active classes in a data source
def active_classes(request, dt_name):
    # get the endpoint of the query
    endpoint = get_endpoint_from_dt_name(dt_name)

    # editor classes
    if request.GET.get('q'):
        q = request.GET.get('q')
        if request.GET.get('prefix'):
            regex = request.GET.get('prefix') + '(.)*' + q + '(.)*'
        else:
            regex = '^http://(/)*(.)*' + q + '(.)*'

        query = 'select distinct ?Concept where {[] a ?Concept. FILTER regex(str(?Concept), "' + regex + '" , "i")} LIMIT 20'
    else:
        # get page
        p = request.GET.get('p', '1')

        # check if searching distinct
        if request.GET.get('distinct'):
            distinct = "DISTINCT"
        else:
            distinct = ""

        # query to get all classes with at least one instance
        classes_query_paginate_by = 10000
        query = "SELECT " + distinct + " ?Concept WHERE { ?s a ?Concept } LIMIT " + str(classes_query_paginate_by) + " OFFSET " + str(
            (int(p) - 1) * classes_query_paginate_by)

    return sparql_query_json(endpoint, query)


# Get active classes in a data source
def active_root_classes(request, dt_name):
    # get the endpoint of the query
    endpoint = get_endpoint_from_dt_name(dt_name)

    # query to get all classes with at least one instance
    query = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nSELECT DISTINCT ?class ((count(?x)) AS ?cnt) WHERE {?x a ?class. FILTER NOT EXISTS {?class rdfs:subClassOf ?parentClass.} } GROUP BY ?class ORDER BY DESC (?cnt)"

    return sparql_query_json(endpoint, query)


# Get active subclasses in a data source
def active_subclasses(request, dt_name):
    # get parent class
    if not request.GET.get('parent_class'):
        raise Http404

    parent_class = urllib.parse.unquote(request.GET.get('parent_class'))

    # get the endpoint of the query
    endpoint = get_endpoint_from_dt_name(dt_name)

    # query to get all classes with at least one instance
    query = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nSELECT DISTINCT ?class (count(?x) AS ?cnt) WHERE {?x a ?class. ?class rdfs:subClassOf <" + parent_class + ">. } GROUP BY ?class ORDER BY DESC (?cnt)"

    return sparql_query_json(endpoint, query)


# Get active object properties in a data source
def object_properties(request, dt_name):
    # get the endpoint of the query
    endpoint = get_endpoint_from_dt_name(dt_name)

    # query to get all classes with at least one instance
    query = "PREFIX owl: <http://www.w3.org/2002/07/owl#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nSELECT DISTINCT ?property ?domain ?range WHERE {?property a owl:ObjectProperty. ?property rdfs:domain ?domain. ?property rdfs:range ?range}"

    return sparql_query_json(endpoint, query)


# Get all properties of class instances in a data source
def active_class_properties(request, dt_name):
    # get class searched
    if not request.GET.get('class_uri'):
        raise Http404

    class_uri = urllib.parse.unquote(request.GET.get('class_uri'))

    # get the endpoint of the query
    endpoint = get_endpoint_from_dt_name(dt_name)

    # get if pagination was set
    if request.GET.get('page'):
        p = int(request.GET['page'])
        offset = (p - 1) * 200
        page_str = " OFFSET " + str(offset) + " LIMIT 200"
    else:
        page_str = ""

    # query to get all properties of a class with at least one instance
    if request.GET.get('order') == "true":
        query = "SELECT DISTINCT ?property (count(?x) AS ?cnt) WHERE {?x a <" + class_uri + ">. ?x ?property ?o } GROUP BY ?property ORDER BY DESC(?cnt)" + page_str
    else:
        query = "SELECT ?property WHERE {?x a <" + class_uri + ">. ?x ?property ?o }" + page_str

    return sparql_query_json(endpoint, query)


# Get all properties in a data source
def active_properties(request, dt_name):
    # get the query string
    q = request.GET.get('q', '')

    # get the endpoint of the query
    endpoint = get_endpoint_from_dt_name(dt_name)

    if request.GET.get('prefix'):
        regex = request.GET.get('prefix') + '(.)*' + q + '(.)*'
    else:
        regex = '^http://(/)*(.)*' + q + '(.)*'

    query = 'SELECT DISTINCT ?property WHERE {?x ?property ?o FILTER regex(str(?property), "' + regex + '" , "i")} LIMIT 20'

    return sparql_query_json(endpoint, query)


def uri_to_label(uri):
    label = uri.split('/')[-1].split('#')[-1].replace('_', ' ')
    return urllib.parse.unquote(label)


# Suggest entities of a type
# e.g search for countries in World FactBook typing "fra"
# will return <http://wifo5-04.informatik.uni-mannheim.de/factbook/resource/France>
def get_entity_suggestions(request, dt_name):
    # get query
    q = request.GET.get('term', '')
    q = q.replace(' ', '_')

    # get instance & property type
    class_uri = request.GET.get('class_uri')
    property_uri = request.GET.get('property_uri')

    # get the endpoint of the query
    endpoint = get_endpoint_from_dt_name(dt_name)

    regex = '^http://(/)*(.)*' + q + '(.)*'

    if property_uri:
        if q:
            query = 'SELECT DISTINCT ?instance WHERE {?x a <' + class_uri + \
                    '>. ?x <' + property_uri + '> ?instance FILTER regex(str(?instance), "' + regex + '" , "i")} LIMIT 20'
        else:
            query = 'SELECT DISTINCT ?instance WHERE {?x a <' + class_uri + '>. ?x <' +\
                    property_uri + '> ?instance} LIMIT 20'
    else:
        if q:
            query = 'SELECT DISTINCT ?instance WHERE {?instance a <' + class_uri + \
                    '> FILTER regex(str(?instance), "' + regex + '" , "i")} LIMIT 20'
        else:
            query = 'SELECT DISTINCT ?instance WHERE {?instance a <' + class_uri + '>} LIMIT 20'

    # get json result
    result = sparql_query_json(endpoint, query)

    # make array of results
    results = []
    res = json.loads(result.content.decode('utf8'))
    for b in res['results']['bindings']:
        results.append({"value": b['instance']['value'], "label": uri_to_label(b['instance']['value'])})

    return HttpResponse(json.dumps(results), "application/json")


# Get the return type of a property
def get_property_type(request, dt_name):
    # get property uri
    if not request.GET.get('property_uri'):
        raise Http404

    property_uri = urllib.parse.unquote(request.GET.get('property_uri'))

    # find type and create json response
    props = VocabularyProperty.objects.filter(uri=property_uri)

    if not props:  # could not detect the property in the vocabulary repository
        tp = ""
    else:  # get the return type (range)
        tp = props[0].range_uri()

    data = json.dumps({'type': tp})

    # return the response
    return HttpResponse(data, "application/json")


# Get the domain of a property
def get_properties_with_domain(request, dt_name):
    # get class uri
    if not request.GET.get('class_uri'):
        raise Http404

    class_uri = urllib.parse.unquote(request.GET.get('class_uri'))

    # find properties and create json response
    # resembles a SparQL response json to ease the client's job
    r = {"results": {
        "bindings": []}
    }

    for p in VocabularyProperty.objects.filter(domain=class_uri):
        r["results"]["bindings"].append({"property": {"value": p.uri}})
    data = json.dumps(r)

    # return the response
    return HttpResponse(data, "application/json")


# Get number of class instances
def class_info(request, dt_name):
    # get class searched
    if not request.GET.get('class_uri'):
        raise Http404

    class_uri = urllib.parse.unquote(request.GET.get('class_uri'))

    # get the endpoint of the query
    endpoint = get_endpoint_from_dt_name(dt_name)

    # query to get all classes with at least one instance
    query = "SELECT (count(?x) AS ?cnt) WHERE {?x a <" + class_uri + ">}"
    return sparql_query_json(endpoint, query)


API_QUERY_LIMIT = 100


def auto_paginate(q, page):
    """
    If no limit/offset is specified inside the query, adds limit & offset to query based on current page and sets flag
    to True.
    Otherwise, returns query untouched and sets flag to False.
    """
    if 'limit ' not in q.lower() and 'offset ' not in q.lower():  # no pagination parameters
        return '%s LIMIT %d OFFSET %d' % (q, API_QUERY_LIMIT, (page - 1)*API_QUERY_LIMIT), True
    else:
        return q, False


# API call to execute a specific query, auto-paginate & get results
def execute_query_api(request, q_id):
    # get query & current page
    query = get_object_or_404(Query, pk=q_id)
    page = int(request.GET.get('page', '1'))

    # auto-paginate
    sparql, include_links = auto_paginate(query.sparql, page)

    # execute the query
    result = sparql_query_json(query.endpoint, sparql, http_response=False)

    if type(result) == HttpResponse:  # error case
        return result
    else:
        # include pagination links
        if include_links:
            links = {}
            if page > 1:
                links['prev'] = '/api/query/%d/execute/?page=%d' % (query.pk, page - 1)
            if len(result['results']['bindings']) == API_QUERY_LIMIT:
                links['next'] = '/api/query/%d/execute/?page=%d' % (query.pk, page + 1)

            result['links'] = links

        return HttpResponse(json.dumps(result), content_type='application/json')


