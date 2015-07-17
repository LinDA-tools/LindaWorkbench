from django.contrib import admin

from .models import *

admin.site.register(CSV)
admin.site.register(Column)
admin.site.register(Field)
admin.site.register(AdditionalTriple)
admin.site.register(CSVFile)
