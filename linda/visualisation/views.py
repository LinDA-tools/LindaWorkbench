from django.shortcuts import render
from linda_app.models import DatasourceDescription, get_configuration
from django.core.context_processors import csrf
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.views.decorators.csrf import csrf_exempt
import requests, urllib,re

VISUAL_SERVER = get_configuration().visualization_backend
VISUAL_PROXY = "/visualizations/visual/api"

def visualizations(request):
    params = {}
    params['VISUAL_PROXY'] = VISUAL_PROXY
    params['csrf_token'] = csrf(request)
    params['page'] = 'Visualizations'
    return render(request, 'visual/index.html', params)

# Proxy calls - exist as middle-mans between LinDA visualizations page and the visual server
@csrf_exempt
def get_api_call(request, link):
    print link

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
