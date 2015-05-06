__author__ = 'dimitris'

from django.conf.urls import patterns, url
from query_designer import views
from docs import views as doc_views

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
                       url(r'^api/suggest/(?P<dt_name>[\w-]+)/$', views.get_entity_suggestions),

                       url(r'^api/class_info/(?P<dt_name>[\w-]+)/$', views.class_info),
                       url(r'^api/get_properties_with_domain/(?P<dt_name>[\w-]+)/$', views.get_properties_with_domain),
                       url(r'^api/get_property_type/(?P<dt_name>[\w-]+)/$', views.get_property_type),
                       url(r'^api/active_properties/(?P<dt_name>[\w-]+)/$', views.active_properties),

                       # Docs
                       url(r'^docs/sparql/(?P<keyword>[\w-]+)/', doc_views.sparql_core_docs)
)
