from django.core.context_processors import csrf
from django.http import HttpResponse
from django.shortcuts import render_to_response
import requests
from linda.settings import LINDA_SERVER_IP

R2R_SERVER = LINDA_SERVER_IP + ":3000/"

# Create your views here.
def transform(request):
    c = {}
    c.update(csrf(request))
    return render_to_response("r2r/index.html", c)

def get_tables(request):
    data = requests.get(R2R_SERVER + "api/v1/db/tables")
    return HttpResponse(data, "application/json")
