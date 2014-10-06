from django.core.context_processors import csrf
from django.http import HttpResponse
from django.shortcuts import render_to_response
import requests

from linda.settings import LINDA_SERVER_IP

R2R_SERVER = LINDA_SERVER_IP + ":3000/"
R2R_PROXY = LINDA_SERVER_IP + ":8000/transformations"


# Transformation page view
def transform(request):
    params = {}
    params['R2R_PROXY'] = R2R_PROXY
    params['csrf_token'] = csrf(request)

    return render_to_response("r2r/index.html", params)


#Proxy calls - exist as middle-mans between LinDA tranformations page and the r2r server
def get_api_call(request, link):
    data = requests.get(R2R_SERVER + "api/" + link)

    return HttpResponse(data, "application/json")