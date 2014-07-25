from plistlib import Data
from django.http import HttpResponse, HttpResponseNotFound
from django.shortcuts import redirect, render, get_object_or_404
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import ListView, UpdateView, DetailView, DeleteView

import json
import requests
from forms import *
from rdflib import Graph
from datetime import datetime


# from graphdb import views as query_views
from linda.settings import SESAME_LINDA_URL


def index(request):
    params = {}
    params['recent_datasources'] = DatasourceDescription.objects.all().order_by('createdOn')[:3]

    return render(request, 'index.html', params)

def visualizations(request):
    params = {}
    return render(request, 'visualizations/index.html', params)

def visualizeDatasource(request, **kwargs):
    params = {}
    params['datasource'] = DatasourceDescription.objects.get(name=kwargs.get('dtname'))

    return render(request, 'visualizations/datasource.html', params)

def analytics(request):
    params = {}


    return render(request, 'analytics/index.html', params)

def analyzeDatasource(request, **kwargs):
    params = {}
    params['datasource'] = DatasourceDescription.objects.get(name=kwargs.get('dtname'))

    return render(request, 'analytics/datasource.html', params)

def transformations(request):
    params = {}
    return render(request, 'transformations/index.html', params)

def openDatasource(request):
    params = {}
    return render(request, 'datasource/open.html', params)

def terms(request):
    params = {}
    return render(request, 'terms.html', params)


def sparql(request):
    params = {}
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
        if (object.uploader.id != self.request.user.id):
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

"""
class VocabularySearchView(ListView):
    model = Vocabulary
    template_name = 'vocabulary-search/index.html'
    paginate_by = 20

    def get_context_data(self, **kwargs):
        context = super(VocabularySearchView, self).get_context_data(**kwargs)

        #Get search results
        #TODO get search results

        results = []

        # TODO fix the response to actual results and search
        # actual_results = query_views.query()


        for i in range(1, 1000):
            item = {}
            item['id'] = "%s" % str(i)
            item['shortTitle'] = "foaf"
            item['title'] = "Friend of a Friend vocabulary"
            item['preferredNamespacePrefix'] = "foaf"
            item['preferredNamespaceUri'] = "http://xmlns.com/foaf/0.1/"
            item[
                'description'] = "FOAF is a project devoted to linking people and information using the Web. Regardless of whether information is in people's heads, in physical or digital documents, or in the form of factual data, it can be linked."
            item['creator'] = "http://google.com/DanBrickley"
            item['modified'] = "2014-01-14"
            results.append(item)

        #paginate results
        paginator = Paginator(results, self.paginate_by)

        page = self.request.GET.get('page')

        try:
            page_vocabularies = paginator.page(page)
        except PageNotAnInteger:
            # If page is not an integer, deliver first page.
            page_vocabularies = paginator.page(1)
        except EmptyPage:
            # If page is out of range (e.g. 9999), deliver last page of results.
            page_vocabularies = paginator.page(paginator.num_pages)

        context['vocabularylist'] = page_vocabularies
        context['page_obj'] = page_vocabularies

        return context
"""

class VocabularyVisualize(DetailView):
    model = Vocabulary
    template_name = 'vocabulary/visualize.html'
    context_object_name = 'vocabulary'

    def get_context_data(self, **kwargs):
        context = super(VocabularyVisualize, self).get_context_data(**kwargs)

        #Parse rdf
        g = Graph()
        g.parse(context['vocabulary'].downloadUrl)

        #Load subjects
        subjects = {}
        objects = {}
        predicates = []

        for (subject, predicate, object) in g:
            subjectName = subject.split("/")[-1]
            predicateName = predicate.split("#")[-1]
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
                objects[subject] = subject.split("/")[-1] + ": " + object.split("/")[-1].split("#")[-1]

        context['subjects'] = subjects
        context['objects'] = objects
        context['predicates'] = predicates
        """
        #Load objects
        context['objects'] = {}
        for object in g.objects():
            context['objects'][object] = object.split("/")[-1]

        #Load predicates
        context['predicates'] = []
        for subj, pred, obj in g:
            context['predicates'].append( (subj, pred, obj) )
        """

        return context


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
    g.parse(voc.downloadUrl)

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
    else:
        params['datasources'] = DatasourceDescription.objects.all()

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
        callAdd = requests.post("http://localhost:8000/api/datasource/create/", headers=headers, data={"content": rdf_content, "title": request.POST.get("title")})

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
        callAdd = requests.post("http://localhost:8000/api/datasource/" + dtname + "/replace/", headers=headers, data={"content": rdf_content,})

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
    callDatasource = requests.get("http://localhost:8000/api/datasource/" + dtname + "/")
    data = json.loads(callDatasource.text)['content']
    mimetype = "application/xml+rdf"
    return HttpResponse(data, mimetype)

def datasourceDelete(request, dtname):
    if request.POST:
        headers = {'accept': 'application/json'}
        callDelete = requests.post("http://localhost:8000/api/datasource/" + dtname + "/delete/", headers=headers)
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
    params['example_properties'] = {('buyer', 'Buyer'), ('product_price', 'Product price')}
    params['limitation_relations'] = {('EQ','='), ('NEQ','!='), ('EQ','<'), ('EQ','<='), ('EQ','>'), ('EQ','>=')}
    return render(request, 'query-builder/index.html', params)

#Tools
def rdb2rdf(request):
    params = {}
    params['datasources'] = {}
    params['dbcolumns'] = {('name', 'Name'), ('id', 'ID')}
    params['dbtables'] = {('_write_custom_query', 'Write a custom query'), ('product', 'Product')}

    return render(request, 'rdb2rdf/rdb2rdf.html', params)

#Api view

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