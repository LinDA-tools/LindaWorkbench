__author__ = 'dimitris'

"""
URLS for the Advanced Builder
"""

from django.conf.urls import patterns, include, url
from builder_advanced import views


urlpatterns = patterns('',
                       # Basic pages
                       url(r'^$', views.index, name='advanced-builder-index'),

                       # API calls
                       url(r'^api/active_classes/(?P<dt_name>[\w-]+)/$', views.active_classes),
                       url(r'^api/active_class_properties/(?P<dt_name>[\w-]+)/$',
                           views.active_class_properties),
                       url(r'^api/get_property_type/(?P<dt_name>[\w-]+)/$', views.get_property_type),
)
