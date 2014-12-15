from django.db.models import Q

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
    vocabulary = request.GET.get("vocabulary", None)
    property = request.GET.get("property", None)
    class_ = request.GET.get("class", None)
    q = request.GET.get("q", None)
    prefix = request.GET.get("prefix", None)

    page = request.GET.get('page')

    flag = False

    if vocabulary is not None:
        flag = "Vocabulary"
    elif property is not None:
        flag = "Property"
    elif class_ is not None:
        flag = "Class"
    else:
        flag = "General"

    results = []

    '''if flag == "General":
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
            results.append(source_info)'''

    if flag == "Property" or flag == "General":
        if flag == "General":
            property = q

        if prefix:
            if property:
                vocabs = VocabularyProperty.objects.filter(label__iregex=property, vocabulary__preferredNamespacePrefix=prefix)
            else:  # fetch all properties from vocabulary
                vocabs = VocabularyProperty.objects.filter(vocabulary__preferredNamespacePrefix=prefix)
        else:
            vocabs = VocabularyProperty.objects.filter(label__iregex=property)

        for source in vocabs:
            source_info = {}
            source_info['vocabulary'] = source.vocabulary.title
            if prefix:
                source_info["uri"] = re.compile('^' + source.vocabulary.preferredNamespaceUri).sub('', source.uri)
                if source_info["uri"][0] == '#':
                    source_info["uri"] = source_info["uri"][1:]
            else:
                source_info["uri"] = source.uri
            source_info['label'] = source.label
            source_info['ranking'] = source.vocabulary.lodRanking

            results.append(source_info)

    if flag == "Class" or flag == "General":
        if flag == "General":
            class_ = q

        if prefix:
            if class_:
                vocabs = VocabularyClass.objects.filter(label__iregex=class_, vocabulary__preferredNamespacePrefix=prefix)
            else:  # fetch all classes from vocabulary
                vocabs = VocabularyClass.objects.filter(vocabulary__preferredNamespacePrefix=prefix)
        else:
            vocabs = VocabularyClass.objects.filter(label__iregex=class_)

        for source in vocabs:
            source_info = {}
            source_info["vocabulary"] = source.vocabulary.title
            if prefix:
                source_info["uri"] = re.compile('^' + source.vocabulary.preferredNamespaceUri).sub('', source.uri)
                if source_info["uri"][0] == '#':
                    source_info["uri"] = source_info["uri"][1:]
            else:
                source_info["uri"] = source.uri
            source_info["label"] = source.label
            source_info["ranking"] = int(source.vocabulary.lodRanking)

            results.append(source_info)

    if flag == "Vocabulary" or flag == "General":
        if flag == "General":
            vocabulary = q

        if vocabulary:
            vocabs = Vocabulary.objects.filter(Q(title__iregex=vocabulary) | Q(preferredNamespacePrefix__iregex=prefix))
        else:
            vocabs = Vocabulary.objects.all()
        for source in vocabs:
            source_info = {}
            source_info["vocabulary"] = source.title
            source_info["uri"] = source.preferredNamespaceUri
            source_info["prefix"] = source.preferredNamespacePrefix
            source_info["description"] = source.description
            source_info["ranking"] = int(source.lodRanking)

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

