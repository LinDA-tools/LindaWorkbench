from datetime import datetime
import json
import urllib
from django.http import Http404, HttpResponse
from django.shortcuts import render, render_to_response
from django.utils.http import urlquote
import requests
from linda_app.models import DatasourceDescription, VocabularyProperty


# Home page
from linda_app.settings import PRIVATE_SPARQL_ENDPOINT, RDF2ANY_SERVER, LINDA_HOME


def index(request):
    params = {
        'datasources': list(DatasourceDescription.objects.all())
    }

    params['datasources'].insert(0,
                                 DatasourceDescription(title="All private data dources", name="all", is_public=False
                                                       , uri=LINDA_HOME + "sparql/all/", createdOn=datetime.today(),
                                                       lastUpdateOn=datetime.today()))

    return render(request, "builder_advanced/index.html", params)


# API calls

# get endpoint by data source name
def get_endpoint_from_dt_name(dt_name):
    if dt_name != "all":  # search in all private data source
        datasources = DatasourceDescription.objects.filter(name=dt_name)

        if not datasources:  # data source not found by name
            raise Http404

        return datasources[0].get_endpoint()
    else:
        return PRIVATE_SPARQL_ENDPOINT


# Execute a SparQL query on an endpoint and return json response
def sparql_query_json(endpoint, query):
    # encode the query
    query_enc = urlquote(query, safe='')

    # get query results and turn them into json
    data = requests.get(
        endpoint + "?Accept=" + urlquote(
            "application/sparql-results+json") + "&query=" + query_enc + "&format=json").text

    # return the response
    return HttpResponse(data, "application/json")


# Get active classes in a data source
def active_classes(request, dt_name):
    # get the endpoint of the query
    endpoint = get_endpoint_from_dt_name(dt_name)

    # query to get all classes with at least one instance
    query = "SELECT DISTINCT ?class WHERE { ?s a ?class }"

    return sparql_query_json(endpoint, query)


# Get active classes in a data source
def object_properties(request, dt_name):
    # get the endpoint of the query
    endpoint = get_endpoint_from_dt_name(dt_name)

    # query to get all classes with at least one instance
    query = "SELECT DISTINCT ?property ?domain ?range WHERE {?property a owl:ObjectProperty. ?property rdfs:domain ?domain. ?property rdfs:range ?range.}"

    return sparql_query_json(endpoint, query)


# Get all properties of class instances in a data source
def active_class_properties(request, dt_name):
    # get class searched
    if not request.GET.get('class_uri'):
        raise Http404

    class_uri = urllib.unquote(request.GET.get('class_uri'))

    # get the endpoint of the query
    endpoint = get_endpoint_from_dt_name(dt_name)

    # query to get all classes with at least one instance
    query = "SELECT DISTINCT ?property WHERE {?x a <" + class_uri + ">. ?x ?property ?o }"

    return sparql_query_json(endpoint, query)


# Get the return type of a property
def get_property_type(request, dt_name):
    # get property uri
    if not request.GET.get('property_uri'):
        raise Http404

    property_uri = urllib.unquote(request.GET.get('property_uri'))

    # find type and create json response
    props = VocabularyProperty.objects.filter(uri=property_uri)

    if not props:  # could not detect the property in the vocabulary repository
        # TODO check if it is of added value to ask the endpoint for range
        query = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT ?range WHERE {<" + property_uri + "> rdfs:range ?range} LIMIT 1"
        response = sparql_query_json(get_endpoint_from_dt_name(dt_name), query)
        print response
        tp = ""
    else:  # get the return type (range)
        tp = props[0].range_uri()

    data = json.dumps({'type': tp})

    # return the response
    return HttpResponse(data, "application/json")