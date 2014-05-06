import views

from django.conf.urls import patterns, include, url
from django.contrib.auth.decorators import login_required
from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', views.index, name='home'),
	url(r'^community/$', login_required(views.UserListView.as_view()), name='community'),
	url(r'^sparql/$', views.sparql, name='sparql'),
	url(r'^accounts/', include('allauth.urls')),
	url(r'^terms-of-use/$', views.terms, name='terms'),
	
	#Authentication
	url(r'^profile/(?P<pk>\d+)/$', login_required(views.profile), name='profile'),
	url(r'^profile/(?P<pk>\w+)/edit$', login_required(views.UserUpdateView.as_view()), name='profile-edit'),
    url(r'^admin/', include(admin.site.urls)),
	
	#Messaging
	(r'^messages/', include('messages.urls')),
	
	#API calls
	url(r'^api/users/', login_required(views.users), name='users'),
)
