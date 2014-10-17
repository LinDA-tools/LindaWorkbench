from django.http import HttpResponse, HttpResponseNotFound
from django.shortcuts import redirect, render, get_object_or_404

from django.views.decorators.csrf import csrf_exempt
from django.views.generic import ListView, UpdateView, DetailView, DeleteView

import json
import requests

from forms import *
from rdflib import Graph
from datetime import datetime, date


# from graphdb import views as query_views
from settings import SESAME_LINDA_URL, LINDA_HOME, RDF2ANY_SERVER, PRIVATE_SPARQL_ENDPOINT, QUERY_BUILDER_SERVER


def index(request):
    params = {}
    params['recent_datasources'] = DatasourceDescription.objects.all().order_by('createdOn')[:3]

    return render(request, 'index.html', params)

def analytics(request):
    params = {}


    return render(request, 'analytics/index.html', params)


def analyzeDatasource(request, **kwargs):
    params = {}
    params['datasource'] = DatasourceDescription.objects.get(name=kwargs.get('dtname'))

    return render(request, 'analytics/datasource.html', params)

def openDatasource(request):
    params = {}
    return render(request, 'datasource/open.html', params)


def terms(request):
    params = {}
    return render(request, 'terms.html', params)


def sparql(request):
    params = {}
    params['mode'] = "sparql"

    return render(request, 'sparql.html', params)


def profile(request, pk):
    user = User.objects.get(pk=pk)
    params = {'userModel': user}
    return render(request, 'users/profile.html', params)


class UserListView(ListView):
    model = User
    template_name = 'users/community.html'
    context_object_name = 'users'
    paginate_by = 20


class UserUpdateView(UpdateView):
    form_class = UserForm
    model = User
    template_name = 'users/profile-edit.html'
    context_object_name = 'user'

    def get_context_data(self, **kwargs):
        user = self.object
        context = super(UserUpdateView, self).get_context_data(**kwargs)
        context['current'] = 'account-settings'
        context['userProfileForm'] = UserProfileForm(instance=user.profile)
        context['userModel'] = user
        return context

    def get(self, *args, **kwargs):
        if str(self.request.user.id) != str(kwargs.get('pk')):
            res = HttpResponse("Unauthorized")
            res.status_code = 401
            return res
        else:
            return super(UserUpdateView, self).get(self, *args, **kwargs)

    def get_success_url(self, **kwargs):

        return "/profile/" + kwargs.get('pk')

    def post(self, *args, **kwargs):
        if str(self.request.user.id) != str(kwargs.get('pk')):
            res = HttpResponse("Unauthorized")
            res.status_code = 401
            return res
        else:
            data = self.request.POST
            user = self.request.user
            data['password'] = user.password
            data['date_joined'] = user.date_joined
            data['last_login'] = user.last_login
            data['is_active'] = user.is_active
            data['is_staff'] = user.is_staff
            data['is_superuser'] = user.is_superuser
            userForm = UserForm(data, instance=user)
            if userForm.is_valid():
                user = userForm.save(commit=False)
                userProfileForm = UserProfileForm(self.request.POST, instance=user.profile)
                if userProfileForm.is_valid():
                    user.save()
                    userProfile = userProfileForm.save(commit=False)
                    userProfile.user = user
                    userProfile.save()
                    if 'picture' in self.request.FILES:
                        picture = self.request.FILES['picture']
                        avatar = userProfile.avatar
                        avatar.photo_original = picture
                        avatar.save()
                    return redirect(self.get_success_url(**kwargs))
            return render(self.request, 'users/profile-edit.html', {
                'current': 'account-settings',
                'form': userForm,
                'userProfileForm': userProfileForm,
                'userModel': user
            })

class VocabularyDetailsView(DetailView):
    model = Vocabulary
    template_name = 'vocabulary/details.html'
    context_object_name = 'vocabulary'

    def get(self, *args, **kwargs):
        vocabulary = Vocabulary.objects.get(pk=kwargs.get('pk'))
        if not vocabulary.title_slug() == kwargs.get('slug'):
            return redirect(vocabulary.get_absolute_url())

        return super(VocabularyDetailsView, self).get(self, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(VocabularyDetailsView, self).get_context_data(**kwargs)

        #Load comments
        context['comments'] = VocabularyComments.objects.filter(vocabularyCommented=context['vocabulary'])

        #Check if user has voted for this vocabulary
        if self.request.user.is_authenticated():
            if (
                    VocabularyRanking.objects.filter(vocabularyRanked=context['vocabulary'],
                                                     voter=self.request.user).exists()):
                context['hasVoted'] = True
                context['voteSubmitted'] = \
                    VocabularyRanking.objects.filter(vocabularyRanked=context['vocabulary'], voter=self.request.user)[
                        0].vote
            else:
                context['hasVoted'] = False

        return context


class VocabularyUpdateView(UpdateView):
    form_class = VocabularyUpdateForm
    model = Vocabulary
    template_name = 'vocabulary/edit.html'
    context_object_name = 'vocabulary'

    def get_object(self):
        object = super(VocabularyUpdateView, self).get_object()
        if object.uploader.id != self.request.user.id:
            res = HttpResponse("Unauthorized")
            res.status_code = 401
            return res
        return object

    def get_context_data(self, **kwargs):
        context = super(VocabularyUpdateView, self).get_context_data(**kwargs)

        #Load categories
        context['categories'] = CATEGORIES

        return context

    def post(self, *args, **kwargs):
        oldVocabulary = Vocabulary.objects.get(pk=kwargs.get('pk'))

        data = self.request.POST
        data['dateModified'] = datetime.now()

        vocabularyForm = VocabularyUpdateForm(data, instance=oldVocabulary)

        #Validate form
        if vocabularyForm.is_valid():
            vocabularyForm.save()
            return redirect("/vocabulary/" + kwargs.get('pk'))
        else:
            return render(self.request, 'vocabulary/edit.html', {
                'vocabulary': oldVocabulary,
                'form': vocabularyForm,
            })


class VocabularyDeleteView(DeleteView):
    model = Vocabulary
    template_name = 'vocabulary/delete.html'
    context_object_name = 'vocabulary'
    success_url = '/vocabularies/'

    def get_object(self):
        object = super(VocabularyDeleteView, self).get_object()
        if (object.uploader.id != self.request.user.id):
            res = HttpResponse("Unauthorized")
            res.status_code = 401
            return res
        return object


class VocabularyVisualize(DetailView):
    model = Vocabulary
    template_name = 'vocabulary/visualize.html'
    context_object_name = 'vocabulary'

    def get_context_data(self, **kwargs):
        context = super(VocabularyVisualize, self).get_context_data(**kwargs)

        #Parse rdf
        g = Graph()
        n3data = urllib.urlopen(context['vocabulary'].downloadUrl).read()
        g.parse(data=n3data, format='n3')

        #Load subjects
        subjects = {}
        objects = {}
        predicates = []

        for (subject, predicate, object) in g:
            subjectName = subject.split("/")[-1].split("#")[-1]
            predicateName = predicate.split("/")[-1].split("#")[-1]
            objectName = object.split("/")[-1].split("#")[-1]

            if (predicateName == "type") and (objectName == "Class"):
                subjects[subject] = subjectName

            if predicateName == "domain":  #property
                objects[subject] = subjectName
                subjects[object] = objectName
                predicates.append((subject, predicate, object))

            if predicateName == "subClassOf":  #Attribute type
                subjects[subject] = subjectName
                subjects[object] = objectName
                predicates.append((subject, predicate, object))

            if predicateName == "range":  #Attribute type
                objects[subject] = subjectName + ": " + objectName

        context['subjects'] = subjects
        context['objects'] = objects
        context['predicates'] = predicates

        return context


class VocabularyListView(ListView):
    model = Vocabulary
    template_name = 'search/search.html'
    context_object_name = 'vocabularies'
    paginate_by = 10

    def get_queryset(self):
        qs = super(VocabularyListView, self).get_queryset().order_by('-lodRanking')
        print qs
        return qs


class ClassListView(ListView):
    model = VocabularyClass
    template_name = 'search/search.html'
    context_object_name = 'classes'
    paginate_by = 10

    def get_queryset(self):
        qs = super(ClassListView, self).get_queryset().order_by('-vocabulary__lodRanking')
        return qs


class PropertyListView(ListView):
    model = VocabularyProperty
    template_name = 'search/search.html'
    context_object_name = 'properties'
    paginate_by = 10

    def get_queryset(self):
        qs = super(PropertyListView, self).get_queryset().order_by('-vocabulary__lodRanking')
        return qs


def rateDataset(request, pk, vt):
    vocid = int(pk)
    voteSubmitted = int(vt)

    if request.is_ajax():
        dataJson = []
        res = {}

        if not request.user.is_authenticated():
            res['result'] = "You must be logged in to rate."
            code = 403
        else:
            if (voteSubmitted < 1) or (voteSubmitted > 5):
                res['result'] = "Invalid vote " + voteSubmitted + ", votes must be between 1 and 5."
                code = 401
            else:
                if not Vocabulary.objects.get(id=vocid):
                    res['result'] = "Vocabulary does not exist."
                    code = 404
                else:
                    if VocabularyRanking.objects.filter(vocabularyRanked=Vocabulary.objects.get(id=vocid),
                                                         voter=request.user).exists():
                        res['result'] = "You have already ranked this vocabulary."
                        code = 403
                    else:
                        #Create ranking object
                        vocabulary = Vocabulary.objects.get(id=vocid)
                        ranking = VocabularyRanking.objects.create(voter=request.user, vocabularyRanked=vocabulary,
                                                                   vote=voteSubmitted)
                        ranking.save()
                        #Edit vocabulary ranking
                        vocabulary.votes = vocabulary.votes + 1
                        vocabulary.score = vocabulary.score + voteSubmitted
                        vocabulary.save()
                        res['result'] = "Your vote was submitted."
                        code = 200

        dataJson.append(res)
        data = json.dumps(dataJson)
    else:
        data = 'fail'
        code = 401

    #Create the response
    mimetype = 'application/json'
    response = HttpResponse(data, mimetype)
    response.status_code = code
    return response


def postComment(request, pk):
    vocid = int(pk)
    commentTxt = request.POST['comment']

    if request.is_ajax():
        dataJson = []
        res = {}

        if (not Vocabulary.objects.get(id=vocid)):
            res['result'] = "Vocabulary does not exist."
            code = 404
        else:
            if (not request.user.is_authenticated()):
                res['result'] = "You must be logged in to comment."
                code = 403
            else:
                #Create and store the comment
                comment = VocabularyComments.objects.create(commentText=commentTxt,
                                                            vocabularyCommented=Vocabulary.objects.get(id=vocid),
                                                            user=request.user, timePosted=datetime.now())
                comment.save()
                res['result'] = "Your comment was submitted."
                code = 200

        dataJson.append(res)
        data = json.dumps(dataJson)
    else:
        data = 'fail'
        code = 401

    #Create the response
    mimetype = 'application/json'
    response = HttpResponse(data, mimetype)
    response.status_code = code
    return response


def downloadRDF(request, pk, type):
    vocid = int(pk)

    voc = get_object_or_404(Vocabulary, pk=vocid)

    if not type in ("xml", "n3", "nt"):
        return HttpResponseNotFound("Invalid type.")

    #Convert rdf to the appropriate type
    g = Graph()
    n3data = urllib.urlopen(voc.downloadUrl).read()
    g.parse(data=n3data, format='n3')

    #Return response
    mimetype = "application/octet-stream"
    response = HttpResponse(g.serialize(format=type), mimetype=mimetype)
    response["Content-Disposition"] = "attachment; filename=%s.%s" % (voc.title_slug(), type)
    return response


from haystack.query import SearchQuerySet


def autocomplete(request):
    sqs = SearchQuerySet().autocomplete(content_auto=request.GET.get('q', ''))[:5]
    suggestions = [result.title for result in sqs]
    # Make sure you return a JSON object, not a bare list.
    # Otherwise, you could be vulnerable to an XSS attack.
    the_data = json.dumps({
        'results': suggestions
    })
    return HttpResponse(the_data, content_type='application/json')

#Datasources
def datasources(request):
    params = {}
    params['sortOptions'] = {('title', 'Title'), ('date', 'Date')}
    params['sortBy'] = forms.Select(choices=params['sortOptions']).render('sortBy', '', attrs={"id": 'id_sortBy',})


    if request.GET.get("sort") == "title":
        params['datasources'] = DatasourceDescription.objects.all().order_by('title')
        params['sort_default'] = "Title"
    else:
        params['datasources'] = DatasourceDescription.objects.all()
        params['sort_default'] = "Date"

    return render(request, 'datasource/index.html', params)

def datasourceCreate(request):
    if request.POST:
        if request.POST.get("type") == "private":
            return redirect("/datasource/create/" + request.POST.get("datatype"))
    else:
        params = {}
        params['types'] = {('private', 'Private'), ('public', 'Public')}
        params['datatypes'] = {('csv', 'CSV file'), ('db', 'Database (relational)'), ('xls', 'Excel file'), ('rdf', 'RDF file')}

        params['typeSelect'] = forms.Select(choices=params['types']).render('type', '', attrs={"id": 'id_type',})
        params['datatypeSelect'] = forms.Select(choices=params['datatypes']).render('datatype', '', attrs={"id": 'id_datatype',})

        return render(request, 'datasource/create.html', params)

def datasourceReplace(request, name):
    if request.POST:
        if request.POST.get("type") == "private":
            return redirect("/datasource/" + name + "/replace/" + request.POST.get("datatype"))
    else:
        params = {}
        params['types'] = {('private', 'Private'), ('public', 'Public')}
        params['datatypes'] = {('csv', 'CSV file'), ('db', 'Database (relational)'), ('xls', 'Excel file'), ('rdf', 'RDF file')}

        params['typeSelect'] = forms.Select(choices=params['types']).render('type', '', attrs={"id": 'id_type',})
        params['datatypeSelect'] = forms.Select(choices=params['datatypes']).render('datatype', '', attrs={"id": 'id_datatype',})

        return render(request, 'datasource/replace.html', params)

def datasourceCreateRDF(request):
    if request.POST:
        #Get the posted rdf data
        if "rdffile" in request.FILES:
            rdf_content = request.FILES["rdffile"].read()
        else:
            rdf_content = request.POST.get("rdfdata")


        #Call the corresponding web service
        headers = {'accept': 'application/json'}
        callAdd = requests.post(LINDA_HOME + "api/datasource/create/", headers=headers, data={"content": rdf_content, "title": request.POST.get("title")})

        j_obj = json.loads(callAdd.text)
        if j_obj['status'] == '200':
            return redirect("/")
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

def datasourceReplaceRDF(request, dtname):
    if request.POST:
        #Get the posted rdf data
        if "rdffile" in request.FILES:
            rdf_content = request.FILES["rdffile"].read()
        else:
            rdf_content = request.POST.get("rdfdata")

        #Call the corresponding web service
        headers = {'accept': 'application/json'}
        callAdd = requests.post(LINDA_HOME + "api/datasource/" + dtname + "/replace/", headers=headers, data={"content": rdf_content,})

        j_obj = json.loads(callAdd.text)
        if j_obj['status'] == '200':
            return redirect("/")
        else:
            params = {}

            params['form_error'] = j_obj['message']
            params['rdfdata'] = request.POST.get("rdfdata")

            return render(request, 'datasource/replace_rdf.html', params)
    else:
        params = {}
        params['title'] = DatasourceDescription.objects.filter(name=dtname)[0].title
        params['rdfdata'] = ""

        return render(request, 'datasource/replace_rdf.html', params)

def datasourceDownloadRDF(request, dtname):
    callDatasource = requests.get(LINDA_HOME + "api/datasource/" + dtname + "/")
    data = json.loads(callDatasource.text)['content']
    mimetype = "application/xml+rdf"
    return HttpResponse(data, mimetype)

def datasourceDelete(request, dtname):
    if request.POST:
        headers = {'accept': 'application/json'}
        callDelete = requests.post(LINDA_HOME + "api/datasource/" + dtname + "/delete/", headers=headers)
        j_obj = json.loads(callDelete.text)
        if j_obj['status'] == '200':
            return redirect("/")
        else:
            params = {}
            params['form_error'] = j_obj['message']

            return render(request, 'datasource/delete.html', params)
    else:
        params = {}
        params['title'] = DatasourceDescription.objects.filter(name=dtname)[0].title

        return render(request, 'datasource/delete.html', params)

#Query builder
def queryBuilder(request):
    params = {}
    params['datasources'] = DatasourceDescription.objects.all()
    params['PRIVATE_SPARQL_ENDPOINT'] = PRIVATE_SPARQL_ENDPOINT
    params['RDF2ANY_SERVER'] = RDF2ANY_SERVER
    params['mode'] = "builder"
    return render(request, 'query-builder/index.html', params)


def query_get_class(request):
    js = requests.get(QUERY_BUILDER_SERVER + 'query/builder_classes.js?search=' + request.GET['search'] + '&dataset=' + request.GET['dataset'])
    return HttpResponse(js, "application/javascript")


def query_class_properties(request):
    if "all" in request.GET.keys():
        all = request.GET['all']
    else:
        all = "true"

    link = QUERY_BUILDER_SERVER + '/query/class_properties.js?dataset=' + request.GET['dataset'] + "&class_uri=" + request.GET['class_uri'] + "&all=" + all
    if "type" in request.GET.keys():
        link = link + "&type=" + request.GET['type']
        
    js = requests.get(link)
    return HttpResponse(js, "application/javascript")


def query_class_schema_properties(request):
    js = requests.get(QUERY_BUILDER_SERVER + "/query/class_schema_properties.js?dataset=" + request.GET['dataset'] + "&class_uri=" + request.GET['class_uri'])
    return HttpResponse(js, "application/javascript")


def query_subclasses(request):
    js = requests.get(QUERY_BUILDER_SERVER + "/query/subclasses.js?dataset=" +  request.GET['dataset'] + "&class_uri=" + request.GET['class_uri'])
    return HttpResponse(js, "application/javascript")


def query_property_ranges(request):
    js = requests.get(QUERY_BUILDER_SERVER + "/query/property_ranges.js?property_uri=" + request.GET['property_uri'] + "&type=" + request.GET['type'] + "&dataset=" + request.GET['dataset'] + "&property_name=" + request.GET['property_name'])
    return HttpResponse(js, "application/javascript")


def query_objects(request):
    js = requests.get(QUERY_BUILDER_SERVER + "/query/builder_objects.js?search=" + request.GET['search'] + "&dataset=" + request.GET['dataset'] + "&classes="  + request.GET['classes'])
    return HttpResponse(js, "application/javascript")

def query_execute_sparql(request):
    # Set headers
    headers = {'accept': 'application/json'}

    # Send the request
    resp = requests.get(QUERY_BUILDER_SERVER + "/query/execute_sparql", headers=headers, data={"query": request.GET['query'], "dataset": request.GET['dataset']})

    return HttpResponse(resp.content, "application/json")


# Tools
def rdb2rdf(request):
    params = {}
    params['datasources'] = {}
    params['dbcolumns'] = {('name', 'Name'), ('id', 'ID')}
    params['dbtables'] = {('_write_custom_query', 'Write a custom query'), ('product', 'Product')}

    return render(request, 'rdb2rdf/rdb2rdf.html', params)

# Api view


#Get a list with all users - used in autocomplete
def api_users(request):
    if request.is_ajax():
        q = request.GET.get('term', '')
        usernameList = User.objects.filter(username__icontains=q)
        last_nameList = User.objects.filter(first_name__icontains=q)
        first_nameList = User.objects.filter(first_name__icontains=q)
        userList = usernameList | first_nameList | last_nameList
        results = []
        for user in userList[:20]:
            user_json = {}
            user_json['id'] = user.id
            if user.get_full_name():
                user_json['label'] = user.get_full_name() + ' (' + user.username + ')'
            else:
                user_json['label'] = user.username
            user_json['value'] = user.username
            results.append(user_json)

        data = json.dumps(results)
    else:
        data = 'fail'
    mimetype = 'application/json'
    return HttpResponse(data, mimetype)

#Return a list with all created datasources
@csrf_exempt
def api_datasources_list(request):
    results = []
    for source in DatasourceDescription.objects.all():
        source_info = {}
        source_info['name'] = source.name
        source_info['uri'] = source.uri
        source_info['title'] = source.title
        results.append(source_info)

    data = json.dumps(results)
    mimetype = 'application/json'
    return HttpResponse(data, mimetype)

#Create a new datasource with some rdf data
@csrf_exempt
def api_datasource_create(request):
    results = {}
    if request.POST: #request must be POST
        #check if datasource already exists
        if DatasourceDescription.objects.filter(title=request.POST.get("title")).exists():
            results['status'] = '403'
            results['message'] = "Datasource already exists."
        else:
            #find the slug
            sname = slugify(request.POST.get("title"))

            #get rdf type
            if request.POST.get("format"):
                rdf_format = request.POST.get("format")
            else:
                rdf_format = 'application/rdf+xml' #rdf+xml by default

            #make REST api call to add rdf data
            headers = {'accept': 'application/rdf+xml', 'content-type': rdf_format}
            callAdd = requests.post(SESAME_LINDA_URL + 'rdf-graphs/' + sname, headers=headers, data=request.POST.get("content"))

            if callAdd.text == "":
                #create datasource description
                source = DatasourceDescription.objects.create(title=request.POST.get("title"),
                                                          name=sname,
                                                          uri=SESAME_LINDA_URL + "rdf-graphs/" + sname, createdOn=datetime.now(), lastUpdateOn=datetime.now())

                results['status'] = '200'
                results['message'] = 'Datasource created succesfully.'
                results['name'] = sname
                results['uri'] = SESAME_LINDA_URL + "rdf-graphs/" + sname
            else:
                results['status'] = '500'
                results['message'] = 'Error storing rdf data: ' + callAdd.text
    else:
        results['status'] = '403'
        results['message'] = 'POST method must be used to create a datasource.'

    data = json.dumps(results)
    mimetype = 'application/json'
    return HttpResponse(data, mimetype)

#Retrieve all data from datasource in specified format
@csrf_exempt
def api_datasource_get(request, dtname):
    results = {}

    #check if datasource exists
    if DatasourceDescription.objects.filter(name=dtname).exists():
        #get rdf type
        if request.GET.get("format"):
            rdf_format = request.GET.get("format")
        else:
            rdf_format = 'application/rdf+xml' #rdf+xml by default

        #make REST api call to update graph
        headers = {'accept': rdf_format, 'content-type': 'application/rdf+xml'}
        callReplace = requests.get(SESAME_LINDA_URL + 'rdf-graphs/' + dtname, headers=headers)

        results['status'] = '200'
        results['message'] = "Datasource retrieved successfully"
        results['content'] = callReplace.text
    else:
        results['status'] = '403'
        results['message'] = "Datasource does not exist."

    data = json.dumps(results)
    mimetype = 'application/json'
    return HttpResponse(data, mimetype)

#Replace all data from datasource with new rdf data
@csrf_exempt
def api_datasource_replace(request, dtname):
    results = {}
    if request.POST: #request must be POST
        #check if datasource exists
        if DatasourceDescription.objects.filter(name=dtname).exists():
            #get rdf type
            if request.POST.get("format"):
                rdf_format = request.POST.get("format")
            else:
                rdf_format = 'application/rdf+xml' #rdf+xml by default

            #make REST api call to update graph
            headers = {'accept': 'application/rdf+xml', 'content-type': rdf_format}
            callReplace = requests.put(SESAME_LINDA_URL + 'rdf-graphs/' + dtname, headers=headers, data=request.POST.get("content"))

            if callReplace.text == "":
                #update datasource database object
                source = DatasourceDescription.objects.filter(name=dtname)[0]
                source.lastUpdateOn = datetime.now()
                source.save()

                results['status'] = '200'
                results['message'] = 'Datasource updated succesfully.' + callReplace.text
            else:
                results['status'] = '500'
                results['message'] = 'Error replacing rdf data: ' + callReplace.text

        else:
            results['status'] = '403'
            results['message'] = "Datasource does not exist."
    else:
        results['status'] = '403'
        results['message'] = 'POST method must be used to update a datasource.'

    data = json.dumps(results)
    mimetype = 'application/json'
    return HttpResponse(data, mimetype)

#Replace all data from datasource with new rdf data
@csrf_exempt
def api_datasource_delete(request, dtname):
    results = {}
    #if request.POST: #request must be POST
    #check if datasource exists
    if DatasourceDescription.objects.filter(name=dtname).exists():
        #delete object from database
        source = DatasourceDescription.objects.filter(name=dtname)[:1].get()
        source.delete()

        #make REST api call to delete graph
        callDelete = requests.delete(SESAME_LINDA_URL + 'rdf-graphs/' + dtname)

        if callDelete.text == "":
            results['status'] = '200'
            results['message'] = 'Datasource deleted succesfully.'
        else:
            results['status'] = '500'
            results['message'] = 'Error deleting datasource: ' + callDelete.text
    else:
         results['status'] = '403'
         results['message'] = "Datasource does not exist."
    #else:
    #    results['status'] = '403'
    #    results['message'] = 'POST method must be used to delete a datasource.'

    data = json.dumps(results)
    mimetype = 'application/json'
    return HttpResponse(data, mimetype)

'''
def update_vocabulary_stats(request):
    ranks = [("http://www.w3.org/1999/02/22-rdf-syntax-ns", 248),("http://www.w3.org/2000/01/rdf-schema", 214),("http://www.w3.org/2002/07/owl", 114),("http://purl.org/dc/terms/", 93),("http://www.w3.org/2004/02/skos/core", 65),("http://purl.org/dc/elements/1.1/", 50),("http://purl.org/dc/terms", 47),("http://rdfs.org/ns/void", 32),("http://purl.org/dc/elements/1.1", 31),("http://www.w3.org/2003/01/geo/wgs84_pos", 25),("http://www.obofoundry.org/ro/ro.owl", 21),("http://purl.obolibrary.org/obo/", 20),("http://eagle-i.org/ont/repo/1.0/", 18),("http://eagle-i.org/ont/app/1.0/", 18),("http://www.w3.org/2006/time", 17),("http://purl.org/vocab/resourcelist/schema", 17),("http://www.aktors.org/ontology/portal", 16),("http://www.w3.org/ns/prov", 16),("http://id.southampton.ac.uk/ns/", 15),("http://usefulinc.com/ns/doap", 15),("http://purl.org/dc", 14),("http://rdfs.org/sioc/ns", 14),("http://purl.org/void/provenance/ns/", 14),("http://www.aktors.org/ontology/support", 13),("http://open.vocab.org/terms", 12),("http://rdfs.org/sioc/spec", 12),("http://purl.org/net/provenance/ns", 12),("http://purl.org/NET/scovo", 11),("http://www.w3.org/2000/10/swap/pim/contact", 11),("http://purl.org/ontology/bibo/", 10),("http://purl.org/openorg/", 10),("http://lists.talis.com/schema/temp", 10),("http://schemas.talis.com/2009/events", 10),("http://www.w3.org/2006/vcard/ns", 9),("http://purl.org/twc", 9),("http://inference-web.org/2.0/pml-justification.owl", 9),("http://inference-web.org/2.0/pml-provenance.owl", 9),("http://inference-web.org/2.1exper/pml-provenance.owl", 9),("http://purl.org/linked-data/cube", 8),("http://data.ordnancesurvey.co.uk/ontology/spatialrelations/", 8),("http://openprovenance.org/ontology", 8),("http://www.semanticdesktop.org/ontologies/nfo/", 8),("http://obofoundry.org/ro/ro.owl", 8),("http://creativecommons.org/ns", 7),("http://purl.org/vocab", 7),("http://purl.org/NET/c4dm/event.owl", 6),("http://www.w3.org/2008/05/skos", 6),("http://www.geonames.org/ontology", 6),("http://www.w3.org/1999/xhtml/vocab", 6),("http://www.w3.org/2003/06/sw-vocab-status/ns", 6),("http://purl.org/linked-data/sdmx/2009/dimension", 5),("http://semantic-mediawiki.org/swivt/1.0", 5),("http://purl.org/ontology/bibo", 5),("http://purl.org/goodrelations/v1", 5),("http://logd.tw.rpi.edu/source", 5),("http://rdfs.org/sioc/spec/", 5),("http://purl.org/vocab/lifecycle/schema", 5),("http://purl.org/vocab/frbr/core", 4),("http://www.w3.org/2008/05/skos-xl", 4),("http://dbpedia.org/ontology", 4),("http://dbpedia.org/property", 4),("http://purl.org/vocab/vann/", 4),("http://iflastandards.info/ns/isbd/elements/", 3),("http://swrc.ontoware.org/ontology", 3),("http://www.metalex.eu/metalex/2008-05-02", 3),("http://www.isocat.org/ns/dcr.rdf", 3),("http://www.georss.org/georss/", 3),("http://schema.org", 3),("http://ns.nature.com/terms/", 3),("http://schemas.talis.com/2009/events/", 3),("http://xmlns.com/foaf/spec/", 116),("http://lexvo.org/ontology", 2),("http://www.monnet-project.eu/lemon", 2),("http://open.vocab.org/terms/", 2),("http://dbpedia.org/ontology/", 2),("http://eprints.org/relation/", 2),("http://eprints.org/ontology/", 2),("http://data.ordnancesurvey.co.uk/ontology/spatialrelations", 2),("http://opendatacommunities.org/def/IMD", 2),("http://www.europeana.eu/schemas/edm", 2),("http://www.lexinfo.net/ontology/2.0/lexinfo", 2),("http://www.w3.org/ns/adms", 2),("http://data.ordnancesurvey.co.uk/ontology/geometry/", 2),("http://data.semanticweb.org/ns/swc/ontology", 2),("http://purl.org/NET/c4dm/timeline.owl", 2),("http://research.data.gov.uk/def/project/", 2),("http://RDVocab.info/ElementsGr2/", 2),("http://www.openarchives.org/ore/terms/", 2),("http://purl.org/net7/vocab/locs/v1", 2),("http://web.resource.org/cc/", 2),("http://lod2.eu/schema", 2),("http://RDVocab.info/ElementsGr2", 2),("http://purl.obolibrary.org/obo", 2),("http://aims.fao.org/aos/geopolitical.owl", 2),("http://courseware.rkbexplorer.com/ontologies/courseware", 2),("http://purl.org/ontology/mo", 2),("http://eagle-i.org/ont/repo/1.0", 2),("http://ns.ontowiki.net/SysOnt", 2),("http://swpatho.ag-nbi.de/context/meta.owl", 2),("http://eagle-i.org/ont/app/1.0", 2),("http://ns.nature.com/terms", 2),("http://www.ebi.ac.uk/efo/swo/", 2),("http://purl.org/dc/dcam", 2),("http://purl.org/vocab/bio/0.1", 2),("http://bio2rdf.org/bio2rdf_resource", 2),("http://id.loc.gov/vocabulary", 2),("http://iflastandards.info/ns/isbd/elements", 2),("http://d-nb.info/standards/elementset/gnd", 1),("http://fao.270a.info/property/", 1),("http://www.systemone.at/2006/03/wikipedia", 1),("http://data.linkedct.org/vocab/resource", 1),("http://purl.org/NET/flyatlas/schema", 1),("http://eunis.eea.europa.eu/rdf/species-schema.rdf", 1),("http://purl.org/ontology/similarity", 1),("http://www.w3.org/2007/05/powder-s", 1),("http://data.linkedopendata.it/istat/resource/", 1),("http://dati.camera.it/ocd/", 1),("http://www.ebu.ch/metadata/ontologies/ebucore/ebucore", 1),("http://rhizomik.net/ontologies/2005/03/Mpeg7-2001.owl", 1),("http://def.bibsys.no/xmlns/radatana/1.0", 1),("http://data.lod2.eu/gfmf/", 1),("http://rs.tdwg.org/dwc/terms/", 1),("http://prtr.ec.europa.eu/rdf/schema.rdf", 1),("http://purl.org/ASN/schema/core/", 1),("http://purl.org/net/bdgp/schema/", 1),("http://publicspending.medialab.ntua.gr/ontology", 1),("http://www.opentox.org/api/1.1", 1),("http://www.nlm.nih.gov/mesh/2006", 1),("http://sw.opencyc.org/concept/", 1),("http://purl.org/vocab/bio/0.1/", 1),("http://purl.org/gem/qualifiers/", 1),("http://mlode.nlp2rdf.org/resource/jrc-names/", 1),("http://linkedscotland.org/def/geography", 1),("http://purl.org/net7/vocab/scuole/v1", 1),("http://www.w3.org/ns/locn", 1),("http://core.kmi.open.ac.uk/data", 1),("http://www.w3.org/ns/legal", 1),("http://sw.cyc.com/CycAnnotations_v1", 1),("http://purl.org/net/unis/iris", 1),("http://www.europeana.eu/schemas", 1),("http://data.lod2.eu/scoreboard", 1),("http://www.holygoat.co.uk/owl/redwood/0.1/tags/", 1),("http://www.eionet.europa.eu/gemet/gemet-skoscore.rdf", 1),("http://purl.org/ontology/mo/", 1),("http://www.semwebtech.org/mondial/10/meta", 1),("http://greek-lod.math.auth.gr/police/resource/", 1),("http://purl.org/linked-data/xkos", 1),("http://ndl.go.jp/dcndl/terms", 1),("http://ndl.go.jp/dcndl/terms/", 1),("http://publishmydata.com/def/statistics", 1),("http://www.kanzaki.com/ns/whois", 1),("http://www.openarchives.org/ore", 1),("http://erlangen-crm.org/120111/", 1),("http://spatial.ucd.ie/lod/osn/property/", 1),("http://data.nytimes.com/elements", 1),("http://statistics.data.gov.uk/def/administrative-geography", 1),("http://semanticweb.org/id/", 1),("http://rdvocab.info/Elements/", 1),("http://purl.org/net7/vocab/gracc/v1", 1),("http://www.fao.org/countryprofiles/geoinfo/geopolitical/resource/", 1),("http://minsky.gsi.dit.upm.es/semanticwiki/index.php/Special", 1),("http://www.pokepedia.fr/index.php/Sp%C3%A9cial", 1),("http://data.ifpri.org/lod/ghi/resource/", 1),("http://data.ordnancesurvey.co.uk/ontology", 1),("http://www.eionet.europa.eu/gemet/2004/06/gemet-schema.rdf", 1),("http://fr.dbpedia.org/property/", 1),("http://data.lirmm.fr/ontologies/passim", 1),("http://meriterm.org/heartfailure/heartfailure.rdf", 1),("http://linkedscotland.org/def/sns", 1),("http://vocab.org/transit/terms/", 1),("http://ec.europa.eu/eurostat/ramon/ontologies/geographic.rdf", 1),("http://ebiquity.umbc.edu/ontology/publication.owl", 1),("http://www.w3.org/TR/rdf-schema/", 1),("http://id.loc.gov/vocabulary/relators/", 1),("http://www.languagelibrary.eu/owl/simple/SimpleOntology", 1),("http://crime.psi.enakting.org/id/", 1),("http://patents.data.gov.uk/def/patents/", 1),("http://www.w3.org/ns/prov-o/", 1),("http://msc2010.org/resources/MSC/2010/msc2010", 1),("http://www.w3.org/2002/12/cal/ical", 1),("http://www.loc.gov/loc.terms/relators/", 1),("http://zeitkunst.org/bibtex/0.1/bibtex.owl", 1),("http://ja.dbpedia.org/property/", 1),("http://telegraphis.net/ontology/geography/geography", 1),("http://purl.org/twc/vocab/conversion", 1),("http://telegraphis.net/ontology/measurement/code", 1),("http://bio2rdf.org/ns/bio2rdf", 1),("http://www.example.org/Movie", 1),("http://nl.dbpedia.org/property", 1),("http://www.cs.vu.nl/~mcaklein/onto/swrc_ext/2005/05", 1),("http://wiki.prov.vic.gov.au/index.php/Special", 1),("http://www.klappstuhlclub.de/wp/posts/", 1),("http://www.aktors.org/ontology/extension", 1),("http://thedatahub.org/en/dataset/uk-gdp-since-1948", 1),("http://es.dbpedia.org/page", 1),("http://psi.oasis-open.org/iso/639/", 1),("http://corpora.nlp2rdf.org/wortschatz/ontology/", 1),("http://www.w3.org/2002/12/cal/icaltzid", 1),("http://purl.org/vocab/relationship/", 1),("http://rdf.muninn-project.org/ontologies/organization", 1),("http://dimitros.net/rdf/ontology", 1),("http://cbasewrap.ontologycentral.com/vocab", 1),("http://bio2rdf.org/ns/hgnc", 1),("http://www.ntnu.no/ub/data/nl", 1),("http://aksw.org/schema", 1),("http://www.w3.org/2003/11/swrl", 1),("http://rdf.muninn-project.org/ontologies/muninn", 1),("http://telegraphis.net/ontology/measurement/measurement", 1),("http://purl.org/dc/elements/1.1/description", 1),("http://www.isotc211.org/schemas/grg", 1),("http://purl.org/ontology/similarity", 1),("http://www.w3.org/2002/12/cal", 1),("http://mged.sourceforge.net/ontologies/MGEDOntology.owl", 1),("http://logd.tw.rpi.edu/source/twc-rpi-edu/dataset/instance-hub-us-toxic-chemicals/vocab/enhancement/1/", 1),("http://ns.ontowiki.net/SysOnt/Site", 1),("http://prelex.publicdata.eu/ontology", 1),("http://purl.org/twc/vocab/conversion/", 1),("http://vocab.data.gov/def/drm/", 1),("http://purl.org/vocab/vann", 1),("http://bio2rdf.org/arrayexpress", 1),("http://www.w3.org/2002/12/cal/icaltzd", 1),("http://www.w3.org/TR/2009/REC-skos-reference-20090818", 1),("http://eurostat.linked-statistics.org/property", 1),("http://ns.aksw.org/spatialHierarchy", 1),("http://el.dbpedia.org/property", 1),("http://vitro.mannlib.cornell.edu/ns/vitro/0.7", 1),("http://purl.org/adms/sw", 1),("http://prismstandard.org/namespaces/basic/2.1", 1),("http://prismstandard.org/namespaces/basic/2.1/", 1),("http://vocab.ox.ac.uk/projectfunding", 1),("http://vocab.lenka.no/geo-deling", 1),("http://openei.org/wiki/Special", 1),("http://wifo5-04.informatik.uni-mannheim.de/eurostat/resource/eurostat/", 1),("http://data.linkededucation.org/ns/linked-education.rdf", 1),("http://reference.data.gov.uk/def/intervals", 1),("http://idswrapper.appspot.com/vocabulary", 1),("http://ogp.me/ns", 1),("http://purl.org/linked-data/sdmx/2009/measure", 1),("http://www.yso.fi/onto/mesh", 1),("http://eur-lex.publicdata.eu/ontology", 1),("http://lexinfo.net/corpora/alpino/categories", 1),("http://purl.org/net/vocab/2004/07/visit", 1),("http://www.daml.org/2001/09/countries/iso-3166-ont", 1),("http://xmlns.notu.be/aair", 1),("http://ecowlim.tfri.gov.tw/lode/resource/eco/", 1),("http://monnetproject.deri.ie/ietflang/prop", 1),("http://purl.org/vocommons/voaf", 1),("http://www.gutenberg.org/2009/pgterms", 1),("http://www.spdx.org/rdf/terms", 1),("http://www.umweltbundesamt.de/2009/08/UmThesScheme", 1),("http://data.colourphon.co.uk/def/colour-ontology", 1),("http://purl.org/ontomedia/ext/common/being", 1),("http://sw.deri.org/2005/08/conf/cfp.owl", 1),("http://www.rdfabout.com/rdf/schema/politico", 1),("http://ecowlim.tfri.gov.tw/lode/resource/flyhorse/", 1),("http://ligadonospoliticos.com.br/politicobr", 1),("http://purl.org/net/OCRe/statistics.owl", 1),("http://www.w3.org/2003/12/exif/ns", 1),("http://data.kdata.kr/heritage", 1),("http://purl.org/linked-data/api/vocab", 1),("http://ontologi.es/colour/vocab", 1),("http://purl.org/vocab/aiiso/schema", 1),("http://rdf.data-vocabulary.org/", 1),("http://vivoweb.org/ontology/core", 1),("http://www.ebi.ac.uk/efo/", 1),("http://www.loc.gov/loc.terms/relators", 1),("http://www.w3.org/ns/regorg", 1),("http://geovocab.org/spatial", 1),("http://opencorporates.com/vocab/0.1", 1),("http://purl.org/net/inkel/rdf/schemas/lang/1.1", 1),("http://umbel.org/umbel", 1),("http://a9.com/-/spec/opensearch/1.1/", 1),("http://data.kdata.kr/property", 1),("http://dbpedia.org/property/", 1),("http://models.okkam.org/ENS-core-vocabulary", 1),("http://purl.org/net/vocab/2004/03/label", 1),("http://rdf.muninn-project.org/ontologies/military", 1),("http://RDVocab.info/elements", 1),("http://www.ontologydesignpatterns.org/ont/web/irw.owl", 1),("http://data.fundacionctic.org/vocab/catalog/datasets", 1),("http://lexvo.org/", 1),("http://lod2.eu", 1),("http://lod2.eu/view", 1),("http://n-lex.publicdata.eu/ontology/", 1),("http://purl.org/linked-data/sdmx/2009/concept", 1),("http://purl.org/net/OCRe/study_protocol.owl", 1),("http://purl.org/net/pingback/", 1),("http://purl.org/olia/ubyCat.owl", 1),("http://rdfohloh.wikier.org/ns", 1),("http://rdvocab.info/elements/", 1),("http://rdvocab.info/Elements", 1),("http://rdvocab.info/RDARelationshipsWEMI", 1),("http://RDVocab.info/RDARelationshipsWEMI", 1),("http://vocab.org/waiver/terms", 1),("http://webns.net/mvcb", 1),("http://web.resource.org/cc", 1),("http://www.rechercheisidore.fr/property/", 1),("http://www.w3.org/2000/01-rdf-schema", 1),]
    vocabs = Vocabulary.objects.all()

    for vocab in vocabs:
        print vocab.title
        if vocab.id > 2018:
            for rank in ranks:
                if vocab.preferredNamespaceUri == rank[0]:
                    vocab.lodRanking = rank[1]
                    print vocab.lodRanking
                    vocab.save()
'''
