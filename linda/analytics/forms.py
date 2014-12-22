from django import forms
from analytics.models import EXPORT_CHOICES
from analytics.models import Category, Algorithm, Analytics, Params, Document
from linda_app.models import Query



    
class AnalyticsForm(forms.ModelForm):
   
    class Meta:
        model = Analytics   
        exclude = ('version','user_id','loadedRDFContext','processMessage', )     
        fields = ('id', 'description', 'document', 'testdocument','trainQuery',  'evaluationQuery', 'exportFormat', 'category', 'resultdocument', 'model', 'processinfo', 'modelReadable', 'modelReadable', 'algorithm', 'parameters')
         
    description = forms.CharField(widget=forms.Textarea(attrs={'cols': 70, 'rows': 3}), required=False)
    document = forms.FileField(
        label='Select a file',
        help_text='max. 42 megabytes',
        required=False
    )
    testdocument = forms.FileField(
            label='Select a file',
            help_text='max. 42 megabytes',
            required=False
        ) 
   # trainQuery_display = forms.CharField(label='trainQuery')  #Display user a charfield
   # evaluationQuery_display = forms.CharField(label='evaluationQuery')  #Display user a charfield
   
    trainQuery = forms.ModelChoiceField(queryset=Query.objects.all(),required=False) 
    evaluationQuery = forms.ModelChoiceField(queryset=Query.objects.all(),required=False)
    #evaluationQuery = forms.CharField(required=False)
    exportFormat = forms.CharField(max_length=10,widget=forms.Select(choices=EXPORT_CHOICES)) 
    category = forms.ModelChoiceField(queryset=Category.objects.all())   
    resultdocument = forms.FileField(widget=forms.HiddenInput(),required=False)
    model = forms.FileField(required=False) 
    processinfo = forms.FileField(required=False) 
    modelReadable = forms.FileField(required=False) 
    algorithm = forms.ModelChoiceField(queryset=Algorithm.objects.all())   
    parameters = forms.CharField(required=False)
    #def __init__(self, *args, **kwargs):
       #super(AnalyticsForm, self).__init__(*args, **kwargs)
       #self.fields['trainQuery'].widget = forms.HiddenInput()  #Make actual customer a hidden field
       #self.fields['evaluationQuery'].widget = forms.HiddenInput()  #Make actual customer a hidden field
    


class DocumentForm(forms.ModelForm):
    class Meta:
        model = Document
        exclude = ()

    document = forms.FileField(
        label='Select a file'
    )

   
  