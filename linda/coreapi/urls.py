__author__ = 'mpetyx'

from django.contrib import admin
from django.conf.urls import patterns, include, url
from django.contrib.auth.decorators import login_required


import views

admin.autodiscover()

urlpatterns = patterns('',
                       #Basic pages
                       # url(r'^$', views.index, name='home'),

                       url(r'^users/', views.api_datasources_list, name='datasources-list'),
                       url(r'^users/{userid}/vocabularies/', views.api_datasource_create, name='datasource-create'),


                       url(r'^vocab/', views.api_datasource_replace, name='datasource-replace'),
                       url(r'^vocab/{id}', views.api_datasource_delete, name='datasource-delete'),
                       url(r'^vocab/search/', views.api_datasource_get, name='datasource-get'),

                        url(r'^properties/', views.api_datasource_get, name='datasource-get'),

                       url(r'^classes/', views.api_datasource_get, name='datasource-get'),





)
