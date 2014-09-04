from django.contrib import admin
from django.conf.urls import patterns, include, url
from django.contrib.auth.decorators import login_required

from forms import AutocompleteModelSearchForm
from haystack.views import SearchView, search_view_factory

import views

admin.autodiscover()

urlpatterns = patterns('',
                       #Basic pages
                       url(r'^$', views.index, name='home'),
                       url(r'^sparql/$', views.sparql, name='sparql'),
                       url(r'^terms-of-use/$', views.terms, name='terms'),
                       url(r'^community/$', login_required(views.UserListView.as_view()), name='community'),

                       #Visualizations
                       url(r'^visualizations/$', views.visualizations, name='visualizations'),
                       url(r'^visualize/datasource/(?P<dtname>[\w-]+)/$', views.visualizeDatasource,
                           name='visualize-datasource'),

                       #Analytics
                       url(r'^analytics/$', views.analytics, name='analytics'),
                       url(r'^analyze/datasource/(?P<dtname>[\w-]+)/$', views.analyzeDatasource,
                           name='analyze-datasource'),

                       #Transformations
                       url(r'^transformations/$', views.transformations, name='transformations'),

                       #Authentication
                       url(r'^admin/', include(admin.site.urls)),
                       url(r'^accounts/', include('allauth.urls')),
                       url(r'^profile/(?P<pk>\d+)/$', login_required(views.profile), name='profile'),
                       url(r'^profile/(?P<pk>\w+)/edit$', login_required(views.UserUpdateView.as_view()),
                           name='profile-edit'),

                       #Messaging
                       (r'^messages/', include('messages.urls')),

					   #Vocabulary search
                       url(r'^vocabularies/all/$', views.VocabularyListView.as_view()),
                       url(r'^vocabularies/', include('haystack.urls')),
                       url(r'^autocomplete/', views.autocomplete),
                       url(r'^search/vocabulary/', search_view_factory(

                            view_class=SearchView,
                            template='search/autocomplete.html',
                            form_class=AutocompleteModelSearchForm
                         ), name='haystack_search'),

                       #Vocabularies
                       url(r'^vocabulary/(?P<pk>\d+)/$', views.VocabularyDetailsView.as_view(),
                           name='vocabulary-detail'),

                       url(r'^vocabulary/(?P<pk>\d+)/edit/$', views.VocabularyUpdateView.as_view(),
                           name='vocabulary-edit'),
                       url(r'^vocabulary/(?P<pk>\d+)/delete/$', views.VocabularyDeleteView.as_view(),
                           name='vocabulary-delete'),
                        url(r'^vocabulary/(?P<pk>\d+)/(?P<slug>[\w-]+)/visualize/$', views.VocabularyVisualize.as_view(),
                           name='vocabulary-visualize'),
                       url(r'^vocabulary/(?P<pk>\d+)/comment/', views.postComment, name='vocabulary-comment'),
                       url(r'^vocabulary/(?P<pk>\d+)/rate/(?P<vt>\d+)/', views.rateDataset, name='vocabulary-rate'),
                       url(r'^vocabulary/(?P<pk>\d+)/download/(?P<type>[\w-]+)/$', views.downloadRDF,
                           name='vocabulary-download'),
                       url(r'^vocabulary/(?P<pk>\d+)/(?P<slug>[\w-]+)/$', views.VocabularyDetailsView.as_view(),
                           name='vocabulary-detail'),

                       #Datasources
                       url(r'^datasources/$', views.datasources, name='datasources'),
                       url(r'^datasource/create/$', views.datasourceCreate,
                           name='datasource-create'),
                       url(r'^datasource/create/rdf/$', views.datasourceCreateRDF,
                           name='datasource-create-rdf'),

                       url(r'^datasource/(?P<dtname>[\w-]+)/download/$', views.datasourceDownloadRDF, name='datasource-download-rdf'),

                       url(r'^datasource/(?P<name>[\w-]+)/replace/$', views.datasourceReplace,
                           name='datasource-replace'),
                       url(r'^datasource/(?P<dtname>[\w-]+)/replace/rdf/$', views.datasourceReplaceRDF,
                           name='datasource-replace-rdf'),

                       url(r'^datasource/(?P<dtname>[\w-]+)/delete/$', views.datasourceDelete,
                           name='datasource-delete'),

                       #Query Builder
                       url(r'^query-builder/', views.queryBuilder,
                           name='query-builder'),

                       #Tools
                       url(r'^rdb2rdf/', views.rdb2rdf, name='rdb2rdf'),

                       #API calls
                       url(r'^api/users/', login_required(views.api_users), name='users'),

                       url(r'^api/datasources/', views.api_datasources_list, name='datasources-list'),
                       url(r'^api/datasource/create/', views.api_datasource_create, name='datasource-create'),
                       url(r'^api/datasource/(?P<dtname>[\w-]+)/replace/', views.api_datasource_replace, name='datasource-replace'),
                       url(r'^api/datasource/(?P<dtname>[\w-]+)/delete/', views.api_datasource_delete, name='datasource-delete'),
                       url(r'^api/datasource/(?P<dtname>[\w-]+)/', views.api_datasource_get, name='datasource-get'),

                       url(r'coreapi/', include('coreapi.urls')),

)
