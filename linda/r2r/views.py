from django.core.context_processors import csrf
from django.http import HttpResponse
from django.shortcuts import render_to_response
import requests
from linda.settings import LINDA_SERVER_IP

from django.views.decorators.csrf import csrf_exempt

R2R_SERVER = LINDA_SERVER_IP + ":3000/"
R2R_PROXY = LINDA_SERVER_IP + ":8000/transformations"


# Transformation page view
def transform(request):
    params = {}
    params['R2R_PROXY'] = R2R_PROXY
    params['csrf_token'] = csrf(request)

    return render_to_response("r2r/index.html", params)


#Proxy calls - exist as middle-mans between LinDA tranformations page and the r2r server

#Get all table
def get_tables(request):
    data = requests.get(R2R_SERVER + "api/v1/db/tables")

    return HttpResponse(data, "application/json")


#Get table specified by name
def get_table(request):
    data = requests.get(R2R_SERVER + "api/v1/db/tables?name=" + request.GET['name'])

    return HttpResponse(data, "application/json")


#Get all columns in table
def get_columns(request):
    data = requests.get(R2R_SERVER + "api/v1/db/columns?table=" + request.GET['table'])

    return HttpResponse(data, "application/json")


#Get all properties in table
def get_properties(request):
    data = requests.get(R2R_SERVER + "api/v1/lov/properties?table=" + request.GET['table'])

    return HttpResponse(data, "application/json")