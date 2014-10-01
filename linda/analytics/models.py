from django.db import models
from django.forms import ModelForm
from smart_selects.db_fields import ChainedForeignKey
import os


# Create your models here.

EXPORT_CHOICES = (
    ('rdf', 'rdf/xml'),
    ('csv', 'csv'),
    ('arff', 'arff'),
    ('txt', 'txt'),
    ('xml', 'xml'),
    ('html', 'html'),
)

class Category(models.Model):
    name = models.CharField(max_length=400)
    description = models.CharField(max_length=400)
    def __str__(self):
        return self.name


class Algorithm(models.Model):
    name = models.CharField(max_length=400)
    description = models.TextField(max_length=1000)
    category = models.ForeignKey(Category)
    def __str__(self):
        return self.name
    def category_name(self):
        return self.category.name
    category_name.short_description = 'Category Name'
    def display_algorithm_description(self):
        return self.name
    def as_json(self):
            return dict(
                id=self.id,
                name=self.name,
                description=self.description
                )


class Document(models.Model):
        document = models.FileField(upload_to='documents/%Y/%m/%d')


class Analytics(models.Model):
    category = models.ForeignKey(Category)
    algorithm = ChainedForeignKey(
        Algorithm,
        chained_field="category",
        chained_model_field="name",
        show_all=False,
        auto_choose=True
    )
    #algorithm = models.ForeignKey(Algorithm)
    #document = models.ForeignKey(Document)
    document = models.FileField(upload_to='./analytics/documents/datasets/')
    testdocument = models.FileField(upload_to='./analytics/documents/datasets/')
    model = models.FileField(upload_to='./analytics/documents/models/')
    modelReadable = models.FileField(upload_to='./analytics/documents/models/')
    processinfo = models.FileField(upload_to='./analytics/documents/results/')
    resultdocument = models.FileField(upload_to='./analytics/documents/results/')
    exportFormat = models.CharField(max_length=20, choices=EXPORT_CHOICES)
    def __str__(self):
        return self.name
    def display_resultdocument_file(self):
        if os.path.isfile(self.resultdocument.path):
           fp = open(self.resultdocument.path);
           return fp.read()
    def display_model_file(self):
        if os.path.isfile(self.modelReadable.path):
           fp = open(self.modelReadable.path);
           return fp.read()
    def display_algorithm_description(self):
        return self.algorithm.description
    def display_processinfo_file(self):
         if os.path.isfile(self.processinfo.path):
           fp = open(self.processinfo.path);
           return fp.read()
    def delete(self, *args, **kwargs):
	    ##delete document file
	    # You have to prepare what you need before delete the model
	    storage1, path1 =  self.document.storage if self.document else None, self.document.path if self.document else None
	    storage2 = self.testdocument.storage if self.testdocument else None
	    path2 = self.testdocument.path if self.testdocument else None
	    storage3, path3 =  self.model.storage if self.model else None, self.model.path if self.model else None    
	    storage4, path4 =  self.modelReadable.storage if self.modelReadable else None, self.modelReadable.path if self.modelReadable else None    
	    storage5, path5 =  self.processinfo.storage if self.processinfo else None, self.processinfo.path if self.processinfo else None    
	    storage6, path6 =  self.resultdocument.storage if self.resultdocument else None, self.resultdocument.path if self.resultdocument else None    

	    # Delete the model before the file
	    super(Analytics, self).delete(*args, **kwargs)
	    # Delete the file after the model
	    if path1:
	       storage1.delete(path1)
	    if path2:
	       storage2.delete(path2)
	    if path3:   
	       storage3.delete(path3)
	    if path4:   
	       storage4.delete(path4)
	    if path5:   
	       storage5.delete(path5)
	    if path6:   
	       storage6.delete(path6)   
	      
	      
	   

class Params(models.Model):
    algorithm = models.ForeignKey(Algorithm)
    name = models.CharField(max_length=400)
    value = models.CharField(max_length=400)
    def __str__(self):
        return self.name





class AnalyticsForm(ModelForm):
    class Meta:
        model = Analytics
        fields = ['document','category', 'algorithm', 'exportFormat']



