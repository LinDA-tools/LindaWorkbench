from operator import attrgetter
from django.contrib.auth.decorators import login_required
from django.core import serializers
from view_cache_utils import cache_page_with_prefix
from hashlib import md5
from django.core.paginator import Paginator, EmptyPage
from django.http import HttpResponse, HttpResponseNotFound, Http404, HttpResponseForbidden
from django.shortcuts import redirect, render, get_object_or_404
from unidecode import unidecode
from django.utils.http import urlquote

from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import ListView, UpdateView, DetailView, DeleteView, CreateView

import json

from microsofttranslator import Translator
from analytics.models import Analytics
from query_designer.views import sparql_query_json
from query_designer.models import Design

from forms import *
from rdflib import Graph
from datetime import datetime

from installer.views import installation_pending
from settings import LINDA_HOME, RDF_CHUNK_SIZE, MAX_NUMBER_OF_DATASOURCES
from passwords import MS_TRANSLATOR_UID, MS_TRANSLATOR_SECRET


def index(request):
    params = {}
    params['installation_pending'] = installation_pending()
    params['recent_datasources'] = get_datasources(request.user).order_by('-updatedOn')[:3]
    params['recent_queries'] = Query.objects.all().order_by('-updatedOn')[:3]
    if request.user.is_authenticated():
        params['recent_analytics'] = Analytics.objects.filter(user_id=request.user.pk).order_by('-updatedOn')[:3]
    else:
        params['recent_analytics'] = []
    params['page'] = 'Home'

    return render(request, 'index.html', params)


def terms(request):
    params = {}
    return render(request, 'terms.html', params)


def getstarted(request):
    params = {}
    return render(request, 'getstarted.html', params)


def sparql(request, q_id=None):
    params = {}
    params['mode'] = "sparql"
    params['datasources'] = list(get_datasources(request.user))
    params['datasources'].insert(0,
                                 DatasourceDescription(title="All private data dources", name="all", is_public=False,
                                                       uri=LINDA_HOME + "sparql/all/", createdOn=datetime.today(),
                                                       updatedOn=datetime.today()))
    params['page'] = 'Sparql'
    params['RDF2ANY_SERVER'] = get_configuration().rdf2any_server

    # get query parameter
    if q_id:
        params['query'] = Query.objects.get(pk=q_id)
        if not params['query']:
            return Http404

    return render(request, 'sparql.html', params)


def site_search(request):
    if 'search_q' not in request.GET:
        return Http404

    q = request.GET.get('search_q')

    # get pages
    if 'v_page' in request.GET:
        try:
            v_page = int(request.GET['v_page'])
        except ValueError:
            v_page = 1
    else:
        v_page = 1

    if 'c_page' in request.GET:
        try:
            c_page = int(request.GET['c_page'])
        except ValueError:
            c_page = 1
    else:
        c_page = 1

    if 'p_page' in request.GET:
        try:
            p_page = int(request.GET['p_page'])
        except ValueError:
            p_page = 1
    else:
        p_page = 1

    # for vocabularies, classes & properties use elastic search
    # vocaabularies
    vocabularies = []
    for sqs in SearchQuerySet().models(Vocabulary).filter(content=q):
        if sqs.object:
            vocabularies.append(sqs.object)

    vocabularies_paginator = Paginator(vocabularies, 10)
    try:
        vocabularies_page = vocabularies_paginator.page(v_page)
    except EmptyPage:
        vocabularies_page = vocabularies_paginator.page(1)

    # classes
    classes = []
    for sqs in SearchQuerySet().models(VocabularyClass).filter(content=q):
        if sqs.object:
            classes.append(sqs.object)

    classes_paginator = Paginator(classes, 10)
    try:
        classes_page = classes_paginator.page(c_page)
    except EmptyPage:
        classes_page = classes_paginator.page(1)

    properties = []
    for sqs in SearchQuerySet().models(VocabularyProperty).filter(content=q):
        if sqs.object:
            properties.append(sqs.object)

    # properties
    properties_paginator = Paginator(properties, 10)
    try:
        properties_page = properties_paginator.page(p_page)
    except EmptyPage:
        properties_page = properties_paginator.page(1)

    # also search in datasources, queries and analytics
    params = {'search_q': q,
              'datasources': get_datasources(request.user).filter(name__icontains=q),
              'queries': Query.objects.filter(description__icontains=q),
              'analytics': Analytics.objects.filter(description__icontains=q),
              'vocabularies_list': vocabularies_page.object_list, 'classes_list': classes_page.object_list,
              'properties_list': properties_page.object_list,
              'vocabularies_page': vocabularies_page, 'classes_page': classes_page, 'properties_page': properties_page}

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


class VocabularyCreateView(CreateView):
    form_class = VocabularyUpdateForm
    model = Vocabulary
    template_name = 'vocabulary/form.html'
    context_object_name = 'vocabulary'

    def get_context_data(self, **kwargs):
        context = super(VocabularyCreateView, self).get_context_data(**kwargs)

        # Load categories
        context['categories'] = CATEGORIES
        context['create'] = True

        return context

    def post(self, *args, **kwargs):
        if not self.request.user.is_authenticated:
            return HttpResponseForbidden

        vocabulary_form = VocabularyUpdateForm(self.request.POST)

        # validate form
        if vocabulary_form.is_valid():
            new_vocabulary = vocabulary_form.save(commit=False)

            new_vocabulary.uploader = self.request.user
            new_vocabulary.dateCreated = datetime.now()
            new_vocabulary.dateModified = datetime.now()

            new_vocabulary.save()

            return redirect("/vocabulary/" + str(new_vocabulary.pk) + "/")
        else:
            return render(self.request, 'vocabulary/form.html', {
                'vocabulary': None,
                'form': vocabulary_form,
                'categories': CATEGORIES,
                'create': True
            })


class VocabularyUpdateView(UpdateView):
    form_class = VocabularyUpdateForm
    model = Vocabulary
    template_name = 'vocabulary/form.html'
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
            return render(self.request, 'vocabulary/form.html', {
                'vocabulary': oldVocabulary,
                'form': vocabularyForm,
                'categories': CATEGORIES,
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
        g.parse(data=n3data, format=guess_format(context['vocabulary'].downloadUrl))

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
        if self.request.GET.get('update'):
            context['check_for_updates'] = True

        # in category view
        category = self.request.GET.get('category')
        if category:
            context['category'] = category

        return context

    def get_queryset(self):
        category = self.request.GET.get('category')
        qs = super(VocabularyListView, self).get_queryset()
        if category:
            qs = qs.filter(category=category)
        return qs.order_by('-lodRanking')


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


def categories(request):
    params = {
        'categories': CATEGORIES,
    }

    return render(request, 'vocabulary/categories.html', params)


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
        sqs = SearchQuerySet().models(Vocabulary).filter(content__contains=q)
    elif tp == "classes":
        sqs = SearchQuerySet().models(VocabularyClass).filter(content__contains=q)
    elif tp == "properties":
        sqs = SearchQuerySet().models(VocabularyProperty).filter(content__contains=q)
    else:
        return Http404

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
    g.parse(data=n3data, format=guess_format(voc.downloadUrl))

    # Return response
    mimetype = "application/octet-stream"
    response = HttpResponse(g.serialize(format=type))
    response["Content-Disposition"] = "attachment; filename=%s.%s" % (voc.title_slug(), type)
    return response


# Datasources
def datasources(request):
    params = {}
    params['page'] = 'Datasources'
    params['datasources'] = get_datasources(request.user).order_by('-updatedOn')

    return render(request, 'datasource/index.html', params)

@login_required
def datasourceCreate(request):
    params = {'types': {('public', 'Remote'), ('private', 'Local')},
              'datatypes': {('csv', 'CSV file'), ('rdb', 'Database (relational)'), ('xls', 'Excel file'),
                            ('rdf', 'RDF file')},
              'action': "create"}
    params['typeSelect'] = forms.Select(choices=params['types']).render('type', '', attrs={"id": 'id_type', })
    params['datatypeSelect'] = forms.Select(choices=params['datatypes']).render('datatype', '',
                                                                                attrs={"id": 'id_datatype', })

    if request.POST:  # request to create a public datasource or move to appropriate tool for a private one

        if request.POST.get("type") == "private" and (
                        request.POST.get("datatype") == "csv" or request.POST.get("datatype") == "rdb"):
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
                validate(request.POST.get("endpoint"))
            except ValidationError, e:
                params["error"] = "Invalid sparql enpoint (url does not exist) - " + e
                return render(request, 'datasource/form.html', params)

            # find the slug
            sname = slugify(unidecode(request.POST.get("title")))

            # get user
            created_by = request.user

            # check for RSS
            if request.POST.get("is_rss"):
                # case rss feed
                uri = get_configuration().private_sparql_endpoint + "/rdf-graphs/" + sname
                new_feed = RSSInfo.objects.create(url=request.POST.get("endpoint"))
                dt = DatasourceDescription.objects.create(title=request.POST.get("title"), is_public=False,
                                                          name=sname, rss_info=new_feed,
                                                          uri=uri, createdOn=datetime.now(), updatedOn=datetime.now(),
                                                          createdBy=created_by)
                update_rss(dt)
            else:
                # default case - sparql endpoint
                DatasourceDescription.objects.create(title=request.POST.get("title"), is_public=True,
                                                     name=sname, uri=request.POST.get("endpoint"),
                                                     createdOn=datetime.now(), updatedOn=datetime.now(),
                                                     createdBy=created_by)

            # go to view all datasources
            return redirect("/datasources/")
    else:  # create form elements and various categories
        return render(request, 'datasource/form.html', params)

@login_required
def datasourceReplace(request, name):
    own_datasources = get_own_datasources(request.user).filter(name=name)
    if not own_datasources:  # datasource does not exist
        return redirect("/datasources/")

    datasource = own_datasources[0]

    # private datasource
    if (not datasource.is_public) and (not datasource.rss_info):
        return redirect("/datasource/" + name + "/replace/rdf/")

    params = {'datasource': datasource}

    if request.POST:
        if not request.POST.get("title"):  # title is obligatory
            params["error"] = "A datasource title must be specified"
            return render(request, 'datasource/replace_remote.html', params)

        datasource.title = request.POST.get("title")
        datasource.name = slugify(unidecode(datasource.title))

        if not request.POST.get("endpoint"):  # endpoint is obligatory
            params["error"] = "A public sparql enpoint must be specified"
            return render(request, 'datasource/replace_remote.html', params)

        # Try to verify that the endpoint uri exists
        validate = URLValidator()
        try:
            validate(request.POST.get("endpoint"))
        except ValidationError, e:
            params["error"] = "Invalid sparql enpoint (url does not exist) - " + e
            return render(request, 'datasource/replace_remote.html', params)

        if datasource.is_public:
            # endpoint
            datasource.uri = request.POST.get("endpoint")
            datasource.save()  # save changed object to the database
        else:
            # rss feed
            datasource.rss_info.url = request.POST.get("endpoint")
            datasource.rss_info.save()  # save changed object to the database
            datasource.update_rss()  # update the rss contents

        return redirect("/datasources/")
    else:
        return render(request, 'datasource/replace_remote.html', params)


def clear_chunk(c, newlines):
    if newlines:
        last_dot = c.rfind('.\n') + 1
    else:
        # detect where the last tripple ends
        i = 0

        in_dquote = False
        in_entity = False
        ignore_next = False
        last_dot = -1

        for char in c:
            if not ignore_next:
                if char == '<' and (not in_dquote):
                    in_entity = True
                elif char == '>' and (not in_dquote):
                    in_entity = False
                elif char == '"':
                    in_dquote = not in_dquote
                elif (char == '.') and (not in_dquote) and (not in_entity):
                    last_dot = i + 1

            if char == '\\':
                ignore_next = True
            else:
                ignore_next = False

            i += 1

    # seperate c1 & track the remainder
    if last_dot >= 0:
        o = c[:last_dot]
        rem = c[last_dot:]

        return o, rem
    else:  # segmentation failed
        return c, ''


def datasourceCreateRDF(request):
    if request.POST:
        params = {
            'title': request.POST.get('title'),
            'format': request.POST.get('format'),
            'newlines': request.POST.get('newlines'),
            'rdfdata': request.POST.get("rdfdata"),
            'rdffile': request.FILES.get("rdffile"),
        }

        # Get the posted rdf data
        rem = ''
        newlines = request.POST.get('newlines', None)
        title = request.POST.get("title", None)
        if not title:
            params['form_error'] = 'Title is required'

            return render(request, 'datasource/create_rdf.html', params)

        a = datetime.now().replace(microsecond=0)
        if "rdffile" in request.FILES:
            # get the first chunk
            inp_file = request.FILES["rdffile"].file
            current_chunk = inp_file.read(RDF_CHUNK_SIZE)
            if len(current_chunk) == RDF_CHUNK_SIZE:
                current_chunk, rem = clear_chunk(current_chunk, newlines)
        else:
            current_chunk = request.POST.get("rdfdata")
            inp_file = False

        # Call the corresponding web service
        headers = {'accept': 'application/json'}
        data = {"content": current_chunk, "title": title}
        if request.POST.get('format'):
            data['format'] = request.POST.get('format')

        mock_request = MockRequest(user=request.user, post=request.POST, data=data, accept='application/json')
        callAdd = api_datasource_create(mock_request)

        j_obj = json.loads(callAdd.content)
        if j_obj['status'] == '200':
            # get new datasource name
            dt_name = j_obj['name']

            i = 0
            while inp_file:  # read all additional chunks
                chunk = inp_file.read(RDF_CHUNK_SIZE)
                if chunk == "":  # end of file
                    break

                i += 1
                print i
                # add the previous remainder & clear again
                current_chunk, rem = clear_chunk(rem + chunk, newlines)
                data = {"content": current_chunk}
                if request.POST.get('format'):
                    data['format'] = request.POST.get('format')

                # request to update
                mock_request = MockRequest(user=request.user, post=request.POST, data=data,
                                           get={'append': 'true'}, accept='application/json')
                callAppend = api_datasource_replace(mock_request, dt_name)
            if rem:  # a statement has not been pushed
                data = {"content": current_chunk}
                if request.POST.get('format'):
                    data['format'] = request.POST.get('format')
                mock_request = MockRequest(user=request.user, post=request.POST, data=data,
                                           get={'append': 'true'}, accept='application/json')
                callAppend = api_datasource_replace(mock_request, dt_name)

            b = datetime.now().replace(microsecond=0)
            print title + ':'
            print(b-a)

            return redirect("/datasources")
        else:
            params['form_error'] = j_obj['message']
            return render(request, 'datasource/create_rdf.html', params)
    else:
        params = {
            'title': '',
            'rdfdata': ''
        }

        return render(request, 'datasource/create_rdf.html', params)

@login_required
def datasourceReplaceRDF(request, dtname):
    if request.POST:
        params = {
            'title': request.POST.get('title'),
            'format': request.POST.get('format'),
            'newlines': request.POST.get('newlines'),
            'rdfdata': request.POST.get("rdfdata"),
            'rdffile': request.FILES.get("rdffile"),
            'append': request.POST.get('append', False)
        }

        title = params['title']
        if not title:
            params['form_error'] = 'Title is required'

            return render(request, 'datasource/replace_rdf.html', params)

        newlines = params['newlines']
        append = params['append']

        # Get the posted rdf data
        if "rdffile" in request.FILES:
            inp_file = params['rdffile'].file
            current_chunk = inp_file.read(RDF_CHUNK_SIZE)
            current_chunk, rem = clear_chunk(current_chunk, newlines)
        else:
            current_chunk = params['rdfdata']

        # Check if appending or completely replacing
        if append:
            append_str = '?append=true'
        else:
            append_str = ''

        # Call the corresponding web service
        headers = {'accept': 'application/json'}
        data = {"content": current_chunk, }
        if request.POST.get('format'):
            data['format'] = request.POST.get('format')

        mock_request = MockRequest(user=request.user, post=request.POST, data=data, accept='application/json')
        # Check if appending or completely replacing
        if append:
            mock_request.GET['append'] = 'true'

        callReplace = api_datasource_replace(mock_request, dtname)

        j_obj = json.loads(callReplace.content)
        if j_obj['status'] == '200':
            # update data source information
            dt_object = get_own_datasources(request.user).filter(name=dtname)[0]
            dt_object.title = request.POST.get("title")
            dt_object.save()
            return redirect("/datasources/")
        else:
            params['form_error'] = j_obj['message']
            return render(request, 'datasource/replace_rdf.html', params)
    else:
        params = {}
        dt_object = get_own_datasources(request.user).filter(name=dtname)[0]
        params['title'] = dt_object.title
        params['append'] = True

        return render(request, 'datasource/replace_rdf.html', params)


def datasourceDownloadRDF(request, dtname):
    mock_request = MockRequest(user=request.user)
    callDatasource = api_datasource_get(mock_request, dtname)

    data = json.loads(callDatasource.content)['content']
    mimetype = "application/xml+rdf"
    return HttpResponse(data, mimetype)

@login_required
def datasourceDelete(request, dtname):
    # get the datasource with this name
    own_datasources = get_own_datasources(request.user).filter(name=dtname)
    if not own_datasources:  # datasource does not exist
        return redirect("/datasources/")

    datasource = own_datasources[0]

    if request.POST:
        if datasource.is_public:  # just delete the datasource description
            datasource.delete()
            return redirect("/datasources/")
        else:  # also remove data from the sesame
            mock_request = MockRequest(user=request.user, post=request.POST, accept='application/json')
            callDelete = api_datasource_delete(mock_request, dtname)

            j_obj = json.loads(callDelete.content)
            if j_obj['status'] == '200':
                datasource.delete()
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
    params['datasources'] = list(get_datasources(request.user))
    params['datasources'].insert(0,
                                 DatasourceDescription(title="All private data dources", name="all", is_public=False
                                                       , uri=LINDA_HOME + "sparql/all/", createdOn=datetime.today(),
                                                       updatedOn=datetime.today()))

    if 'dt_id' in request.GET:
        params['datasource_default'] = get_datasources(request.user).filter(name=request.GET.get('dt_id'))[0]

    params['PRIVATE_SPARQL_ENDPOINT'] = get_configuration().private_sparql_endpoint
    params['RDF2ANY_SERVER'] = get_configuration().rdf2any_server
    params['mode'] = "builder"
    params['page'] = 'QueryBuilder'

    return render(request, 'query-builder/index.html', params)


# Temporary call to execute a SparQL query
@csrf_exempt
def execute_sparql(request):
    # Make sure a datasource name is specified
    if not request.POST.get('dataset'):
        return HttpResponse('Unspecified datasource.', status=400)

    query = request.POST.get('query')

    # Set a limit on the results if not set by the query itself
    lim_pos = re.search('LIMIT', query, re.IGNORECASE)
    if not lim_pos:
        query += ' LIMIT 100'

    # Add an offset to facilitate pagination
    if request.POST.get('offset'):
        offset = request.POST.get('offset')
        query += ' OFFSET ' + str(offset)
    else:
        offset = 0

    # Make the query, add info about the offset and return the results
    response = sparql_query_json(request.POST.get('dataset'), query)

    if response.status_code == 200:
        # avoid erroneous \U characters -- invalid json
        response_safe = response.content.replace('\U', '')

        if response_safe.startswith("MALFORMED QUERY:"):
            return HttpResponse(response.content, status=500)

        data = json.loads(response_safe)
        data['offset'] = offset

        return HttpResponse(json.dumps(data), content_type="application/json")
    else:
        return HttpResponse(response.content, status=response.status_code)


# redirect to appropriate visualization page
def query_visualize(request, pk):
    q = get_object_or_404(Query, pk=pk)
    return redirect(q.visualization_link())

# Proxy calls - exist as middle-mans between LinDA query builder page and the Query Builder
@csrf_exempt
def get_qbuilder_call(request, link):
    total_link = get_configuration().query_builder_server + "query/" + link
    if request.GET:
        total_link += "?"
    for param in request.GET:
        total_link += param + "=" + urlquote(request.GET[param]) + "&"

    if link == 'execute_sparql':
        data = requests.post(total_link, data=request.POST)
    else:
        data = requests.get(total_link)

    return HttpResponse(data, data.headers['content-type'])


# middle-mans between LinDA query builder page and the RDF2Any server
@csrf_exempt
@cache_page_with_prefix(60*15, lambda request: md5(request.get_full_path()).hexdigest())
def get_rdf2any_call(request, link):
    total_link = get_configuration().rdf2any_server + 'rdf2any/' + link
    if request.GET:
        total_link += "?"
    for param in request.GET:
        total_link += param + "=" + urlquote(request.GET[param]) + "&"

    data = requests.get(total_link)
    if data.status_code == 200:
        return HttpResponse(data, data.headers['content-type'])
    else:
        return HttpResponse(content=data.text, status=data.status_code)


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


# Return the default description of a sparql query
def default_description(request):
    # get query and datasource
    datasource = request.GET.get('datasource', '')
    query = request.GET.get('query', '')

    if not query or not datasource:
        return Http404

    # create a description and save it to a json object
    results = {'description': create_query_description(datasource, query)}
    data = json.dumps(results)

    # send the response
    return HttpResponse(data, 'application/json')


# Return a list with all created datasources
@csrf_exempt
@login_required
def api_datasources_list(request):
    results = []
    for source in get_datasources(request.user):
        source_info = {}

        source_info['name'] = source.name
        source_info['endpoint'] = source.get_endpoint()
        source_info['title'] = source.title
        source_info['public'] = source.is_public

        results.append(source_info)

    data = json.dumps(results)
    mimetype = 'application/json'
    return HttpResponse(data, mimetype)


# Create a new datasource with some rdf data
@csrf_exempt
@login_required
def api_datasource_create(request):
    results = {}
    if request.method == "POST":  # request must be POST
        # check if user is authenticated
        if not request.user.is_authenticated():
            results['status'] = '401'
            results['message'] = "Not authenticated"

        # check if datasource already exists
        if DatasourceDescription.objects.filter(title=request.POST.get("title")).exists():
            results['status'] = '403'
            results['message'] = "Datasource already exists."
        else:
            # check if limit is hit
            if (not request.user.is_superuser) and (get_own_datasources(request.user).count() == MAX_NUMBER_OF_DATASOURCES):
                results['status'] = '401'
                results['message'] = "You have reached the maximum number of datasources you\'re allowed to create in the LinDA Playground."
            else:
                # check if datasource already exists
                if DatasourceDescription.objects.filter(name=slugify(request.POST.get("title"))).exists():
                    results['status'] = '403'
                    results['message'] = "Datasource already exists."
                else:
                    # find the slug
                    sname = slugify(unidecode(request.POST.get("title")))

                    # get rdf type
                    if request.POST.get("format"):
                        rdf_format = request.POST.get("format")
                    else:
                        rdf_format = 'application/rdf+xml'  # rdf+xml by default

                    data = request.POST.get("content").encode('utf-8')

                    # make REST api call to add rdf data
                    headers = {'accept': 'application/rdf+xml', 'content-type': rdf_format, 'charset': 'utf-8'}
                    callAdd = requests.post(get_configuration().private_sparql_endpoint + '/rdf-graphs/' + sname, headers=headers,
                                            data=data)

                    if callAdd.text == "":
                        # get user
                        created_by = request.user

                        # create datasource description
                        DatasourceDescription.objects.create(title=request.POST.get("title"),
                                                             name=sname,
                                                             uri=get_configuration().private_sparql_endpoint + "/rdf-graphs/" + sname,
                                                             createdOn=datetime.now(), updatedOn=datetime.now(),
                                                             createdBy=created_by)

                        results['status'] = '200'
                        results['message'] = 'Datasource created succesfully.'
                        results['name'] = sname
                        results['uri'] = get_configuration().private_sparql_endpoint + "/rdf-graphs/" + sname
                    else:
                        results['status'] = callAdd.status_code
                        results['message'] = 'Error storing rdf data: ' + callAdd.text
    else:
        results['status'] = '403'
        results['message'] = 'POST method must be used to create a datasource.'

    data = json.dumps(results)
    mimetype = 'application/json'
    return HttpResponse(data, mimetype, status=results['status'])


# Retrieve all data from datasource in specified format
@csrf_exempt
def api_datasource_get(request, dtname):
    results = {}

    # check if datasource exists
    if get_datasources(request.user).filter(name=dtname).exists():
        # get rdf type
        if request.GET.get("format"):
            rdf_format = request.GET.get("format")
        else:
            rdf_format = 'application/rdf+xml'  # rdf+xml by default

        # make REST api call to get graph
        headers = {'accept': rdf_format, 'content-type': rdf_format}
        callGet = requests.get(get_configuration().private_sparql_endpoint + '/rdf-graphs/' + dtname, headers=headers)

        results['status'] = '200'
        results['message'] = "Datasource retrieved successfully"
        results['content'] = callGet.text
    else:
        results['status'] = '404'
        results['message'] = "Datasource does not exist."

    data = json.dumps(results)
    mimetype = 'application/json'
    return HttpResponse(data, mimetype, status=results['status'])

# Replace all data from datasource with new rdf data
@csrf_exempt
@login_required
def api_datasource_replace(request, dtname):
    results = {}
    if request.POST:  # request must be POST
        # check if datasource exists
        if get_own_datasources(request.user).filter(name=dtname).exists():
            # get rdf type
            if request.POST.get("format"):
                rdf_format = request.POST.get("format")
            else:
                rdf_format = 'application/rdf+xml'  # rdf+xml by default

            data = request.POST.get("content").encode('utf-8')

            # make REST api call to update graph
            headers = {'accept': 'application/rdf+xml', 'content-type': rdf_format}

            if request.GET.get('append'):  # append data to the data source
                call = requests.post(get_configuration().private_sparql_endpoint + '/rdf-graphs/' + dtname, headers=headers,
                                       data=data)
            else:  # completely replace the data source
                call = requests.put(get_configuration().private_sparql_endpoint + '/rdf-graphs/' + dtname, headers=headers,
                                       data=data)

            if call.text == "":
                # update datasource database object
                source = get_own_datasources(request.user).filter(name=dtname)[0]
                source.updatedOn = datetime.now()
                source.save()

                results['status'] = '200'
                results['message'] = 'Datasource updated succesfully.' + call.text
            else:
                results['status'] = call.status_code
                results['message'] = 'Error replacing rdf data: ' + call.text

        else:
            results['status'] = '404'
            results['message'] = "Datasource does not exist."
    else:
        results['status'] = '403'
        results['message'] = 'POST method must be used to update a datasource.'

    data = json.dumps(results)
    mimetype = 'application/json'
    return HttpResponse(data, mimetype, status=results['status'])


# Delete an RDF datasource
@csrf_exempt
@login_required
def api_datasource_delete(request, dtname):
    results = {}
    if request.method == 'POST':  # request must be POST

        # check if datasource exists
        if get_own_datasources(request.user).filter(name=dtname).exists():
            # make REST api call to delete graph
            callDelete = requests.delete(get_configuration().private_sparql_endpoint + '/rdf-graphs/' + dtname)

            if callDelete.text == "":
                results['status'] = '200'
                results['message'] = 'Datasource deleted succesfully.'

                # delete object from database
                source = get_own_datasources(request.user).filter(name=dtname)[:1].get()
                source.delete()
            else:
                results['status'] = callDelete.status_code
                results['message'] = 'Error deleting datasource: ' + callDelete.text
        else:
            results['status'] = '404'
            results['message'] = "Datasource does not exist."

    else:
        results['status'] = '403'

        results['message'] = 'POST method must be used to delete a datasource.'

    data = json.dumps(results)
    mimetype = 'application/json'
    return HttpResponse(data, mimetype, status=results['status'])


# Get a query for a specific private datasource and execute it
@csrf_exempt
def datasource_sparql(request, dtname):  # Acts as a "fake" seperate sparql endpoint for each datasource
    results = {}

    # Get query - accepts GET or POST requests
    q = request.GET.get("query")
    if not q:
        q = request.POST.get("query")

    query = urllib.unquote_plus(q)

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

            pos = re.search("WHERE", query, re.IGNORECASE).start()
            query = query[:pos] + " FROM <" + datasource.uri + "> " + query[pos:]
            # query = query.replace('?object rdf:type ?class', '')

    # choose results format
    result_format = 'json'  # default format
    if request.GET.get('format'):
        result_format = request.GET.get('format')

    # encode the query
    query_enc = urlquote(query, safe='')

    # get query results
    print get_configuration().private_sparql_endpoint
    response = requests.get(
        get_configuration().private_sparql_endpoint + "?Accept=" + urlquote(
            "application/sparql-results+" + result_format) + "&query=" + query_enc)

    # return the response
    return HttpResponse(response.text, response.headers['content-type'])


class QueryListView(ListView):
    model = Query
    template_name = 'queries/index.html'
    context_object_name = 'queries'

    def get_context_data(self, **kwargs):
        context = super(QueryListView, self).get_context_data(**kwargs)
        context['queries'] = context['queries'].order_by('-updatedOn')
        context['page'] = 'Queries'
        return context


# Save a query
def query_save(request):
    # get POST variables
    endpoint = request.POST.get("endpoint")
    endpoint_name = request.POST.get("endpointName", datasource_from_endpoint(endpoint).title)
    query = request.POST.get("query")
    description = request.POST.get("description", create_query_description(endpoint_name, query))
    design_json = request.POST.get("design")

    # save the json design
    if design_json:
        design = Design.objects.create(data=design_json)
    else:
        design = None

    # get user
    created_by = request.user if request.user.is_authenticated() else None

    # user must be logged in
    if not created_by:
        return HttpResponseForbidden('You must <a href="/accounts/login/" target="_blank">login</a> to save a query.')

    # create the query object
    query = Query.objects.create(endpoint=endpoint, sparql=query,
                                 description=description, createdOn=datetime.now(), updatedOn=datetime.now(),
                                 design=design, createdBy=created_by)

    # return query info
    return HttpResponse(json.dumps({'id': query.id, 'description': query.description}), 'application/json')


# Update an existing query
def query_update(request, pk):
    # get query object
    obj_list = Query.objects.filter(pk=pk)
    if not obj_list:
        return Http404
    q_obj = obj_list[0]

    # get changed fields
    endpoint = request.POST.get("endpoint", q_obj.endpoint)
    endpoint_name = request.POST.get("endpointName", datasource_from_endpoint(endpoint).title)
    query = request.POST.get("query", q_obj.sparql)
    description = request.POST.get("description", create_query_description(endpoint_name, query))

    # update its properties
    q_obj.sparql = query
    q_obj.endpoint = endpoint
    q_obj.endpoint_name = endpoint_name
    q_obj.updatedOn = datetime.now()
    q_obj.description = description

    # update (or create if it did not exist) the query design json
    design_json = request.POST.get("design")
    if design_json != 'DEFAULT':  # use default to avoid updating the design
        if design_json:
            if q_obj.design:
                q_obj.design.data = design_json
                q_obj.design.save()
            else:
                q_obj.design = Design.objects.create(data=design_json)
        else:
            if q_obj.design:
                q_obj.design.delete()
                q_obj.design = None

    # Save changes
    q_obj.save()

    # return query info
    return HttpResponse(json.dumps({'id': q_obj.id, 'description': q_obj.description}), 'application/json')


# Delete an existing query
def query_delete(request, pk):
    obj_list = Query.objects.filter(pk=pk)
    if not obj_list:
        return Http404

    # get query object and delete it
    q_obj = obj_list[0]
    q_obj.delete()

    return HttpResponse('')


# Proxy call - exists as middle-man between local LinDA server and the Vocabulary Repository
@csrf_exempt
def vocabulary_repo_api_call(request, link):
    total_link = get_configuration().vocabulary_repository + "api/" + link
    if request.GET:
        total_link += "?"
    for param in request.GET:
        total_link += param + "=" + request.GET[param] + "&"

    data = requests.get(total_link)

    return HttpResponse(data, data.headers['content-type'])


# Get current vocabulary versions
@csrf_exempt
def get_vocabulary_versions(request):
    resp_data = []
    for vocabulary in Vocabulary.objects.all():  # collect all vocabulary IDs and versions
        resp_data.append({'slug': vocabulary.title_slug(), 'id': vocabulary.pk, 'version': vocabulary.version,
                          'uri': vocabulary.preferredNamespaceUri, 'prefix': vocabulary.preferredNamespacePrefix})

    data = json.dumps(resp_data)
    mimetype = 'application/json'
    return HttpResponse(data, mimetype)


# Get vocabulary data
@csrf_exempt
def get_vocabulary_data(request, pk):
    # return the specified vocabulary options
    vocab = Vocabulary.objects.get(pk=pk)

    if not vocab:  # vocabulary not found
        return Http404

    serialized_data = serializers.serialize('json', [vocab, ])
    struct = json.loads(serialized_data)
    data = json.dumps(struct[0]['fields'])
    mimetype = 'application/json'
    return HttpResponse(data, mimetype)


# Add a new vocabulary
def post_vocabulary_data(request):
    if not request.user.is_superuser:  # forbidden for non-administrative users
        return HttpResponseForbidden()

    if request.method != 'POST':  # only allow post requests
        return HttpResponseForbidden()

    data = json.loads(request.POST.get('vocab_data'))

    # Create object
    vocab = Vocabulary.objects.create(title=data['title'], category=data['category'], description=data['description'],
                                      originalUrl=data['originalUrl'],
                                      downloadUrl=data['downloadUrl'],
                                      preferredNamespaceUri=data['preferredNamespaceUri'],
                                      preferredNamespacePrefix=data['preferredNamespacePrefix'],
                                      lodRanking=data['lodRanking'], example=data['example'], uploader=request.user,
                                      datePublished=data['datePublished'], version=data['version'])

    # Save the new vocabulary (also creates classes and properties)
    vocab.save()

    return HttpResponse('')  # return OK response


# Update a vocabulary's data
def update_vocabulary_data(request, pk):
    if not request.user.is_superuser:  # forbidden for non-administrative users
        return HttpResponseForbidden()

    if request.method != 'POST':  # only allow post requests
        return HttpResponseForbidden()

    data = json.loads(request.POST.get('vocab_data'))
    vocab = Vocabulary.objects.get(pk=pk)

    if not vocab:  # vocabulary not found
        return Http404

    # Updating vocabulary data
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


# Delete an existing vocabulary
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


# Update configuration
class ConfigurationUpdateView(UpdateView):
    form_class = ConfigurationForm
    model = Configuration
    template_name = 'config.html'
    context_object_name = 'config'

    def get_success_url(self):
        return '/settings'

    def get_object(self):
        return get_configuration()


# Update RSS feed
def update_rss(datasource):
    if datasource.rss_info:
        # replace the local rdf copy
        data = {"content": rss2rdf(datasource.rss_info.url)}
        mock_request = MockRequest(user=datasource.createdBy, data=data, method='POST', accept='application/json')
        mock_request.GET['append'] = 'false'

        api_datasource_replace(mock_request, datasource.name)
