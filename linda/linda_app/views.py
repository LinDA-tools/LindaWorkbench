from operator import attrgetter
from django.core import serializers
from django.core.paginator import Paginator, EmptyPage
from django.http import HttpResponse, HttpResponseNotFound, Http404, HttpResponseForbidden
from django.shortcuts import redirect, render, get_object_or_404
from django.utils.http import urlquote

from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import ListView, UpdateView, DetailView, DeleteView

import json
import requests
from microsofttranslator import Translator
from analytics.models import Analytics
from builder_advanced.views import sparql_query_json

from forms import *
from rdflib import Graph
from datetime import datetime

from settings import SESAME_LINDA_URL, LINDA_HOME, RDF2ANY_SERVER, PRIVATE_SPARQL_ENDPOINT, QUERY_BUILDER_SERVER, \
    VOCABULARY_REPOSITORY, UPDATE_FREEQUENCY_DAYS
from passwords import MS_TRANSLATOR_UID, MS_TRANSLATOR_SECRET

last_vocabulary_update = datetime.strptime('Jan 1 2014  1:00PM', '%b %d %Y %I:%M%p')  # set initial date on server start


def index(request):
    params = {}
    params['recent_datasources'] = DatasourceDescription.objects.all().order_by('createdOn')[:3]
    params['page'] = 'Home'

    return render(request, 'index.html', params)


def openDatasource(request):
    params = {}
    return render(request, 'datasource/open.html', params)


def terms(request):
    params = {}
    return render(request, 'terms.html', params)


def sparql(request):
    params = {}
    params['mode'] = "sparql"
    params['datasources'] = list(DatasourceDescription.objects.all())
    params['datasources'].insert(0,
                                 DatasourceDescription(title="All private data dources", name="all", is_public=False
                                                       , uri=LINDA_HOME + "sparql/all/", createdOn=datetime.today(),
                                                       lastUpdateOn=datetime.today()))
    params['page'] = 'Sparql'

    # get query parameter
    if request.GET.get('q_id'):
        params['query'] = Query.objects.get(pk=request.GET.get('q_id'))
        if not params['query']:
            return Http404

    return render(request, 'sparql.html', params)


def site_search(request):
    if 'search_q' not in request.GET:
        return Http404

    q = request.GET.get('search_q')

    # for vocabularies, classes & properties use elastic search
    vocabularies = []
    for sqs in SearchQuerySet().models(Vocabulary).filter(content=q):
        if sqs.object:
            vocabularies.append(sqs.object)

    classes = []
    for sqs in SearchQuerySet().models(VocabularyClass).filter(content=q):
        if sqs.object:
            classes.append(sqs.object)

    properties = []
    for sqs in SearchQuerySet().models(VocabularyProperty).filter(content=q):
        if sqs.object:
            properties.append(sqs.object)

    # also search in datasources, queries and analytics
    params = {'search_q': q,
              'datasources': DatasourceDescription.objects.filter(name__icontains=q),
              'queries': Query.objects.filter(description__icontains=q),
              'analytics': Analytics.objects.filter(description__icontains=q, user_id=request.user.id),
              'vocabularies_list': vocabularies, 'classes_list': classes, 'properties_list': properties}

    return render(request, 'search/site-search.html', params)


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
    template_name = 'vocabulary/details/vocabulary.html'
    context_object_name = 'vocabulary'

    def get(self, *args, **kwargs):
        vocabulary = Vocabulary.objects.get(pk=kwargs.get('pk'))
        if not vocabulary.title_slug() == kwargs.get('slug'):
            return redirect(vocabulary.get_absolute_url())

        return super(VocabularyDetailsView, self).get(self, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(VocabularyDetailsView, self).get_context_data(**kwargs)

        # Get defined classes and properties
        context['classes'] = VocabularyClass.objects.filter(vocabulary=context['vocabulary'])
        context['properties'] = VocabularyProperty.objects.filter(vocabulary=context['vocabulary'])

        # Load comments
        context['comments'] = VocabularyComments.objects.filter(vocabularyCommented=context['vocabulary'])

        # Check if user has voted for this vocabulary
        if self.request.user.is_authenticated():
            if (
                    VocabularyRanking.objects.filter(vocabularyRanked=context['vocabulary'],
                                                     voter=self.request.user).exists()):
                context['has_voted'] = True
                context['voteSubmitted'] = \
                    VocabularyRanking.objects.filter(vocabularyRanked=context['vocabulary'], voter=self.request.user)[
                        0].vote
            else:
                context['has_voted'] = False

        return context


class VocabularyClassDetailsView(DetailView):
    model = VocabularyClass
    template_name = 'vocabulary/details/class.html'
    context_object_name = 'class'

    def get_context_data(self, **kwargs):
        context = super(VocabularyClassDetailsView, self).get_context_data(**kwargs)
        # get the class object
        class_object = context['class']

        # handle domain and range pagination
        domain_page = 1
        range_page = 1

        if self.request.GET.get('pdomain'):
            try:
                domain_page = int(self.request.GET.get('pdomain'))
            except ValueError:
                domain_page = 1

        if self.request.GET.get('prange'):
            try:
                range_page = int(self.request.GET.get('prange'))
            except ValueError:
                range_page = 1

        domain_paginator = Paginator(class_object.domain_of(), 10)
        try:
            context['domain_properties'] = domain_paginator.page(domain_page)
        except EmptyPage:
            context['domain_properties'] = domain_paginator.page(1)

        range_paginator = Paginator(class_object.range_of(), 10)
        try:
            context['range_properties'] = range_paginator.page(range_page)
        except EmptyPage:
            context['range_properties'] = range_paginator.page(1)

        return context


class VocabularyPropertyDetailsView(DetailView):
    model = VocabularyProperty
    template_name = 'vocabulary/details/property.html'
    context_object_name = 'property'


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

        # Load categories
        context['categories'] = CATEGORIES

        return context

    def post(self, *args, **kwargs):
        oldVocabulary = Vocabulary.objects.get(pk=kwargs.get('pk'))

        data = self.request.POST
        data['dateModified'] = datetime.now()

        vocabularyForm = VocabularyUpdateForm(data, instance=oldVocabulary)

        # Validate form
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

        # Parse rdf
        g = Graph()
        n3data = urllib.urlopen(context['vocabulary'].downloadUrl).read()
        g.parse(data=n3data, format='n3')

        # Load subjects
        subjects = {}
        objects = {}
        predicates = []

        for (subject, predicate, object) in g:
            subjectName = subject.split("/")[-1].split("#")[-1]
            predicateName = predicate.split("/")[-1].split("#")[-1]
            objectName = object.split("/")[-1].split("#")[-1]

            if (predicateName == "type") and (objectName == "Class"):
                subjects[subject] = subjectName

            if predicateName == "domain":  # property
                objects[subject] = subjectName
                subjects[object] = objectName
                predicates.append((subject, predicate, object))

            if predicateName == "subClassOf":  # Attribute type
                subjects[subject] = subjectName
                subjects[object] = objectName
                predicates.append((subject, predicate, object))

            if predicateName == "range":  # Attribute type
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

    def get_context_data(self, **kwargs):
        context = super(VocabularyListView, self).get_context_data(**kwargs)
        context['page'] = 'Vocabularies'
        context['type'] = 'vocabularies'

        # Should updates be run?
        global last_vocabulary_update
        diff = datetime.now() - last_vocabulary_update
        if diff.days >= UPDATE_FREEQUENCY_DAYS:
            last_vocabulary_update = datetime.now()
            context['check_for_updates'] = True

        return context

    def get_queryset(self):
        qs = super(VocabularyListView, self).get_queryset().order_by('-lodRanking')
        return qs


class ClassListView(ListView):
    model = VocabularyClass
    template_name = 'search/search.html'
    context_object_name = 'classes'
    paginate_by = 10

    def get_context_data(self, **kwargs):
        context = super(ClassListView, self).get_context_data(**kwargs)
        context['page'] = 'Classes'
        context['type'] = 'classes'
        if self.request.GET.get('definedBy'):
            context['vocabulary_define'] = Vocabulary.objects.get(pk=self.request.GET.get('definedBy'))

        return context

    def get_queryset(self, **kwargs):
        v_id = self.request.GET.get('definedBy')
        if v_id:
            qs = super(ClassListView, self).get_queryset().filter(vocabulary__id=v_id).order_by(
                '-vocabulary__lodRanking')
        else:
            qs = super(ClassListView, self).get_queryset().order_by('-vocabulary__lodRanking')
        return qs


class PropertyListView(ListView):
    model = VocabularyProperty
    template_name = 'search/search.html'
    context_object_name = 'properties'
    paginate_by = 10

    def get_context_data(self, **kwargs):
        context = super(PropertyListView, self).get_context_data(**kwargs)
        context['page'] = 'Properties'
        context['type'] = 'properties'
        if self.request.GET.get('definedBy'):
            context['vocabulary_define'] = Vocabulary.objects.get(pk=self.request.GET.get('definedBy'))

        return context

    def get_queryset(self):
        v_id = self.request.GET.get('definedBy')
        if v_id:
            qs = super(PropertyListView, self).get_queryset().filter(vocabulary__id=v_id).order_by(
                '-vocabulary__lodRanking')
        else:
            qs = super(PropertyListView, self).get_queryset().order_by('-vocabulary__lodRanking')
        return qs


from haystack.query import SearchQuerySet


def vocabulary_search(request):  # view for search in vocabularies - remembers selection (vocabulary - class - property)
    # get query parameter
    if 'q' in request.GET:
        q_in = request.GET['q']
    else:
        q_in = ''

    if 'page' in request.GET:
        try:
            page = int(request.GET['page'])
        except ValueError:
            page = 1
    else:
        page = 1

    # translate non english terms
    if 'translate' in request.GET:
        translate = True
        # create a unique translator object to be used
        translator = Translator(MS_TRANSLATOR_UID, MS_TRANSLATOR_SECRET)
        q = translator.translate(text=q_in, to_lang='en', from_lang=None)
        if q.startswith("TranslateApiException:"):
            q = q_in
    else:
        translate = False
        q = q_in

    # get requested type
    if 'type' in request.GET:
        tp = request.GET['type']
    else:
        tp = "vocabularies"

    # load the query set
    if tp == "vocabularies":
        sqs = SearchQuerySet().models(Vocabulary).filter(content=q)
    elif tp == "classes":
        sqs = SearchQuerySet().models(VocabularyClass).filter(content=q)
    elif tp == "properties":
        sqs = SearchQuerySet().models(VocabularyProperty).filter(content=q)
    else:
        raise Http404

    # remove non existing objects (may have been deleted but are still indexed)
    obj_set = []
    for res in sqs:
        if res.object:
            obj_set.append(res)

    # search only inside a vocabulary
    if request.GET.get('definedBy'):
        defined_by = int(request.GET.get('definedBy'))
        obj_set_old = obj_set[:]
        obj_set = []
        for res in obj_set_old:
            try:
                if res.object.vocabulary.id == defined_by:
                    obj_set.append(res)
            except AttributeError:
                continue  # only return classes or properties
    else:
        defined_by = None

    # order the results
    if tp == "vocabularies":
        qs = sorted(obj_set, key=attrgetter('object.lodRanking'), reverse=True)  # order objects manually
    elif tp == "classes":
        qs = sorted(obj_set, key=attrgetter('object.vocabulary.lodRanking'), reverse=True)
    elif tp == "properties":
        qs = sorted(obj_set, key=attrgetter('object.vocabulary.lodRanking'), reverse=True)

    # paginate the results
    paginator = Paginator(qs, 15)
    page_object = paginator.page(page)

    # pass parameters and render the search template
    params = {'q': q, 'type': tp, 'query': True, 'translate': translate,
              'page_obj': page_object, 'url': "/vocabularies/?q=" + q + '&type=' + tp}

    if defined_by:
        params['vocabulary_define'] = Vocabulary.objects.get(pk=defined_by)

    return render(request, 'search/search.html', params)


def autocomplete(request):
    sqs = SearchQuerySet().autocomplete(content_auto=request.GET.get('q', ''))[:5]
    suggestions = [result.title for result in sqs]
    # Make sure you return a JSON object, not a bare list.
    # Otherwise, you could be vulnerable to an XSS attack.
    the_data = json.dumps({
        'results': suggestions
    })
    return HttpResponse(the_data, content_type='application/json')


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
                        # Create ranking object
                        vocabulary = Vocabulary.objects.get(id=vocid)
                        ranking = VocabularyRanking.objects.create(voter=request.user, vocabularyRanked=vocabulary,
                                                                   vote=voteSubmitted)
                        ranking.save()
                        # Edit vocabulary ranking
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

    # Create the response
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
                # Create and store the comment
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

    # Create the response
    mimetype = 'application/json'
    response = HttpResponse(data, mimetype)
    response.status_code = code
    return response


def downloadRDF(request, pk, type):
    vocid = int(pk)

    voc = get_object_or_404(Vocabulary, pk=vocid)

    if not type in ("xml", "n3", "nt"):
        return HttpResponseNotFound("Invalid type.")

    # Convert rdf to the appropriate type
    g = Graph()
    n3data = urllib.urlopen(voc.downloadUrl).read()
    g.parse(data=n3data, format='n3')

    # Return response
    mimetype = "application/octet-stream"
    response = HttpResponse(g.serialize(format=type))
    response["Content-Disposition"] = "attachment; filename=%s.%s" % (voc.title_slug(), type)
    return response


# Datasources
def datasources(request):
    params = {}
    params['page'] = 'Datasources'
    params['datasources'] = DatasourceDescription.objects.all().order_by('title')

    return render(request, 'datasource/index.html', params)


def datasourceCreate(request):
    params = {'types': {('public', 'Public'), ('private', 'Private')},
              'datatypes': {('csv', 'CSV file'), ('rdb', 'Database (relational)'), ('xls', 'Excel file'),
                            ('rdf', 'RDF file')},
              'action': "create"}
    params['typeSelect'] = forms.Select(choices=params['types']).render('type', '', attrs={"id": 'id_type', })
    params['datatypeSelect'] = forms.Select(choices=params['datatypes']).render('datatype', '',
                                                                                attrs={"id": 'id_datatype', })

    if request.POST:  # request to create a public datasource or move to appropriate tool for a private one

        if request.POST.get("type") == "private" and (request.POST.get("datatype") == "csv" or request.POST.get("datatype")== "rdb"):
           return redirect("/transformations/#/" + request.POST.get("datatype"))
        elif request.POST.get("type") == "private":
           return redirect("/datasource/create/" + request.POST.get("datatype"))
        else:
            if not request.POST.get("title"):  # title is obligatory
                params["error"] = "A datasource title must be specified"
                return render(request, 'datasource/form.html', params)

            if not request.POST.get("endpoint"):  # endpoint is obligatory
                params["error"] = "A public sparql enpoint must be specified"
                return render(request, 'datasource/form.html', params)

            # Try to verify that the endpoint uri exists
            validate = URLValidator()
            try:
                validate('http://www.somelink.com/to/my.pdf')
            except ValidationError, e:
                params["error"] = "Invalid sparql enpoint (url does not exist) - " + e
                return render(request, 'datasource/form.html', params)

            # find the slug
            sname = slugify(request.POST.get("title"))

            new_datasource = DatasourceDescription.objects.create(title=request.POST.get("title"), is_public=True,
                                                                  name=sname, uri=request.POST.get("endpoint"),
                                                                  createdOn=datetime.now(), lastUpdateOn=datetime.now())
            new_datasource.save()

            # go to view all datasources
            return redirect("/datasources/")
    else:  # create form elements and various categories
        return render(request, 'datasource/form.html', params)


def datasourceReplace(request, name):
    if not DatasourceDescription.objects.filter(name=name):  # datasource does not exist
        return redirect("/datasources/")

    datasource = DatasourceDescription.objects.filter(name=name)[0]

    params = {}
    params['action'] = "replace"
    params['datasource'] = datasource
    params['types'] = {('private', 'Private'), ('public', 'Public')}
    params['datatypes'] = {('csv', 'CSV file'), ('db', 'Database (relational)'), ('xls', 'Excel file'),
                           ('rdf', 'RDF file')}

    params['typeSelect'] = forms.Select(choices=params['types']).render('type', '', attrs={"id": 'id_type', })
    params['datatypeSelect'] = forms.Select(choices=params['datatypes']).render('datatype', '',
                                                                                attrs={"id": 'id_datatype', })

    if request.POST:
        if request.POST.get("type") == "private":
            return redirect("/datasource/" + name + "/replace/" + request.POST.get("datatype"))
        else:
            datasource.is_public = True

            if not request.POST.get("title"):  # title is obligatory
                params["error"] = "A datasource title must be specified"
                return render(request, 'datasource/form.html', params)

            datasource.title = request.POST.get("title")
            datasource.name = slugify(datasource.title)

            if not request.POST.get("endpoint"):  # endpoint is obligatory
                params["error"] = "A public sparql enpoint must be specified"
                return render(request, 'datasource/form.html', params)

            # Try to verify that the endpoint uri exists
            validate = URLValidator()
            try:
                validate('http://www.somelink.com/to/my.pdf')
            except ValidationError, e:
                params["error"] = "Invalid sparql enpoint (url does not exist) - " + e
                return render(request, 'datasource/form.html', params)

            datasource.uri = request.POST.get("endpoint")
            datasource.save()  # save changed object to the database

            return redirect("/datasources/")
    else:
        return render(request, 'datasource/form.html', params)


def datasourceCreateRDF(request):
    if request.POST:
        # Get the posted rdf data
        if "rdffile" in request.FILES:
            rdf_content = request.FILES["rdffile"].read()
        else:
            rdf_content = request.POST.get("rdfdata")


        # Call the corresponding web service
        headers = {'accept': 'application/json'}
        callAdd = requests.post(LINDA_HOME + "api/datasource/create/", headers=headers,
                                data={"content": rdf_content, "title": request.POST.get("title")})

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
        # Get the posted rdf data
        if "rdffile" in request.FILES:
            rdf_content = request.FILES["rdffile"].read()
        else:
            rdf_content = request.POST.get("rdfdata")

        # Call the corresponding web service
        headers = {'accept': 'application/json'}
        callAdd = requests.post(LINDA_HOME + "api/datasource/" + dtname + "/replace/", headers=headers,
                                data={"content": rdf_content, })

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
    # get the datasource with this name
    datasource = DatasourceDescription.objects.filter(name=dtname)[0]

    if request.POST:
        if datasource.is_public:  # just delete the datasource description
            datasource.delete()
            return redirect("/datasources/")
        else:  # also remove data from the sesame
            headers = {'accept': 'application/json'}
            callDelete = requests.post(LINDA_HOME + "api/datasource/" + dtname + "/delete/", headers=headers)
            j_obj = json.loads(callDelete.text)
            if j_obj['status'] == '200':
                return redirect("/datasources/")
            else:
                params = {}

                params['form_error'] = j_obj['message']

                return render(request, 'datasource/delete.html', params)
    else:
        params = {}
        params['title'] = datasource.title

        return render(request, 'datasource/delete.html', params)


# Query builder
def queryBuilder(request):
    params = {}
    params['datasources'] = list(DatasourceDescription.objects.all())
    params['datasources'].insert(0,
                                 DatasourceDescription(title="All private data dources", name="all", is_public=False
                                                       , uri=LINDA_HOME + "sparql/all/", createdOn=datetime.today(),
                                                       lastUpdateOn=datetime.today()))

    if 'dt_id' in request.GET:
        params['datasource_default'] = DatasourceDescription.objects.filter(name=request.GET.get('dt_id'))[0]

    params['PRIVATE_SPARQL_ENDPOINT'] = PRIVATE_SPARQL_ENDPOINT
    params['RDF2ANY_SERVER'] = RDF2ANY_SERVER
    params['mode'] = "builder"
    params['page'] = 'QueryBuilder'

    return render(request, 'query-builder/index.html', params)


# Temporary call to execute a SparQL query
@csrf_exempt
def execute_sparql(request):
    query = request.POST.get('query')

    # Set a limit on the results if not set by the query itself
    lim_pos = re.search('LIMIT', query, re.IGNORECASE)
    if not lim_pos:
        query += ' LIMIT 100'

    # Add an offset to facilitate pagination
    if request.POST.get('offset'):
        offset = request.POST.get('offset')
        print offset
        query += ' OFFSET ' + str(offset)
    else:
        offset = 0

    # Make the query, add info about the offset and return the results
    response = sparql_query_json(request.POST.get('dataset'), query)
    data = json.loads(response.content)
    data['offset'] = offset

    return HttpResponse(json.dumps(data), content_type="application/json")


# Proxy calls - exist as middle-mans between LinDA query builder page and the rdf2any server
@csrf_exempt
def get_qbuilder_call(request, link):
    total_link = QUERY_BUILDER_SERVER + "query/" + link
    if request.GET:
        total_link += "?"
    for param in request.GET:
        total_link += param + "=" + urlquote(request.GET[param]) + "&"

    print link
    if link == 'execute_sparql':
        data = requests.post(total_link, data=request.POST)
    else:
        data = requests.get(total_link)

    return HttpResponse(data, data.headers['content-type'])


# Tools
def rdb2rdf(request):
    params = {}
    params['datasources'] = {}
    params['dbcolumns'] = {('name', 'Name'), ('id', 'ID')}
    params['dbtables'] = {('_write_custom_query', 'Write a custom query'), ('product', 'Product')}

    return render(request, 'rdb2rdf/rdb2rdf.html', params)


# Api view


# Get a list with all uses - used in autocomplete
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
    if request.POST:  #request must be POST
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
                rdf_format = 'application/rdf+xml'  #rdf+xml by default

            #make REST api call to add rdf data
            headers = {'accept': 'application/rdf+xml', 'content-type': rdf_format}
            callAdd = requests.post(SESAME_LINDA_URL + 'rdf-graphs/' + sname, headers=headers,
                                    data=request.POST.get("content"))

            if callAdd.text == "":
                #create datasource description
                source = DatasourceDescription.objects.create(title=request.POST.get("title"),
                                                              name=sname,
                                                              uri=SESAME_LINDA_URL + "rdf-graphs/" + sname,
                                                              createdOn=datetime.now(), lastUpdateOn=datetime.now())

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
            rdf_format = 'application/rdf+xml'  #rdf+xml by default

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
    if request.POST:  #request must be POST
        #check if datasource exists
        if DatasourceDescription.objects.filter(name=dtname).exists():
            #get rdf type
            if request.POST.get("format"):
                rdf_format = request.POST.get("format")
            else:
                rdf_format = 'application/rdf+xml'  #rdf+xml by default

            #make REST api call to update graph
            headers = {'accept': 'application/rdf+xml', 'content-type': rdf_format}
            callReplace = requests.put(SESAME_LINDA_URL + 'rdf-graphs/' + dtname, headers=headers,
                                       data=request.POST.get("content"))

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
            results['status'] = '404'
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
    if request.method == 'POST':  #request must be POST

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
            results['status'] = '404'
            results['message'] = "Datasource does not exist."

    else:
        results['status'] = '403'

        results['message'] = 'POST method must be used to delete a datasource.'

    data = json.dumps(results)
    mimetype = 'application/json'
    return HttpResponse(data, mimetype)


#Get a query for a specific private datasource and execute it
@csrf_exempt
def datasource_sparql(request, dtname):  # Acts as a "fake" seperate sparql endpoint for each datasource
    results = {}

    if not request.GET:  # request must be get
        results['status'] = '403'
        results['message'] = "GET method must be used to query a datasource."

        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)

    if dtname != "all":  # search in all private datasource
        datasources = DatasourceDescription.objects.filter(name=dtname)

        if not datasources:  # datasource not found by name
            results['status'] = '404'
            results['message'] = "Datasource does not exist."

            data = json.dumps(results)
            mimetype = 'application/json'
            return HttpResponse(data, mimetype)

        datasource = datasources[0]

        if datasource.is_public:  # public data sources
            results['status'] = '404'
            results['message'] = "Invalid operation."

            data = json.dumps(results)
            mimetype = 'application/json'
            return HttpResponse(data, mimetype)
        else:  # private data sources
            # Find where to add the FROM clause
            query = request.GET.get("query")

            pos = re.search("WHERE", query, re.IGNORECASE).start()
            query = query[:pos] + " FROM <" + datasource.uri + "> " + query[pos:]
            # query = query.replace('?object rdf:type ?class', '')

    # choose results format
    result_format = 'xml'  # default format
    if request.GET.get('format'):
        result_format = request.GET.get('format')

    # encode the query
    query_enc = urlquote(query, safe='')

    # get query results
    data = requests.get(
        PRIVATE_SPARQL_ENDPOINT + "?Accept=" + urlquote("application/sparql-results+" + result_format) + "&query=" + query_enc).text

    # return the response
    return HttpResponse(data, "application/json")


class QueryListView(ListView):
    model = Query
    template_name = 'queries/index.html'
    context_object_name = 'queries'

    def get_context_data(self, **kwargs):
        context = super(QueryListView, self).get_context_data(**kwargs)
        context['page'] = 'Queries'
        return context


#Save a query
def query_save(request):
    #get POST variables
    endpoint = request.POST.get("endpoint")
    endpoint_name = request.POST.get("endpointName")
    query = request.POST.get("query")

    #load constraints as json object
    description = create_query_description(endpoint_name, query)

    print description

    #create the query object
    Query.objects.create(endpoint=endpoint, sparql=query,
                         description=description, createdOn=datetime.now())

    return HttpResponse('')  # return empty response


#Update an existing query
def query_update(request, pk):
    obj_list = Query.objects.filter(pk=pk)
    if not obj_list:
        return Http404

    #get query object and update its properties
    q_obj = obj_list[0]
    q_obj.sparql = request.POST.get("query")
    q_obj.endpoint = request.POST.get("endpoint")
    q_obj.endpoint_name = request.POST.get("endpointName")
    q_obj.description = create_query_description(q_obj.endpoint_name, q_obj.sparql)

    #Save changes
    q_obj.save()

    return HttpResponse('')


#Delete an existing query
def query_delete(request, pk):
    obj_list = Query.objects.filter(pk=pk)
    if not obj_list:
        return Http404

    #get query object and delete it
    q_obj = obj_list[0]
    q_obj.delete()

    return HttpResponse('')


#Proxy call - exists as middle-man between local LinDA server and the Vocabulary Repository
@csrf_exempt
def vocabulary_repo_api_call(request, link):
    total_link = VOCABULARY_REPOSITORY + "api/" + link
    if request.GET:
        total_link += "?"
    for param in request.GET:
        total_link += param + "=" + request.GET[param] + "&"

    data = requests.get(total_link)

    return HttpResponse(data, data.headers['content-type'])


#Get current vocabulary versions
@csrf_exempt
def get_vocabulary_versions(request):
    resp_data = []
    for vocabulary in Vocabulary.objects.all():  # collect all vocabulary IDs and versions
        resp_data.append({'slug': vocabulary.title_slug(), 'id': vocabulary.pk, 'version': vocabulary.version})

    data = json.dumps(resp_data)
    mimetype = 'application/json'
    return HttpResponse(data, mimetype)


#Get vocabulary data
@csrf_exempt
def get_vocabulary_data(request, pk):
    #return the specified vocabulary options
    vocab = Vocabulary.objects.get(pk=pk)

    if not vocab:  # vocabulary not found
        return Http404

    serialized_data = serializers.serialize('json', [vocab, ])
    struct = json.loads(serialized_data)
    data = json.dumps(struct[0]['fields'])
    mimetype = 'application/json'
    return HttpResponse(data, mimetype)


#Add a new vocabulary
def post_vocabulary_data(request):
    if not request.user.is_superuser:  # forbidden for non-administrative users
        return HttpResponseForbidden()

    if request.method != 'POST':  # only allow post requests
        return HttpResponseForbidden()

    data = json.loads(request.POST.get('vocab_data'))

    #Create object
    vocab = Vocabulary.objects.create(title=data['title'], category=data['category'], description=data['description'],
                                      originalUrl=data['originalUrl'],
                                      downloadUrl=data['downloadUrl'],
                                      preferredNamespaceUri=data['preferredNamespaceUri'],
                                      preferredNamespacePrefix=data['preferredNamespacePrefix'],
                                      lodRanking=data['lodRanking'], example=data['example'], uploader=request.user,
                                      datePublished=data['datePublished'], version=data['version'])

    #Save the new vocabulary (also creates classes and properties)
    vocab.save()

    return HttpResponse('')  # return OK response


#Update a vocabulary's data
def update_vocabulary_data(request, pk):
    if not request.user.is_superuser:  # forbidden for non-administrative users
        return HttpResponseForbidden()

    if request.method != 'POST':  # only allow post requests
        return HttpResponseForbidden()

    data = json.loads(request.POST.get('vocab_data'))
    vocab = Vocabulary.objects.get(pk=pk)

    if not vocab:  # vocabulary not found
        return Http404

    #Updating vocabulary data
    vocab.title = data['title']
    vocab.category = data['category']
    vocab.originalUrl = data['originalUrl']
    vocab.downloadUrl = data['downloadUrl']
    vocab.preferredNamespaceUri = data['preferredNamespaceUri']
    vocab.preferredNamespacePrefix = data['preferredNamespacePrefix']
    vocab.lodRanking = data['lodRanking']
    vocab.example = data['example']
    vocab.version = data['version']

    # Save the updated object (also updates classes and properties)
    vocab.save()

    return HttpResponse('')  # return OK response


#Delete an existing vocabulary
def delete_vocabulary_data(request, pk):
    if not request.user.is_superuser:  # forbidden for non-administrative users
        return HttpResponseForbidden()

    if request.method != 'POST':  # only allow post requests
        return HttpResponseForbidden()

    vocab = Vocabulary.objects.get(pk=pk)

    if not vocab:  # vocabulary not found
        return Http404

    # Delete the object (also deletes classes and properties)
    vocab.delete()

    return HttpResponse('')  # return OK response