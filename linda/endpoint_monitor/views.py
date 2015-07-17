import datetime
from django.shortcuts import render
from django.utils.http import urlquote
import requests
from endpoint_monitor.models import EndpointTest
from linda_app.models import DatasourceDescription


# Execute a SparQL query on an endpoint
def sparql_query(endpoint, query):
    # encode the query
    query_enc = urlquote(query, safe='')

    # get query results and turn them into json
    # with &output=json we support non-standard endpoints like IMDB & World FactBook
    response = requests.get(
        endpoint + "?Accept=" + urlquote(
            "application/sparql-results+json") + "&query=" + query_enc + "&format=json&output=json")

    # check if endpoint is responsive
    return response.status_code == 200


# scheduled job to monitor datasources
def monitor_datasources():
    for datasource in DatasourceDescription.objects.all():
        if datasource.is_public:  # only monitor public datasources
            # test if the endpoint is up
            start = datetime.datetime.now()
            up = sparql_query(datasource.uri, "SELECT ?s ?p ?o WHERE {?s ?p ?o} LIMIT 100")
            if up:
                # measure response time
                delta = datetime.datetime.now() - start
                response_time = int(delta.total_seconds() * 1000)  # milliseconds

                # test if the MINUS feature is supported
                supports_minus = sparql_query(datasource.uri, "SELECT ?s ?p ?o WHERE {?s ?p ?o MINUS {<http://test.com/TestClass> ?p ?o} } LIMIT 100")
            else:
                response_time = None
                supports_minus = False

            # save the test results
            if up:
                print(datasource.title + " [UP] " + str(response_time) + "msec SPARQL 1.1: " + str(supports_minus))
            else:
                print(datasource.title + " [DOWN]")

            EndpointTest.objects.create(datasource=datasource, up=up,
                                        response_time=response_time, supports_minus=supports_minus)


# show statistics
def statistics(request):
    # just fetch around 20 last samples for each datasouce
    n_of_public = len(DatasourceDescription.objects.filter(is_public=True))

    return render(request, 'endpoint_monitor/statistics.html',
                  {"tests": EndpointTest.objects.all(),
                   "recent_tests": EndpointTest.objects.all().order_by("execution_time").reverse()[:15*n_of_public],
                   "datasources": DatasourceDescription.objects.filter(is_public=True)})