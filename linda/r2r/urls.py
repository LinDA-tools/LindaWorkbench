"""
URLS for the Transformation Front end
"""
from django.conf.urls import patterns, include, url
from django.contrib.auth.decorators import login_required
from r2r import views


urlpatterns = patterns('',
                       #Basic pages
                       url(r'^$', views.transform, name='transform'),

                       #js proxies
                       url(r'^api/(?P<link>.*)', views.get_api_call, name='get-api-call'),
)
