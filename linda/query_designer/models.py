from django.db import models


# Create your models here.
class Design(models.Model):
    data = models.CharField(max_length=32768, blank=False, null=False)  # the json data required to rebuild the design
