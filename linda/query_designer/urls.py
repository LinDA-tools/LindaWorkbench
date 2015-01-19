__author__ = 'dimitris'

"""
URLS for the Advanced Builder
"""

from django.conf.urls import patterns, include, url
from query_designer import views


urlpatterns = patterns('',
                       # Basic pages
                       url(r'^$', views.index, name='advanced-builder-index'),
                       url(r'^(?P<pk>\d+)/$', views.load_design),

                       # API calls
                       url(r'^api/active_classes/(?P<dt_name>[\w-]+)/$', views.active_classes),
                       url(r'^api/active_root_classes/(?P<dt_name>[\w-]+)/$', views.active_root_classes),
                       url(r'^api/active_subclasses/(?P<dt_name>[\w-]+)/$', views.active_subclasses),

                       url(r'^api/object_properties/(?P<dt_name>[\w-]+)/$', views.object_properties),

                       url(r'^api/active_class_properties/(?P<dt_name>[\w-]+)/$',
                           views.active_class_properties),
                       url(r'^api/get_property_type/(?P<dt_name>[\w-]+)/$', views.get_property_type),
)
