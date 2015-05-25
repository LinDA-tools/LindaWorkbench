from django.shortcuts import render, get_object_or_404,redirect
from django.http import HttpResponseRedirect, HttpResponse
from .forms import AnalyticsForm,DocumentForm
from django.views import generic
from django.core.urlresolvers import reverse
from django.views.generic import ListView, UpdateView, DetailView, DeleteView
from django.contrib.auth.models import User
from django.db.models import Q,Count

from django.shortcuts import render_to_response
from django.template import RequestContext
import simplejson
import socket

from analytics.models import Analytics,Category,Algorithm,Params
from linda_app.models import Query,UserProfile,DatasourceDescription


import urllib2
import json
import pprint

from ConfigParser import ConfigParser
import os.path
import requests
import datetime

from linda_app.settings import LINDA_HOME

from django.contrib import messages
from django.contrib.messages import get_messages
import pdfkit
import reportlab
from reportlab.pdfgen import canvas
from django.http import HttpResponse
from tempfile import *
import csv



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
	      
	      if(not (new_lindaAnalytics.evaluationQuery or new_lindaAnalytics.testdocument) and  (new_lindaAnalytics.algorithm.id ==1 or new_lindaAnalytics.algorithm.id ==2 or new_lindaAnalytics.algorithm.id ==4 or new_lindaAnalytics.algorithm.id ==16)):
	        
	        form = AnalyticsForm() # An unbound form
		current_user = request.user
		analytics_list = Analytics.objects.filter(user_id=current_user.id)
	        messages.info(request, 'The selected Algorithm needs both a train and evaluation dataset in order to run analytics.')
		return render(request, 'analytics/analytics.html', {
		'form': form,'analytics_list': analytics_list
		})
	      else:
		new_lindaAnalytics.version = 0
		new_lindaAnalytics.user_id = current_user.id
		print(new_lindaAnalytics.trainQuery)
		current_time = datetime.datetime.today();
		new_lindaAnalytics.createdOn = current_time;
		new_lindaAnalytics.updatedOn = current_time;
		new_lindaAnalytics.save()
		#try to use params form
		callRESTfulLINDA(new_lindaAnalytics.pk,'lindaAnalytics_analytics',request)
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

def callRESTfulLINDA(lindaAnalyticsPK,category_table,request):
   #pp = pprint.PrettyPrinter(indent=4)
   request1 = urllib2.Request('http://localhost:8181/RESTfulLINDA/rest/analytics/'+ str(category_table) +'/' + str(lindaAnalyticsPK))
   #resp_parsed = json.loads(response.read())
   #print(response.read())   
   try:
	response = urllib2.urlopen(request1)
   except urllib2.URLError as e:
	if hasattr(e, 'reason'):
	    print('We failed to reach a server.')
	    print('Reason: ', e.reason)
	    messages.info(request, 'We failed to reach a server. Reason: '+str(e.reason) + '. Please try again later.')
	elif hasattr(e, 'code'):
	    print('The server couldn\'t fulfill the request.')
	    print('Error code: ', e.code)
	    messages.info(request, 'The server couldn\'t fulfill the request. Error code: '+str(e.code))
   else:
	# everything is fine
	print(response.read()) 


def detail(request, analytics_id):
    analytics = get_object_or_404(Analytics, pk=analytics_id)
    #analytics_list = Analytics.objects.all()
    current_user = request.user
    analytics_list = Analytics.objects.filter(user_id=current_user.id)
    #return render(request, 'lindaAnalytics/detail.html', {'analytics': analytics})
    try:
        analytics = Analytics.objects.get(pk=analytics_id)
    except Analytics.DoesNotExist:
        raise Http404
    return render(request, 'analytics/detail.html', {'analytics': analytics,'analytics_list': analytics_list})
   #return HttpResponse("You're looking at analytics %s." % analytics_id)
   
def detailtoprint(request, analytics_id):
    analytics = get_object_or_404(Analytics, pk=analytics_id)
    print(analytics.user_id)
    current_user = get_object_or_404(User, id=analytics.user_id)
    try:
        analytics = Analytics.objects.get(pk=analytics_id)
    except Analytics.DoesNotExist:
        raise Http404
    return render(request, 'analytics/detailtoprint.html', {'analytics': analytics,'current_user':current_user})


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
	callRESTfulLINDA(analytics_id,'lindaAnalytics_analytics',request)
        analytics = Analytics.objects.get(pk=analytics_id)
    except Analytics.DoesNotExist:
        raise Http404
    #return render(request, 'analytics/detail.html', {'analytics': analytics,'analytics_list': analytics_list})
    return HttpResponseRedirect(reverse('analytics:detail', args=(analytics_id,)))
  
def exportreport(request, analytics_id):
    analytics = get_object_or_404(Analytics, pk=analytics_id)
    try:
        analytics = Analytics.objects.get(pk=analytics_id)
        tempfile=gettempdir()+"/out.pdf"
        currenturl= request.path
        pdfurl = currenturl.replace("/exportreport/", "");
        pdfkit.from_url('http://localhost:8000'+str(pdfurl), tempfile)
        f = open(tempfile, 'r')
        pdf = f.read()
        f.close()
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename=myreport.pdf'
        response.write(pdf)
        

    except Analytics.DoesNotExist:
        raise Http404
    return response
  
   
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
  
  

def statistics(request):
    return render(request, 'analytics/statistics.html')  

def statistics_4_drildown_Datasources(request):
    queries=Query.objects.all()
    #n_of_public = len(Query.objects.all())
    #print(n_of_public)
    queries_list = []
    for query in queries:
        queries_dict = {}
        queries_dict['datasource'] = query.endpoint
        queries_dict['query'] = 'ID:'+str(query.id)+' '+str(query.description)
        queries_dict['n_of_analytics'] = len(Analytics.objects.filter(Q(trainQuery_id=query.id) | Q(evaluationQuery_id=query.id)))
        queries_list.append(queries_dict)
        
    n_test = len(queries_list)
    print('makari')
    print(n_test)
    return HttpResponse(json.dumps(queries_list), content_type='application/json')    
  
def statistics_4_drildown_Algorithms(request):
    algorithms=Algorithm.objects.all()
    #n_of_public = len(Query.objects.all())
    algorithms_list = []
    for algorithm in algorithms:
        algorithms_dict = {}
        algorithms_dict['category'] = algorithm.category_name()
        algorithms_dict['algorithm'] = algorithm.name
        algorithms_dict['n_of_analytics'] = len(Analytics.objects.filter(algorithm_id=algorithm.id))
        algorithms_list.append(algorithms_dict)
    return HttpResponse(json.dumps(algorithms_list), content_type='application/json')    
  
def statistics4heatmap(request):
    algorithms=Algorithm.objects.all()
    analytics=Analytics.objects.all()
    queries=Query.objects.all()
    analytics_list = []
    for algorithm in algorithms:
        print(algorithm.name)
        analytics_per_algorithm =Analytics.objects.filter(algorithm_id=algorithm.id)
        analytics_per_algorithm_per_trainQuery = analytics_per_algorithm.values('trainQuery_id').annotate(dcount=Count('trainQuery_id'))
        analytics_per_algorithm_per_evaluationQuery = analytics_per_algorithm.values('evaluationQuery_id').annotate(dcount=Count('evaluationQuery_id'))
        for trainQuery in analytics_per_algorithm_per_trainQuery:
	    analytics_dict = {}
	    print('aaaaaaaaaaaa')
	    print(trainQuery)
            analytics_dict['n_of_analytics'] = trainQuery['dcount']
            analytics_dict['query'] = trainQuery['trainQuery_id']
            analytics_dict['algorithm'] = algorithm.name
            analytics_list.append(analytics_dict)
      
        
    return HttpResponse(json.dumps(analytics_list), content_type='application/json')    
  
  
  
def statistics4heatmap1(request):
    # Create the HttpResponse object with the appropriate CSV header.
    response = HttpResponse(content_type='text/tsv')
    response['Content-Disposition'] = 'attachment; filename="somefilename.csv"'

    writer = csv.writer(response)
   
    queries=Query.objects.all()
    n_of_public = len(Query.objects.all())
    print(n_of_public)
    queries_list = []
    for query in queries:
        writer.writerow([query.endpoint, query.id, len(Analytics.objects.filter(Q(trainQuery_id=query.id) | Q(evaluationQuery_id=query.id)))])
        
    return response    