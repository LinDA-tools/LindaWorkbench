import json
from itertools import chain

from django.http import HttpResponse
from django.contrib.auth.views import login
from django.contrib.auth.models import User
from django.shortcuts import redirect, render
from django.views.generic import ListView, UpdateView, DetailView

from forms import *


class UserListView(ListView):
    model = User
    template_name = 'users/community.html'
    context_object_name = 'users'
    paginate_by = 20


def index(request):
    params = {}
    return render(request, 'index.html', params)


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
        if (str(self.request.user.id) != str(kwargs.get('pk'))):
            res = HttpResponse("Unauthorized")
            res.status_code = 401
            return res
        else:
            return super(UserUpdateView, self).get(self, *args, **kwargs)

    def get_success_url(self, **kwargs):

        return "/profile/" + kwargs.get('pk')

    def post(self, *args, **kwargs):
        if (str(self.request.user.id) != str(kwargs.get('pk'))  ):
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


def users(request):
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
            VocabularyRanking.objects.filter(vocabularyRanked=context['vocabulary'], voter=self.request.user).exists()):
                context['hasVoted'] = True
                context['voteSubmitted'] = VocabularyRanking.objects.filter(vocabularyRanked=context['vocabulary'], voter=self.request.user)[
                    0].vote
            else:
                context['hasVoted'] = False

        return context


def rateDataset(request, pk, vt):
    vocid = int(pk)
    voteSubmitted = int(vt)
    res = {}
    dataJson = []
    if request.is_ajax():
        if (not request.user.is_authenticated()):
            res['result'] = "You must be logged in to rate."
            code = 403
        else:
            if ((voteSubmitted < 1) or (voteSubmitted > 5)):
                res['result'] = "Invalid vote " + voteSubmitted + ", votes must be between 1 and 5."
                code = 401
            else:
                if (not Vocabulary.objects.get(id=vocid)):
                    res['result'] = "Vocabulary does not exist."
                    code = 404
                else:
                    if (VocabularyRanking.objects.filter(vocabularyRanked=Vocabulary.objects.get(id=vocid),
                                                         voter=request.user).exists()):
                        res['result'] = "You have already ranked this vocabulary."
                        code = 403
                    else:
                        vocabulary = Vocabulary.objects.get(id=vocid)
                        ranking = VocabularyRanking.objects.create(voter=request.user, vocabularyRanked=vocabulary,
                                                                   vote=voteSubmitted)
                        ranking.save()
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
                comment = VocabularyComments.objects.create(commentText=commentTxt,
                                                            vocabularyCommented=Vocabulary.objects.get(id=vocid),
                                                            user=request.user)
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
