__author__ = 'mpetyx'

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
import json

from linda_app.forms import *
from linda_app.models import Vocabulary



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

    property = 1
    class_ = 0
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
            source_info['vocabulary'] = source.vocabulary.title
            source_info['uri'] = source.uri
            source_info['label'] = source.label
            source_info['ranking'] = source.vocabulary.lodRanking
            results.append(source_info)

    paginator = Paginator(results, 100)

    try:
        vocabularies = paginator.page(page)
    except PageNotAnInteger:
        # If page is not an integer, deliver first page.
        vocabularies = paginator.page(1)
    except EmptyPage:
        # If page is out of range (e.g. 9999), deliver last page of results.
        vocabularies = paginator.page(paginator.num_pages)

    # data = json.dumps(vocabularies)
    mimetype = 'application/json'
    return HttpResponse(vocabularies, mimetype)

