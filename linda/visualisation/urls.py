"""
URLS for the Visualisation Front end
"""
from django.conf.urls import patterns, include, url
from django.contrib.auth.decorators import login_required
from visualisation import views


urlpatterns = patterns('',
                       #Basic pages
                       url(r'^$', views.visualizations, name='visualizations'),
                       #js proxies
                       url(r'^visual/api/(?P<link>.*)', views.get_api_call, name='get-api-call'),
)
