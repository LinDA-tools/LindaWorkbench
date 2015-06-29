from __future__ import division
from django.shortcuts import render, get_object_or_404,redirect
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse, Http404
from .forms import AnalyticsForm,DocumentForm
from django.views import generic
from django.core.urlresolvers import reverse
from django.views.generic import ListView, UpdateView, DetailView, DeleteView
from django.contrib.auth.models import User
from django.db.models import Q,Count

from django.core import serializers

from django.shortcuts import render_to_response
from django.template import RequestContext
import simplejson
import socket

from analytics.models import Analytics,Category,Algorithm,Params
from linda_app.models import Query,UserProfile,DatasourceDescription


import urllib
import json
import pprint

import os.path
import requests
import datetime
from datetime import date;

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
                    if not new_lindaAnalytics.description:
                        applyied_algorithm = Algorithm.objects.filter(id=new_lindaAnalytics.algorithm.id)
                        alg_name = '';
                        for alg in applyied_algorithm:
                            alg_name = alg.name
                        new_lindaAnalytics.description='Analytics for query'+str(new_lindaAnalytics.trainQuery)+' with algorithm '+str(alg.name)
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
    request1 = urllib.Request('http://localhost:8181/RESTfulLINDA/rest/analytics/'+ str(category_table) +'/' + str(lindaAnalyticsPK))
    #resp_parsed = json.loads(response.read())
    #print(response.read())
    try:
        response = urllib.urlopen(request1)
    except urllib.URLError as e:
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
    if request.user.is_authenticated():
        analytics = Analytics.objects.filter(pk=analytics_id, user_id = request.user.id)
        if not analytics:
	        return render(request, 'analytics/noAuthenticatedAccess.html',)

        current_user = request.user
        analytics_list = Analytics.objects.filter(user_id=current_user.id)
        try:
            analytics = Analytics.objects.get(pk=analytics_id)
        except Analytics.DoesNotExist:
	        raise Http404
        return render(request, 'analytics/detail.html', {'analytics': analytics,'analytics_list': analytics_list})
    else:
        return render(request, 'analytics/noAuthenticatedAccess.html',)

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
    if 'category' in request.POST:
        category_id = request.POST['category']
        algorithmsPerCategory = Algorithm.objects.filter(category__id=category_id)
        results = [ob.as_json() for ob in algorithmsPerCategory]
        response_dict = {}
        response_dict.update({'algorithmsPerCategory': results })
        return HttpResponse(simplejson.dumps(response_dict), content_type='application/javascript')
    if 'algorithm' in request.POST:
        algorithm_id = request.POST['algorithm']
        paramsPerAlgorithm = Params.objects.filter(algorithm__id=algorithm_id)
        results = [ob.as_json() for ob in paramsPerAlgorithm]
        response_dict = {}
        response_dict.update({'paramsPerAlgorithm': results })
        return HttpResponse(simplejson.dumps(response_dict), content_type='application/javascript')
    else:
        return render_to_response('ajaxexample.html', context_instance=RequestContext(request))

def get_info(request):
    if 'category' in request.POST:
        categories = Category.objects.all()
        results = [ob.as_json() for ob in categories]
        response_dict = {}
        response_dict.update({'categories': results })
        return HttpResponse(simplejson.dumps(response_dict), content_type='application/javascript')
    if 'algorithm' in request.POST:
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


def reevaluate(request, analytics_id,model):
    analytics = get_object_or_404(Analytics, pk=analytics_id)
    analytics_list = Analytics.objects.all()
    try:
        print(analytics_id)
        print(model)
        print(int(model))
        if model=='0':
            model_int = 0
        else:
            model_int=1
        Analytics.objects.filter(pk=analytics_id).update(createModel=model_int)
        callRESTfulLINDA(analytics_id,'lindaAnalytics_analytics',request)

    except Analytics.DoesNotExist:
        raise Http404
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
        request = urllib.Request('http://localhost:8181/RESTfulLINDA/rest/analytics/loadtotriplestore/' + str(analytics_id))
        response = urllib.urlopen(request)
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

    rdfformat = request.POST.get("format");
    if rdfformat == 'N-Tripples':
        rdfformat = 'text/rdf+n3';
        #Call the corresponding web service
        headers = {'accept': 'application/json'}
        callAdd = requests.post(LINDA_HOME + "api/datasource/create/", headers=headers,
                                data={"content": rdf_content, "title": request.POST.get("title"),"format": rdfformat})

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
            params['format'] = rdfformat

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

def get_query_evaluation_info(request):
    q = request.POST.get('query')   #Get the search term typed by user
    print(q)
    analytics = Analytics.objects.filter(Q(trainQuery_id=q) | Q(evaluationQuery_id=q))
    print(analytics)
    analytics_list = []
    algorithms_list = []
    algorithms_values = str('')
    evaldataquality=0;

    for analytic in analytics:
        evaldataquality += analytic.evaldataquality
        if analytic.algorithm_id not in algorithms_list:
            algorithms_list.append(analytic.algorithm_id)

    for alg in algorithms_list:
        algorithms_values += str(Algorithm.objects.get(id=alg).name) + str(' - ')


    analytics_dict = {}
    #1.in hoy many analytics processes has participated
    num_of_analytics = len(analytics)
    print(num_of_analytics)
    analytics_dict['analyticsNum'] = num_of_analytics
    #2.what is the data quality from the analytic processes that has participated
    if num_of_analytics>0:
      analytics_dict['evaldataquality'] = evaldataquality/num_of_analytics
    else:
      analytics_dict['evaldataquality'] = 0
    #3.with which algotithms has been analyzed
    analytics_dict['algorithms'] = algorithms_values
    analytics_list.append(analytics_dict)
    print(analytics_list)

    return HttpResponse(json.dumps(analytics_list), content_type='application/json')


def popup_query_info(request):
    query_id = request.POST['query_id']
    query = Query.objects.get(id=query_id)
    return render(request, 'analytics/query.html', {'query': query,})



def site_search(request):
    if 'search_q' not in request.POST:
        return Http404

    current_user = request.user
    q = request.POST.get('search_q')
    if not q:
        print('333')
        analytics = Analytics.objects.filter(user_id=current_user.id)
    else:
        analytics=Analytics.objects.filter(Q(user_id=current_user.id) & Q(description__icontains=q))

    # get pages
    if 'v_page' in request.POST:
        try:
            v_page = int(request.POST['v_page'])
        except ValueError:
            v_page = 1
    else:
        v_page = 1

    if 'c_page' in request.POST:
        try:
            c_page = int(request.POST['c_page'])
        except ValueError:
            c_page = 1
    else:
        c_page = 1

    if 'p_page' in request.POST:
        try:
            p_page = int(request.POST['p_page'])
        except ValueError:
            p_page = 1
    else:
        p_page = 1


    analytics_list = []
    for analytic in analytics:
        analytics_dict = {}
        analytics_dict['id'] = analytic.id
        analytics_dict['url'] = 'http://localhost:8000/analytics/'+str(analytic.id)
        analytics_dict['name'] = '('+str(analytic.algorithm)+')-An.ID : '+str(analytic.id )
        analytics_dict['description'] = analytic.description
        analytics_list.append(analytics_dict)

    print(analytics_list)
    return HttpResponse(json.dumps(analytics_list), content_type='application/json')

def edit_evaluation_query(request):
    if request.POST:
        analytics_id = request.POST.get("anID")
        evaluationQuery = request.POST.get("evaluationQuery")
        Analytics.objects.filter(pk=analytics_id).update(evaluationQuery_id=evaluationQuery)
    return HttpResponseRedirect(reverse('analytics:detail', args=(analytics_id,)))


def edit_output_format(request):
    if request.POST:
        analytics_id = request.POST.get("anID")
        expformat = request.POST.get("exportFormat")
        Analytics.objects.filter(pk=analytics_id).update(exportFormat=expformat)
    return HttpResponseRedirect(reverse('analytics:detail', args=(analytics_id,)))

def edit_parameters(request):
    if request.POST:
        analytics_id = request.POST.get("anID")
        params = request.POST.get("parameters_display")
        Analytics.objects.filter(pk=analytics_id).update(parameters=params)
    return HttpResponseRedirect(reverse('analytics:detail', args=(analytics_id,)))



def evaluation(request):
    if request.POST:
        analytics_id = request.POST.get("anID")
        evalinsight = convert_emotion_to_integer(request.POST.get("emotion1"))
        evalexectime = convert_emotion_to_integer(request.POST.get("emotion2"))
        evalresuseoutput = convert_emotion_to_integer(request.POST.get("emotion3"))
        evaldataquality = convert_emotion_to_integer(request.POST.get("emotion4"))

        Analytics.objects.filter(pk=analytics_id).update(evalinsight=evalinsight , evalexectime=evalexectime , evalresuseoutput=evalresuseoutput , evaldataquality = evaldataquality)
    return HttpResponseRedirect(reverse('analytics:detail', args=(analytics_id,)))

def convert_emotion_to_integer(emotion):
    if emotion=='happy': return 1
    elif emotion=='serious': return 0
    elif emotion=='sad': return (-1)

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


def statistics_4_timeseries(request):

    d1 = datetime.date(2015,1,1)
    d2 =  date.today()
    diff = d2 - d1
    data=[]
    for i in range(diff.days + 1):
        dateToFilter = (d1 + datetime.timedelta(i)).isoformat()
        data.append(len(Analytics.objects.filter(Q(createdOn=dateToFilter) | Q(updatedOn=dateToFilter))))

    return HttpResponse(json.dumps(data), content_type='application/json')





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