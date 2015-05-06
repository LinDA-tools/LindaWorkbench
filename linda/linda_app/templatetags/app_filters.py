from django import template
from django.utils.http import urlquote
import re
from endpoint_monitor.models import EndpointTest
from linda_app.models import Vocabulary, VocabularyClass, VocabularyProperty, get_configuration
from analytics.models import Algorithm, Category

register = template.Library()

# Load user configurable settings
config = get_configuration()

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
    endpoint = config.private_sparql_endpoint
    graph_uri = datasource.uri
    return '/visualizations/#/datasource/' + datasource.name + '/' + urlquote(endpoint, safe='') + '/' + urlquote(graph_uri, safe='') + '/rdf'

@register.filter
def sparql_version(datasource):
    if datasource.is_public:
        tests = EndpointTest.objects.filter(datasource=datasource, up=True).order_by('-id')
        if tests:
            if tests[0].supports_minus:
                return "1.1"
            else:
                return "1.0"
        else:
            return ""
    else:
        return "1.1"

@register.filter
def label_from_uri(uri):
    label = uri.split('/')[-1]
    if label.find('#'):
        label = uri.split('#')[-1]

    return label