from django.db import models
from django.contrib import admin
from django.forms import TextInput, Textarea
from analytics.models import Category, Algorithm, Params,Analytics


class ParamsInline(admin.TabularInline):
    model = Params
    extra = 3

class AlgorithmInline(admin.TabularInline):
    model = Algorithm
    extra = 3          

class CategoryAdmin(admin.ModelAdmin):
    #fieldsets = [
    #    ('Name', {'fields': ['name']}),
    #    ('Description', {'fields': ['description']}),
    #]  
    inlines = [AlgorithmInline]
 
class AlgorithmAdmin(admin.ModelAdmin):
    #formfield_overrides = {
    #          models.TextField: {'widget': Textarea(attrs={'rows':30, 'cols':100})},
    #      }    
    inlines = [ParamsInline]
    list_display = ['name', 'description','category_name']
    list_filter = ['name']
    search_fields = ['name']  
  

admin.site.register(Category, CategoryAdmin)
admin.site.register(Algorithm, AlgorithmAdmin)
#admin.site.register(Analytics)
