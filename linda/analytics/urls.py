from django.conf.urls import patterns, url
from analytics import views

urlpatterns = patterns('',

    url(r'^$', views.analytics, name='analytics'),
    url(r'^(?P<analytics_id>\d+)/$', views.detail, name='detail'),
    url(r'^report/(?P<analytics_id>\d+)/$', views.detailtoprint, name='detailtoprint'),
    #url(r'^delete/(?P<analytics_id>\d+)/$', views.analytics_delete,name='analytics_delete',),
    url(r'^(?P<pk>\d+)/delete/$', views.AnalyticsDeleteView.as_view(),name='analytics-delete'),
    url(r'^(?P<analytics_id>\d+)/reevaluate/(?P<model>\d+)/$', views.reevaluate,name='reevaluate'),
    url(r'^report/(?P<analytics_id>\d+)/exportreport/$', views.exportreport,name='exportreport'),
    url(r'^(?P<analytics_id>\d+)/sendRDFToTriplestore/$', views.sendRDFToTriplestore,name='sendRDFToTriplestore'),
    url(r'^list/$', 'list', name='list'),
    url(r'^ajax$', views.ajax, name='ajax'),
    url(r'^get_info$', views.get_info, name='get_info'),
    url(r'^get_trainQuery$', views.get_trainQuery, name='get_trainQuery'),
    url(r'^edit_evaluation_query$', views.edit_evaluation_query, name='edit_evaluation_query'),
    url(r'^get_query_evaluation_info', views.get_query_evaluation_info, name='get_query_evaluation_info'),
    url(r'^edit_output_format$', views.edit_output_format, name='edit_output_format'),
    url(r'^edit_parameters$', views.edit_parameters, name='edit_parameters'),    
    url(r'^get_evaluationQuery$', views.get_evaluationQuery, name='get_evaluationQuery'),
    url(r'^popup_query_info', views.popup_query_info, name='popup_query_info'),
    url(r'^datasourceCreateRDF/$', views.datasourceCreateRDF,name='datasourceCreateRDF'),
    url(r'^statistics_4_drildown_Datasources', views.statistics_4_drildown_Datasources, name='statistics_4_drildown_Datasources'),
    url(r'^statistics_4_drildown_Algorithms', views.statistics_4_drildown_Algorithms, name='statistics_4_drildown_Algorithms'),
    url(r'^statistics_4_timeseries', views.statistics_4_timeseries, name='statistics_4_timeseries'),
    url(r'^statistics4heatmap', views.statistics4heatmap, name='statistics4heatmap'),
    url(r'^statistics', views.statistics, name='statistics'),
    url(r'^find/$', views.site_search, name='site-search'), 
    url(r'^evaluation/$', views.evaluation, name='evaluation'),  
)

