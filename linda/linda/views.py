from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth.views import login
from django.shortcuts import redirect
from django.views.generic import ListView, UpdateView
from itertools import chain
import json
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
            data=self.request.POST
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
		usernameList = User.objects.filter(username__icontains = q )
		last_nameList = User.objects.filter(first_name__icontains = q )
		first_nameList = User.objects.filter(first_name__icontains = q )
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
