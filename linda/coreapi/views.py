from django.db.models import Q

__author__ = 'mpetyx'

import json
from operator import itemgetter

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from linda_app.forms import *


def json_response(func):
    """
    A decorator thats takes a view response and turns it
    into json. If a callback is added through GET or POST
    the response is JSONP.
    """
    def decorator(request, *args, **kwargs):
        objects = func(request, *args, **kwargs)
        if isinstance(objects, HttpResponse):
            return objects
        try:
            data = json.dumps(objects)
            if 'callback' in request.REQUEST:
                # a jsonp response!
                data = '%s(%s);' % (request.REQUEST['callback'], data)
                return HttpResponse(data, "text/javascript")
        except:
            data = json.dumps(str(objects))
        return HttpResponse(data, "application/json")
    return decorator


@csrf_exempt
@json_response
def api_datasources_list(request):
    results = []
    for source in DatasourceDescription.objects.all():
        source_info = {}
        source_info['name'] = source.name
        source_info['uri'] = source.uri
        source_info['title'] = source.title
        results.append(source_info)

    return results


@csrf_exempt
@json_response
def recommend_dataset(request):
    vocabulary = request.GET.get("vocabulary", None)
    class_ = request.GET.get("class", None)
    property = request.GET.get("property", None)
    class_property = request.GET.get("class_property", None)
    q = request.GET.get("q", None)
    prefix = request.GET.get("prefix", None)
    page = request.GET.get('page')

    # find in specific categories
    categories = request.GET.get("category", None)
    if categories:
        categories = categories.split(',')
    else:  # load default categories
        categories = get_configuration().default_categories.split(',')

    if vocabulary is not None:
        flag = "Vocabulary"
    elif property is not None:
        flag = "Property"
    elif class_ is not None:
        flag = "Class"
    elif class_property is not None:
        flag = "ClassProperty"
    else:
        flag = "General"

    results = []


    if flag == "Property" or flag == "General" or flag == "ClassProperty":
        if flag == "General":
            property = q
        elif flag == "ClassProperty":
            property = class_property

        if prefix:
            if property:
                vocabs = VocabularyProperty.objects.filter(label__iregex=property, vocabulary__preferredNamespacePrefix=prefix)
            else:  # fetch all properties from vocabulary
                vocabs = VocabularyProperty.objects.filter(vocabulary__preferredNamespacePrefix=prefix)
        else:
            vocabs = VocabularyProperty.objects.filter(label__iregex=property)

        if categories:
            vocabs = vocabs.filter(vocabulary__category__in=categories)

        for source in vocabs:
            source_info = {}
            source_info['vocabulary'] = source.vocabulary.title
            if prefix:
                source_info["uri"] = re.compile('^' + source.vocabulary.preferredNamespaceUri).sub('', source.uri)
                if source_info["uri"][0] == '#':
                    source_info["uri"] = source_info["uri"][1:]
            else:
                source_info["uri"] = source.uri
            source_info['full_uri'] = source.uri
            source_info['label'] = source.label
            source_info['read_more'] = source.get_absolute_url()
            source_info['ranking'] = source.vocabulary.lodRanking - (len(source_info["label"]) - len(property))*50

            results.append(source_info)

    if flag == "Class" or flag == "General" or flag == "ClassProperty":
        if flag == "General":
            class_ = q
        elif flag == "ClassProperty":
            class_ = class_property

        if prefix:
            if class_:
                vocabs = VocabularyClass.objects.filter(label__iregex=class_, vocabulary__preferredNamespacePrefix=prefix)
            else:  # fetch all classes from vocabulary
                vocabs = VocabularyClass.objects.filter(vocabulary__preferredNamespacePrefix=prefix)
        else:
            vocabs = VocabularyClass.objects.filter(label__iregex=class_)

        if categories:
            vocabs = vocabs.filter(vocabulary__category__in=categories)

        for source in vocabs:
            source_info = {}
            source_info["vocabulary"] = source.vocabulary.title
            if prefix:
                source_info["uri"] = re.compile('^' + source.vocabulary.preferredNamespaceUri).sub('', source.uri)
                if source_info["uri"][0] == '#':
                    source_info["uri"] = source_info["uri"][1:]
            else:
                source_info["uri"] = source.uri
            source_info['full_uri'] = source.uri
            source_info["label"] = source.label
            source_info["read_more"] = source.get_absolute_url()
            source_info["ranking"] = int(source.vocabulary.lodRanking) - (len(source_info["label"]) - len(class_))*50

            results.append(source_info)

    if flag == "Vocabulary" or flag == "General":
        if flag == "General":
            vocabulary = q

        if vocabulary:
            vocabs = Vocabulary.objects.filter(Q(title__iregex=vocabulary) | Q(preferredNamespacePrefix__iregex=vocabulary))
        else:
            vocabs = Vocabulary.objects.all()

        if categories:
            vocabs = vocabs.filter(category__in=categories)

        for source in vocabs:
            source_info = {}
            source_info["vocabulary"] = source.title
            source_info["uri"] = source.preferredNamespaceUri
            source_info["read_more"] = source.get_absolute_url()
            source_info["prefix"] = source.preferredNamespacePrefix
            source_info["description"] = source.description
            source_info["ranking"] = int(source.lodRanking)

            results.append(source_info)

    results = sorted(results, key=itemgetter('ranking'), reverse=True)

    if results:
        high = results[0]['ranking']
        low = results[-1]['ranking']
        if high > low:
            for result in results:
                result['ranking'] = (result['ranking'] - low)/(high - low)*100
        else:
            for result in results:
                result['ranking'] = 100

    if page != "all":
        paginator = Paginator(results, 20)

        try:
            records = paginator.page(page)
        except PageNotAnInteger:
            records = paginator.page(1)
        except EmptyPage:
            records = paginator.page(paginator.num_pages)
    else:
        records = results

    data = []
    for record in records:
        data.append(record)

    return data

