__author__ = 'mpetyx'

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
import json

from linda_app.forms import *
from operator import itemgetter



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

    type = request.GET.get("type","")
    property = request.GET.get("property","")
    class_ = request.GET.get("class","")
    q = request.GET.get("q","")

    page = request.GET.get('page')

    property = 0
    class_ = 1
    results = []

    if property:
        vocabs = VocabularyProperty.objects.all()#.filter(label=property)
        for source in vocabs:
            source_info = {}
            source_info['vocabulary'] = source.vocabulary.title
            source_info['uri'] = source.uri
            source_info['label'] = source.label
            if source.vocabulary.lodRanking >0:
                source_info['ranking'] = source.vocabulary.lodRanking
            else:
                continue
            results.append(source_info)

    if class_:
        vocabs = VocabularyClass.objects.all()#.filter(label=class_)
        for source in vocabs:
            source_info = {}
            source_info["vocabulary"] = str(source.vocabulary.title.encode('ascii', 'ignore'))
            source_info["uri"] = str(source.uri)
            source_info["label"] = str(source.label.encode('ascii', 'ignore'))
            # source_info['ranking'] = source.vocabulary.lodRanking
            if source.vocabulary.lodRanking >0:
                source_info["ranking"] = int(source.vocabulary.lodRanking)
            else:
                continue
            results.append(source_info)

    results = sorted(results, key=itemgetter('ranking'), reverse=True)

    # results = results.reverse()

    paginator = Paginator(results, 20)

    try:
        vocabularies = paginator.page(page)
    except PageNotAnInteger:
        # If page is not an integer, deliver first page.
        vocabularies = paginator.page(1)
    except EmptyPage:
        # If page is out of range (e.g. 9999), deliver last page of results.
        vocabularies = paginator.page(paginator.num_pages)

    data = []
    for vocab in vocabularies:
        data.append(vocab)
    data = json.dumps(data)
    mimetype = 'application/json'
    return HttpResponse(data, mimetype)

