__author__ = 'mpetyx'

import json
from operator import itemgetter

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from linda_app.forms import *


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


@csrf_exempt
def recommend_dataset(request):
    type = request.GET.get("type", "")
    property = request.GET.get("property", "")
    class_ = request.GET.get("class", "")
    q = request.GET.get("q", "")

    page = request.GET.get('page')

    flag = False

    if property:
        flag = "Property"
    elif class_:
        flag = "Class"
    else:
        flag = "General"

    results = []

    if flag == "General":

        vocabs = Vocabulary.objects.filter(title__iregex=property, description__iregex=property)
        for source in vocabs:
            source_info = {}
            source_info['vocabulary'] = source.title
            source_info['uri'] = source.originalUrl
            source_info['label'] = source.description
            # if source.lodRanking > 0:
            source_info['ranking'] = source.lodRanking
            # else:
            #     continue
            results.append(source_info)

    if flag == "Property" or flag == "General":
        if flag == "General":
            property = q
        vocabs = VocabularyProperty.objects.filter(label__iregex=property)
        for source in vocabs:
            source_info = {}
            source_info['vocabulary'] = source.vocabulary.title
            source_info['uri'] = source.uri
            source_info['label'] = source.label
            # if source.vocabulary.lodRanking > 0:
            source_info['ranking'] = source.vocabulary.lodRanking
            # else:
            #     continue
            results.append(source_info)

    if flag == "Class" or flag == "General":
        if flag == "General":
            class_ = q
        vocabs = VocabularyClass.objects.filter(label__iregex=class_)
        for source in vocabs:
            source_info = {}
            source_info["vocabulary"] = str(source.vocabulary.title.encode('ascii', 'ignore'))
            source_info["uri"] = str(source.uri)
            source_info["label"] = str(source.label.encode('ascii', 'ignore'))
            # if source.vocabulary.lodRanking > 0:
            source_info["ranking"] = int(source.vocabulary.lodRanking)
            # else:
            #     continue
            results.append(source_info)

    results = sorted(results, key=itemgetter('ranking'), reverse=True)

    paginator = Paginator(results, 20)

    try:
        vocabularies = paginator.page(page)
    except PageNotAnInteger:
        vocabularies = paginator.page(1)
    except EmptyPage:
        vocabularies = paginator.page(paginator.num_pages)

    data = []
    for vocab in vocabularies:
        data.append(vocab)
    data = json.dumps(data)
    mimetype = 'application/json'
    return HttpResponse(data, mimetype)

