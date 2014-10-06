from django.core.context_processors import csrf
from django.http import HttpResponse
from django.shortcuts import render_to_response
import requests
from linda.settings import LINDA_SERVER_IP

from django.views.decorators.csrf import csrf_exempt

R2R_SERVER = LINDA_SERVER_IP + ":3000/"
R2R_PROXY = LINDA_SERVER_IP + ":8000/transformations"


# Create your views here.
def transform(request):
    params = {}
    params['R2R_PROXY'] = R2R_PROXY
    params['csrf_token'] = csrf(request)

    return render_to_response("r2r/index.html", params)


def get_tables(request):
    data = requests.get(R2R_SERVER + "api/v1/db/tables")

    return HttpResponse(data, "application/json")
