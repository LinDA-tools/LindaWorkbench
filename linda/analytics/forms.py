from django import forms
from analytics.models import EXPORT_CHOICES
from analytics.models import Category, Algorithm, Analytics, Params, Document


    
class AnalyticsForm(forms.ModelForm):
    class Meta:
        model = Analytics   
        exclude = ('version','user_id','loadedRDFContext','processMessage',)         
         
    description = forms.CharField(widget=forms.Textarea(attrs={'cols': 70, 'rows': 4}))
    document = forms.FileField(
        label='Select a file',
        help_text='max. 42 megabytes'
    )
    testdocument = forms.FileField(
            label='Select a file',
            help_text='max. 42 megabytes',
            required=False
        )    
    exportFormat = forms.CharField(max_length=10,
            widget=forms.Select(choices=EXPORT_CHOICES)) 
    category = forms.ModelChoiceField(queryset=Category.objects.all())   
    resultdocument = forms.FileField(widget=forms.HiddenInput(),required=False)
    model = forms.FileField(required=False) 
    processinfo = forms.FileField(required=False) 
    modelReadable = forms.FileField(required=False) 
    algorithm = forms.ModelChoiceField(queryset=Algorithm.objects.all()) 
         
    
    """
    #algorithm = forms.ModelChoiceField(queryset=Algorithm.objects.all()) 
     algorithm = forms.ModelChoiceField(queryset=Algorithm.objects.filter(category__id=1), initial=1)
    textanalysis = forms.BooleanField(required=True, widget=None, label=None, 
                                     initial=None, 
                                     help_text='', 
                                     error_messages=None, 
                                     show_hidden_initial=False, 
                                     validators=[], 
                                     localize=False)
    """
   

class DocumentForm(forms.ModelForm):
    class Meta:
        model = Document
        exclude = ()

    document = forms.FileField(
        label='Select a file'
    )

   
  