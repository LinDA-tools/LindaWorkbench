from django import template
from django.utils.http import urlquote
from linda_app.models import Vocabulary, VocabularyClass, VocabularyProperty
from linda_app.settings import PRIVATE_SPARQL_ENDPOINT

register = template.Library()


@register.filter(name="nice_name")
def nice_name(user):
    return user.get_full_name() or user.username

@register.filter(name="vocabularies")
def vocabularies(objects):
    return [elem for elem in objects if isinstance(elem.object, Vocabulary) or isinstance(elem, Vocabulary)]

@register.filter(name="classes")
def vocabulary_classes(objects):
    return [elem for elem in objects if isinstance(elem.object, VocabularyClass) or isinstance(elem, VocabularyClass)]

@register.filter(name="properties")
def vocabulary_properties(objects):
    return [elem for elem in objects if isinstance(elem.object, VocabularyProperty) or isinstance(elem, VocabularyProperty)]

@register.filter(name="get_endpoint")
def get_endpoint(datasource):
    return datasource.get_endpoint()

@register.simple_tag
def url_replace(request, field, value):
    dict_ = request.GET.copy()
    dict_[field] = value
    return dict_.urlencode()

@register.filter(name="datasource_visualize")
def datasource_visualize(datasource):
    endpoint = PRIVATE_SPARQL_ENDPOINT
    graph_uri = datasource.uri
    return '/visualizations/#/visualization/' + datasource.name + '/' + urlquote(endpoint, safe='') + '/' + urlquote(graph_uri, safe='') + '/rdf'
