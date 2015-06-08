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

    if ('sparql-proxy' in link) or ('dataselection' in link) or ('visualizations' in link):
	    endpoint = 'http://localhost:3002/'
    else:
        endpoint = VISUAL_SERVER
	
    #TO-DO Improve request handler
    link = urllib.quote(link)
    link = re.sub(r"\/", "%2F", link)
    link = re.sub(r"\)", "%29", link)
    link = re.sub(r"\(", "%28", link)
    link = re.sub(r"^sparql-proxy%2F", "sparql-proxy/", link)
    link = re.sub(r'^visualizations%2F', 'visualizations/', link)	
    link = re.sub(r"%2FPREFIX", "/PREFIX", link)
    print 'here is the link:' + link + 'end of link:'
    total_link = endpoint + link	
    if request.GET:
        total_link += "?"
    for param in request.GET:
        total_link += param + "=" + request.GET[param] + "&"

    if request.method == "GET":	
        data = requests.get(total_link)
    elif (request.method == "POST") or (request.method == "PUT"):	
        h = {}
        if request.body:
            d = request.body
            h = headers={'Content-type': 'application/json',}			
        else:
            if request.method == "POST":
                d = request.POST
            else:
                d = request.PUT			
        
        if request.method == "POST":
            data = requests.post(total_link, data=d, headers=h)
        else:
			data = requests.put(total_link, data=d, headers=h)	

    if 'content-type' in data.headers:		
        return HttpResponse(data, data.headers['content-type'])
    else:
        return HttpResponse(data)
