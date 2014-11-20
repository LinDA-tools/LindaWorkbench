from django.shortcuts import render
from linda_app.models import DatasourceDescription
from django.core.context_processors import csrf
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.views.decorators.csrf import csrf_exempt
import requests, urllib,re

from linda_app.settings import LINDA_SERVER_IP

VISUAL_SERVER = LINDA_SERVER_IP + ":3002/"
VISUAL_PROXY = "/visual/api"

def visualizations(request):
    params = {}
    params['VISUAL_PROXY'] = VISUAL_PROXY
    params['csrf_token'] = csrf(request)
    params['page'] = 'Visualizations'
    return render(request, 'visual/index.html', params)


def visualizeDatasource(request, **kwargs):
    params = {}
    params['datasource'] = DatasourceDescription.objects.get(name=kwargs.get('dtname'))
    params['page'] = 'Visualizations'

    return render(request, 'visual/datasource.html', params)

#Proxy calls - exist as middle-mans between LinDA visualizations page and the visual server
@csrf_exempt
def get_api_call(request, link):
    #TO-DO Improve request handler
    link = urllib.quote(link)
    link = re.sub(r"\/", "%2F", link)
    link = re.sub(r"\)", "%29", link)
    link = re.sub(r"\(", "%28", link)
    link = re.sub(r"^sparql-proxy%2F", "sparql-proxy/", link)
    link = re.sub(r"%2FPREFIX", "/PREFIX", link)
    total_link = VISUAL_SERVER + "" + link
    print 'here is the link:' + link + 'end of link:'
    if request.GET:
        total_link += "?"
    for param in request.GET:
        total_link += param + "=" + request.GET[param] + "&"

    data = requests.get(total_link)

    return HttpResponse(data, data.headers['content-type'])
