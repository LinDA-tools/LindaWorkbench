__author__ = 'dimitris'

from django.conf.urls import patterns, url
from endpoint_monitor import views

urlpatterns = patterns('',
                       # Basic pages
                       url(r'^statistics/$', views.statistics, name='statistics'),
                       )