from django.shortcuts import render, get_object_or_404,redirect
from django.http import HttpResponseRedirect, HttpResponse
from .forms import AnalyticsForm,DocumentForm
from django.views import generic
from django.core.urlresolvers import reverse
from django.views.generic import ListView, UpdateView, DetailView, DeleteView


from django.shortcuts import render_to_response
from django.template import RequestContext
import simplejson
import socket

from analytics.models import Analytics,Category,Algorithm,Params
from linda_app.models import Query

import urllib2
import json
import pprint

from ConfigParser import ConfigParser
import os.path
import requests

from linda_app.settings import LINDA_HOME

from django.contrib import messages
from django.contrib.messages import get_messages


def analytics(request):
    if request.user.is_authenticated():
      if request.method == 'POST': # If the form has been submitted...
	  # ContactForm was defined in the previous section
	  form = AnalyticsForm(request.POST,request.FILES) # A form bound to the POST data
	  #documentForm = DocumentForm(request.POST,request.FILES)
	  if form.is_valid(): # All validation rules pass
	      # Process the data in form.cleaned_data
	      # file is saved
	      #handle_uploaded_file(request.FILES['document'])
	      current_user = request.user
	      new_lindaAnalytics = form.save(commit=False)
	      
	      if(not new_lindaAnalytics.evaluationQuery and (new_lindaAnalytics.algorithm.id ==1 or new_lindaAnalytics.algorithm.id ==2 or new_lindaAnalytics.algorithm.id ==4 or new_lindaAnalytics.algorithm.id ==16)):
	        
	        form = AnalyticsForm() # An unbound form
		current_user = request.user
		analytics_list = Analytics.objects.filter(user_id=current_user.id)
	        messages.info(request, 'The selected Algorith needs both a train and evaluation dataset in order to run analytics.')
		return render(request, 'analytics/analytics.html', {
		'form': form,'analytics_list': analytics_list
		})
	      else:
		new_lindaAnalytics.version = 0
		new_lindaAnalytics.user_id = current_user.id
		print(new_lindaAnalytics.trainQuery)
		new_lindaAnalytics.save()
		#try to use params form
		callRESTfulLINDA(new_lindaAnalytics.pk,'lindaAnalytics_analytics')
		return HttpResponseRedirect(reverse('analytics:detail', args=(new_lindaAnalytics.pk,)))
	      
	  else:
	      form = AnalyticsForm() # An unbound form
	      current_user = request.user
	      analytics_list = Analytics.objects.filter(user_id=current_user.id)
	      return render(request, 'analytics/analytics.html', {
	      'form': form,'analytics_list': analytics_list
	      })
      else:
	  form = AnalyticsForm() # An unbound form
	  #analytics_list = Analytics.objects.all()
	  current_user = request.user
	  analytics_list = Analytics.objects.filter(user_id=current_user.id)
	  if 'q_id' in request.GET: 
	    q_id = request.GET.get("q_id") #primary datasource has been selected
	    q_object = Query.objects.get(pk=q_id)
	    #print q_object.description #description of the query in natural language
	    #print q_object.sparql #the sparql query 
	    #print q_object.csv_link() #the url to the csv file that is created by rdf2any
	  else:
	    q_object = None #datasource not selected


	  return render(request, 'analytics/analytics.html', {
	      'form': form,'analytics_list': analytics_list, 'query': q_object
	  })	  
    else: 
      return render(request, 'analytics/noAuthenticatedAccess.html',)
    
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
        return HttpResponse(simplejson.dumps(response_dict), content_type='application/javascript')
    if request.POST.has_key('algorithm'):
        algorithm_id = request.POST['algorithm']
        paramsPerAlgorithm = Params.objects.filter(algorithm__id=algorithm_id)
        results = [ob.as_json() for ob in paramsPerAlgorithm]
        response_dict = {}
        response_dict.update({'paramsPerAlgorithm': results })
        return HttpResponse(simplejson.dumps(response_dict), content_type='application/javascript')  
    else:
        return render_to_response('ajaxexample.html', context_instance=RequestContext(request))
      
def get_info(request):
    if request.POST.has_key('category'):
        categories = Category.objects.all()
        results = [ob.as_json() for ob in categories]
        response_dict = {}
        response_dict.update({'categories': results })
        return HttpResponse(simplejson.dumps(response_dict), content_type='application/javascript')
    if request.POST.has_key('algorithm'):
        algorithms = Algorithm.objects.all()
        results = [ob.as_json() for ob in algorithms]
        response_dict = {}
        response_dict.update({'algorithms': results })
        return HttpResponse(simplejson.dumps(response_dict), content_type='application/javascript')  
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
  
   
def sendRDFToTriplestore(request1 , analytics_id):
    analytics = get_object_or_404(Analytics, pk=analytics_id)
    analytics_list = Analytics.objects.all()
    try:
	request = urllib2.Request('http://localhost:8181/RESTfulLINDA/rest/analytics/loadtotriplestore/' + str(analytics_id))
	response = urllib2.urlopen(request)
	print(response.read())
        analytics = Analytics.objects.get(pk=analytics_id)
    except Analytics.DoesNotExist:
        raise Http404
    return HttpResponseRedirect(reverse('analytics:detail', args=(analytics_id,)))  
  
def datasourceCreateRDF(request):
    if request.POST:
        #Get the posted rdf data
        if "rdffile" in request.FILES:
            rdf_content = request.FILES["rdffile"].read()
        else:
            rdf_content = request.POST.get("rdfdata")


        #Call the corresponding web service
        headers = {'accept': 'application/json'}
        callAdd = requests.post(LINDA_HOME + "api/datasource/create/", headers=headers,
                                data={"content": rdf_content, "title": request.POST.get("title")})

        j_obj = json.loads(callAdd.text)
        if j_obj['status'] == '200':
	     
	     analytics = get_object_or_404(Analytics, pk=request.POST.get("analytics_id"))
	     analytics.publishedToTriplestore = "1"
	     analytics.save()
             return redirect("/datasources/")
        else:
            params = {}

            params['form_error'] = j_obj['message']
            params['title'] = request.POST.get("title")
            params['rdfdata'] = request.POST.get("rdfdata")

            return render(request, 'datasource/create_rdf.html', params)
    else:
        params = {}
        params['title'] = ""
        params['rdfdata'] = ""

        return render(request, 'datasource/create_rdf.html', params)  
  
def get_trainQuery(request):
    q = request.GET.get('q')   #Get the search term typed by user
    queries = Query.objects.filter(description__icontains=q)  #Query according to search term
    #print(queries)
    #Send pk and the actual customer name as json
    queries_list = []
    for query in queries:
        queries_dict = {}
        queries_dict['value'] = query.pk
        queries_dict['label'] = query.description
        queries_list.append(queries_dict)
        #print(queries_list)
    return HttpResponse(json.dumps(queries_list), content_type='application/json')
  
def get_evaluationQuery(request):
    q = request.GET.get('q')   #Get the search term typed by user
    queries = Query.objects.filter(description__contains=q)  #Query according to search term
    #print(queries)
    #Send pk and the actual customer name as json
    queries_list = []
    for query in queries:
        queries_dict = {}
        queries_dict['value'] = query.pk
        queries_dict['label'] = query.description
        queries_list.append(queries_dict)
        #print(queries_list)
    return HttpResponse(json.dumps(queries_list), content_type='application/json')
  
def popup_query_info(request):
    query_id = request.POST['query_id']
    query = Query.objects.get(id=query_id)
    return render(request, 'analytics/query.html', {'query': query,})
  
  
  