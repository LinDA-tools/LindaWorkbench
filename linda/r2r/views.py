from django.core.context_processors import csrf
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.views.decorators.csrf import csrf_exempt
import requests

from linda_app.settings import LINDA_SERVER_IP

R2R_SERVER = LINDA_SERVER_IP + ":3000/"
R2R_PROXY = "/transformations"


# Transformation page view
def transform(request):
    params = {}
    params['R2R_PROXY'] = R2R_PROXY
    params['csrf_token'] = csrf(request)
    params['page'] = 'Transformations'

    return render_to_response("r2r/index.html", params)


#Proxy calls - exist as middle-mans between LinDA tranformations page and the r2r server
@csrf_exempt
def get_api_call(request, link):
    total_link = R2R_SERVER + "api/" + link
    if request.GET:
        total_link += "?"
    for param in request.GET:
        total_link += param + "=" + request.GET[param] + "&"

    data = requests.get(total_link)

    return HttpResponse(data, data.headers['content-type'])