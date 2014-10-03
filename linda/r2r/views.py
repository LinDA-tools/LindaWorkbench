from django.shortcuts import render
from django.core.context_processors import csrf
from django.shortcuts import render_to_response

# Create your views here.
def transform(request):
    c = {}
    c.update(csrf(request))
    return render_to_response("r2r/index.html", c)
