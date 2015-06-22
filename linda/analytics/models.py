from django.db import models
from django.forms import ModelForm
import os
import datetime
from django.conf import settings
from django.contrib.auth.models import User
import json


# Create your models here.

EXPORT_CHOICES = (
    ('N-Tripples', 'N-Triples'),
    ('TTL', 'Turtle'),
    ('RDFXML', 'rdf/xml'),
    ('csv', 'csv'),
    ('arff', 'arff'),
    ('txt', 'txt'),
)

class Category(models.Model):
    name = models.CharField(max_length=400)
    description = models.TextField(max_length=4000)
    def __str__(self):
        return self.name  
    def display_category_description(self):
        return self.description 
    def as_json(self):
            return dict(
                id=self.id,
                name=self.name,
                description=self.description
                )  
      

class Algorithm(models.Model):
    name = models.CharField(max_length=400)
    description = models.TextField(max_length=4000)
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


class Plot(models.Model):
    description = models.TextField(max_length=2000)
    image = models.ImageField(upload_to='plots/', blank=True,max_length=500)
    def __str__(self):
        return self.image.name
    def display_plot_description(self):
        return self.description 
    def display_image_file(self):
         if os.path.isfile(self.image.path):
           fp = open(self.image.path);
           return fp.read()

    

class Document(models.Model):
        document = models.FileField(upload_to='documents/%Y/%m/%d')


class Analytics(models.Model):
    description = models.TextField(max_length=500, blank=True)
    category = models.ForeignKey(Category)
    algorithm = models.ForeignKey(Algorithm)
    trainQuery = models.ForeignKey('linda_app.Query', null=True, related_name='trainQuery', blank=True,on_delete=models.SET_NULL)
    evaluationQuery = models.ForeignKey('linda_app.Query', null=True, related_name='evaluationQuery', blank=True,on_delete=models.SET_NULL)
    document = models.FileField(upload_to='datasets/', blank=True,max_length=500)
    testdocument = models.FileField(upload_to='datasets/', blank=True,max_length=500)
    model = models.FileField(upload_to='models/',max_length=500)
    modelReadable = models.FileField(upload_to='models/',max_length=500)
    processinfo = models.FileField(upload_to='results/',max_length=500)
    resultdocument = models.FileField(upload_to='results/',max_length=500)
    exportFormat = models.CharField(max_length=20, choices=EXPORT_CHOICES)
    publishedToTriplestore = models.BooleanField(default=False)
    version = models.IntegerField()
    loadedRDFContext = models.TextField(max_length=500)
    processMessage = models.TextField(max_length=300)
    user_id = models.IntegerField()
    #user_id = models.ForeignKey('linda_app.UserProfile', null=True, related_name='user', blank=True)
    parameters = models.TextField(max_length=100, blank=True)
    # Auto-populated fields for created on/updated on time
    createdOn = models.DateField(editable=False, null=True)
    updatedOn = models.DateField(editable=False, null=True)
    plot1 = models.ForeignKey(Plot, null=True, related_name='plot1', blank=True)
    plot2 = models.ForeignKey(Plot, null=True, related_name='plot2', blank=True)
    timeToGet_data = models.FloatField(max_length=500, blank=True,default=0)
    data_size = models.FloatField(max_length=5000, blank=True,default=0)
    timeToRun_analytics = models.FloatField(max_length=500, blank=True,default=0)
    timeToCreate_RDF = models.FloatField(max_length=500, blank=True,default=0)
    createModel = models.BooleanField(default=0)
    evalinsight = models.IntegerField(default=0o10)
    evalexectime = models.IntegerField(default=0o10)
    evalresuseoutput = models.IntegerField(default=0o10)
    evaldataquality = models.IntegerField(default=0o10)
    analysisstatus = models.BooleanField(default=False)
    
    def save(self):
        if not self.id:  # first time saved -- create is not set yet
            self.created = datetime.date.today()
            self.updated = datetime.date.today()
        super(Analytics, self).save()  # proceed with the default constructor
    
    def __str__(self):
        return str(self.id)   
    def display_resultdocument_file(self):
        if os.path.isfile(self.resultdocument.path):
            print(self.resultdocument.path);
            fp = open(self.resultdocument.path);
            return fp.read()
    def display_resultdocument_title(self):
        if os.path.isfile(self.resultdocument.path):
           return self.resultdocument.name.replace('results/', '');	 
    def display_model_file(self):
        if os.path.isfile(self.modelReadable.path):
           fp = open(self.modelReadable.path);
           return fp.read()
    def display_category_description(self):
        return self.category.description	 
    def display_algorithm_description(self):
        return self.algorithm.description
    def display_processinfo_file(self):
         if os.path.isfile(self.processinfo.path):
           fp = open(self.processinfo.path);
           print(self.processinfo.path);
           return fp.read()
    def exists_plot1_file(self):
           return os.path.exists(self.plot1.image.path)
    def exists_plot2_file(self):
           return os.path.exists(self.plot2.image.path)
    def display_linda_apache_analytics(self):
           return settings.LINDA_APACHE_ANALYTICS
    def isExportFormatRDFXML(self):
         if self.exportFormat=="RDFXML":
           return "RDFXML" 
    def isExportFormatTTL(self):
         if self.exportFormat=="TTL":
           return "TTL" 
    def isExportFormatNTRIPLES(self):
         if self.exportFormat=="N-Tripples":
           return "N-Tripples" 	 
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
    description = models.CharField(max_length=400)
    def __str__(self):
        return self.name
    def as_json(self):
            return dict(
                id=self.id,
                name=self.name,
                value=self.value,
                description=self.description
                )



class AnalyticsForm(ModelForm):
    class Meta:
        model = Analytics
        fields = ['document','category', 'algorithm', 'exportFormat']



