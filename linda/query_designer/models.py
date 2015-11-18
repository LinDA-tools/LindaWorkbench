from django.db import models


# Create your models here.
class Design(models.Model):
    data = models.TextField(blank=False, null=False)  # the json data required to rebuild the design
