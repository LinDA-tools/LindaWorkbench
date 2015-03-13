from django.db import models
from linda_app.models import DatasourceDescription


# A single test over a data source
class EndpointTest(models.Model):
    execution_time = models.DateTimeField(auto_now_add=True)  # test timestamp
    datasource = models.ForeignKey(DatasourceDescription)  # tested datasource
    up = models.BooleanField(default=False)  # was the endpoint up? - simple select query
    response_time = models.IntegerField(blank=True, null=True)  # response time for a simple select query
    supports_minus = models.BooleanField(default=True, blank=True)  # did the endpoint support SparQL features 1.1 like MINUS?