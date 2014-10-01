from django.conf.urls import patterns, url
from analytics import views

urlpatterns = patterns('',

    url(r'^$', views.analytics, name='analytics'),
    url(r'^(?P<analytics_id>\d+)/$', views.detail, name='detail'),
    #url(r'^delete/(?P<analytics_id>\d+)/$', views.analytics_delete,name='analytics_delete',),
    url(r'^(?P<pk>\d+)/delete/$', views.AnalyticsDeleteView.as_view(),name='analytics-delete'),
    url(r'^(?P<analytics_id>\d+)/reevaluate/$', views.reevaluate,name='reevaluate'),
    url(r'^list/$', 'list', name='list'),
    url(r'^ajax$', views.ajax, name='ajax'),
)