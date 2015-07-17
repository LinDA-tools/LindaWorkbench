from django.conf.urls import patterns, url

from transformation import views


urlpatterns = patterns('',
                       url(r'^$', views.data_choice, name='data-choice-view'),
                       url(r'csv/step/1', views.csv_upload, name='csv-upload-view'),
                       url(r'csv/step/2', views.csv_column_choice, name='csv-column-choice-view'),
                       url(r'csv/step/3', views.csv_subject, name='csv-subject-view'),
                       url(r'csv/step/4', views.csv_predicate, name='csv-predicate-view'),
                       url(r'csv/step/5', views.csv_object, name='csv-object-view'),
                       url(r'csv/step/6', views.csv_enrich, name='csv-enrich-view'),
                       url(r'csv/step/7', views.csv_publish, name='csv-publish-view'),
                       url(r'^lookup/(?P<queryClass>\w+)/(?P<queryString>\w+)/', 'transformation.views.lookup',
                           name="lookup"),
)
