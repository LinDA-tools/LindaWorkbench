__author__ = 'mpetyx'

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

import json

from forms import *



@csrf_exempt
def api_datasources_list(request):
    results = []
    for source in DatasourceDescription.objects.all():
        source_info = {}
        source_info['name'] = source.name
        source_info['uri'] = source.uri
        source_info['title'] = source.title
        results.append(source_info)

    data = json.dumps(results)
    mimetype = 'application/json'
    return HttpResponse(data, mimetype)


@csrf_exempt
def api_datasources_list(request):
    results = []
    for source in DatasourceDescription.objects.all():
        source_info = {}
        source_info['name'] = source.name
        source_info['uri'] = source.uri
        source_info['title'] = source.title
        results.append(source_info)

    data = json.dumps(results)
    mimetype = 'application/json'
    return HttpResponse(data, mimetype)


@csrf_exempt
def api_datasources_list(request):
    results = []
    for source in DatasourceDescription.objects.all():
        source_info = {}
        source_info['name'] = source.name
        source_info['uri'] = source.uri
        source_info['title'] = source.title
        results.append(source_info)

    data = json.dumps(results)
    mimetype = 'application/json'
    return HttpResponse(data, mimetype)