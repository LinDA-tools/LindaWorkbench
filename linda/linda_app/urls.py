from django.contrib import admin
from django.conf.urls import patterns, include, url
from django.contrib.auth.decorators import login_required
from django.views.generic import RedirectView

from forms import AutocompleteModelSearchForm
from haystack.views import SearchView, search_view_factory
from linda_app.installer import views as installer_views

import views

admin.autodiscover()
admin.site.site_title = 'LinDA Administration'
admin.site.site_header = 'LinDA Administration Panel'

urlpatterns = patterns('',
                       # Basic pages
                       url(r'^$', views.index, name='home'),
                       url(r'^terms-of-use/$', views.terms, name='terms'),
                       url(r'^community/$', login_required(views.UserListView.as_view()), name='community'),
                       url(r'^settings/$', login_required(views.ConfigurationUpdateView.as_view()), name='settings'),
                       url(r'^get-started/$', views.getstarted, name='getstarted'),
                       
                       # Endpoints
                       url(r'^sparql/$', views.sparql, name='sparql'),
                       url(r'^sparql/queries/(?P<q_id>\w+)/$', views.sparql, name='sparql'),
                       url(r'^sparql/(?P<dtname>[\w-]+)/$', views.datasource_sparql, name='datasource-sparql'),

                       # Visualizations
                       url(r'^visualizations/', include('visualisation.urls')),

                       # Analytics
                       url(r'^analytics/', include('analytics.urls', namespace="analytics")),

                       # Transformations
                       url(r'^transformation/', include('transformation.urls')),

                       # Transformations
                       url(r'^transformations/', include('r2r.urls')),

                       # Query Designer
                       url(r'^query-designer/', include('query_designer.urls')),

                       # Endpoint Monitor
                       url(r'^endpoint-monitor/', include('endpoint_monitor.urls')),

                       # Authentication
                       url(r'^admin/', include(admin.site.urls)),

                       url(r'^accounts/logout/$', 'django.contrib.auth.views.logout', {'next_page': '/'},
                           name='iamapps.logout'),
                       url(r'^accounts/', include('allauth.urls')),
                       url(r'^profile/(?P<pk>\d+)/$', login_required(views.profile), name='profile'),
                       url(r'^profile/(?P<pk>\w+)/edit$', login_required(views.UserUpdateView.as_view()),
                           name='profile-edit'),

                       # Messaging
                       (r'^messages/', include('messages.urls')),

                       # Site search
                       url(r'^find/$', views.site_search, name='site-search'),  # Vocabulary search
                       url(r'^vocabularies/all/$', views.VocabularyListView.as_view()),
                       url(r'^vocabularies/categories/$', views.VocabularyListView.as_view()),
                       url(r'^classes/all/$', views.ClassListView.as_view()),
                       url(r'^properties/all/$', views.PropertyListView.as_view()),

                       url(r'^vocabularies/categories/all/$', views.categories),

                       url(r'^vocabularies/$', views.vocabulary_search),
                       url(r'^autocomplete/', views.autocomplete),
                       url(r'^search/vocabulary/', search_view_factory(

                           view_class=SearchView,
                           template='search/autocomplete.html',
                           form_class=AutocompleteModelSearchForm
                       ), name='haystack_search'),

                       # Vocabularies
                       url(r'^vocabulary/(?P<pk>\d+)/$', views.VocabularyDetailsView.as_view(),
                           name='vocabulary-detail'),
                       url(r'^class/(?P<pk>\d+)/$', views.VocabularyClassDetailsView.as_view(),
                           name='class-detail'),
                       url(r'^property/(?P<pk>\d+)/$', views.VocabularyPropertyDetailsView.as_view(),
                           name='property-detail'),

                       url(r'^vocabulary/create/$', views.VocabularyCreateView.as_view(),
                           name='vocabulary-create'),
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

                       # Vocabulary updates
                       url(r'^api/vocabularies/versions/$', views.get_vocabulary_versions,
                           name='vocabulary-version'),
                       url(r'^api/vocabularies/(?P<pk>\d+)/$', views.get_vocabulary_data,
                           name='vocabulary-get'),
                       url(r'^api/vocabularies/$', views.post_vocabulary_data,
                           name='vocabulary-get'),
                       url(r'^api/vocabularies/(?P<pk>\d+)/update/$', views.update_vocabulary_data,
                           name='vocabulary-update'),
                       url(r'^api/vocabularies/(?P<pk>\d+)/delete/$', views.delete_vocabulary_data,
                           name='vocabulary-delete'),

                       # Vocabulary repo proxy
                       url(r'^api/vocabulary-repo/(?P<link>.*)', views.vocabulary_repo_api_call,
                           name='vocabulary-repo-api-call'),

                       # Datasources
                       url(r'^datasources/$', views.datasources, name='datasources'),
                       url(r'^datasource/create/$', views.datasourceCreate,
                           name='datasource-create'),
                       url(r'^datasource/create/rdf/$', views.datasourceCreateRDF,
                           name='datasource-create-rdf'),

                       url(r'^datasource/(?P<dtname>[\w-]+)/download/$', views.datasourceDownloadRDF,
                           name='datasource-download-rdf'),

                       url(r'^datasource/(?P<name>[\w-]+)/replace/$', views.datasourceReplace,
                           name='datasource-replace'),
                       url(r'^datasource/(?P<dtname>[\w-]+)/replace/rdf/$', views.datasourceReplaceRDF,
                           name='datasource-replace-rdf'),

                       url(r'^datasource/(?P<dtname>[\w-]+)/delete/$', views.datasourceDelete,
                           name='datasource-delete'),

                       # Query Builder
                       url(r'^query/execute_sparql$', views.execute_sparql),
                       url(r'^query/(?P<pk>\d+)/visualize/', views.query_visualize),
                       url(r'^query/(?P<link>.*)', views.get_qbuilder_call, name='query-builder-proxy'),
                       url(r'^rdf2any/(?P<link>.*)', views.get_rdf2any_call, name='rdf2any-proxy'),
                       url(r'^query-builder/save/(?P<pk>\d+)/$', views.query_update, name='query-builder-update'),
                       url(r'^query-builder/delete/(?P<pk>\d+)/$', views.query_delete, name='query-builder-delete'),
                       url(r'^query-builder/save/$', views.query_save, name='query-builder-save'),
                       url(r'^query-builder/$', views.queryBuilder,
                           name='query-builder'),
                       url(r'^queries', views.QueryListView.as_view(), name='saved-queries'),
                       url(r'^assets/jar-loading.gif$', RedirectView.as_view(url='/static/images/jar-loading.gif')),

                       # Installer
                       url(r'^api/installer/run/$', installer_views.run_installer, name='run-installer'),

                       # API calls
                       url(r'^api/users/', login_required(views.api_users), name='users'),

                       url(r'^api/queries/default-description', views.default_description, name='users'),

                       url(r'^api/datasources/', views.api_datasources_list, name='datasources-list'),
                       url(r'^api/datasource/create/', views.api_datasource_create, name='datasource-create'),
                       url(r'^api/datasource/(?P<dtname>[\w-]+)/replace/', views.api_datasource_replace,
                           name='datasource-replace'),
                       url(r'^api/datasource/(?P<dtname>[\w-]+)/delete/', views.api_datasource_delete,
                           name='datasource-delete'),
                       url(r'^api/datasource/(?P<dtname>[\w-]+)/', views.api_datasource_get, name='datasource-get'),

                       url(r'coreapi/', include('coreapi.urls')),


)
