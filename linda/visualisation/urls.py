"""
URLS for the Visualisation Front end
"""
from django.conf.urls import patterns, include, url
from django.contrib.auth.decorators import login_required
from visualisation import views


urlpatterns = patterns('',
                       #Basic pages
                       url(r'^$', views.visualizations, name='visualizations'),
                       url(r'^visualize/datasource/(?P<dtname>[\w-]+)/$', views.visualizeDatasource,
                           name='visualize-datasource'),
                       #js proxies
                       #url(r'^api/(?P<link>.*)', views.get_api_call, name='get-api-call'),
)
