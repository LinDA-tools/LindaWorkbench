from django.shortcuts import render, get_object_or_404
from django.http import HttpResponseRedirect, HttpResponse
from .forms import AnalyticsForm,DocumentForm
from django.views import generic
from django.core.urlresolvers import reverse
from django.views.generic import ListView, UpdateView, DetailView, DeleteView


from django.shortcuts import render_to_response
from django.template import RequestContext
from django.utils import simplejson
import socket



from analytics.models import Analytics,Algorithm

import urllib2
import json
import pprint

from ConfigParser import ConfigParser
import os.path
import requests


def analytics(request):
    if request.method == 'POST': # If the form has been submitted...
        # ContactForm was defined in the previous section
        form = AnalyticsForm(request.POST,request.FILES) # A form bound to the POST data
        #documentForm = DocumentForm(request.POST,request.FILES)
        if form.is_valid(): # All validation rules pass
            # Process the data in form.cleaned_data
            # file is saved
            #handle_uploaded_file(request.FILES['document'])
            new_lindaAnalytics = form.save()
            #upFile = open(new_lindaAnalytics.resultdocument, 'r')
            #context = {}
            #upFile = request.FILES['document']
            #context = {}
            #if upFile.multiple_chunks():
            # context["uploadError"] = "Uploaded file is too big (%.2f MB)." % (upFile.size,)
            #else:
            #if upFile.multiple_chunks():
            # context["uploadError"] = "Uploaded file is too big (%.2f MB)." % (upFile.size,)
            #else:
            # context["uploadedFile"] = __unicode__(upFile.read())
            #f.close()
            #return HttpResponseRedirect('/thanks/') # Redirect after POST
            callRESTfulLINDA(new_lindaAnalytics.pk,'lindaAnalytics_analytics')
            return HttpResponseRedirect(reverse('analytics:detail', args=(new_lindaAnalytics.pk,)))
    else:
        #print("hoalaaaaaaaaaaa")
        form = AnalyticsForm() # An unbound form
        analytics_list = Analytics.objects.all()


    return render(request, 'analytics/analytics.html', {
        'form': form,'analytics_list': analytics_list
    })

def __unicode__(self):
        return unicode(self)


def uploadView(request):
    upFile = request.FILES["upFile"]
    context = {}
    if upFile.multiple_chunks():
        context["uploadError"] = "Uploaded file is too big (%.2f MB)." % (upFile.size,)
    else:
        context["uploadedFile"] = upFile.read()
    return render_to_response('fileUploadPage.html', context)

def handle_uploaded_file(f):
    with open('analytics/documents/lala.txt', 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)

def callRESTfulLINDA(lindaAnalyticsPK,category_table):
   #pp = pprint.PrettyPrinter(indent=4)
   request = urllib2.Request('http://localhost:8181/RESTfulLINDA/rest/analytics/'+ str(category_table) +'/' + str(lindaAnalyticsPK))
   response = urllib2.urlopen(request)
   #resp_parsed = json.loads(response.read())
   print(response.read())


def detail(request, analytics_id):
    analytics = get_object_or_404(Analytics, pk=analytics_id)
    analytics_list = Analytics.objects.all()
    #return render(request, 'lindaAnalytics/detail.html', {'analytics': analytics})
    try:
        analytics = Analytics.objects.get(pk=analytics_id)
    except Analytics.DoesNotExist:
        raise Http404
    return render(request, 'analytics/detail.html', {'analytics': analytics,'analytics_list': analytics_list})
   #return HttpResponse("You're looking at analytics %s." % analytics_id)


def ajax(request):
    if request.POST.has_key('category'):
        category_id = request.POST['category']
        algorithmsPerCategory = Algorithm.objects.filter(category__id=category_id)
        results = [ob.as_json() for ob in algorithmsPerCategory]
        response_dict = {}
        response_dict.update({'algorithmsPerCategory': results })
        return HttpResponse(simplejson.dumps(response_dict), mimetype='application/javascript')
    else:
        return render_to_response('ajaxexample.html', context_instance=RequestContext(request))


class AnalyticsDeleteView(DeleteView):
    model = Analytics
    template_name = 'analytics/delete.html'
    context_object_name = 'analytics'
    success_url = '/analytics/'

    def get_object(self):
        object = super(AnalyticsDeleteView, self).get_object()
        return object


def reevaluate(request, analytics_id):
    analytics = get_object_or_404(Analytics, pk=analytics_id)
    analytics_list = Analytics.objects.all()
    #return render(request, 'lindaAnalytics/detail.html', {'analytics': analytics})
    try:
	callRESTfulLINDA(analytics_id,'lindaAnalytics_analytics')
        analytics = Analytics.objects.get(pk=analytics_id)
    except Analytics.DoesNotExist:
        raise Http404
    #return render(request, 'analytics/detail.html', {'analytics': analytics,'analytics_list': analytics_list})
    return HttpResponseRedirect(reverse('analytics:detail', args=(analytics_id,)))

