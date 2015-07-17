from django import forms
from django.forms.widgets import Select
from linda_app.models import *


class UserProfileForm(forms.ModelForm):
    picture = forms.ImageField(required=False)

    class Meta:
        model = UserProfile
        exclude = ('user',)
        widgets = {
            'country': Select(attrs={'class': 'chzn-select'}),
            'scientific_background': Select(attrs={'class': 'chzn-select'}),
            'rpg_class': Select(attrs={'class': 'chzn-select'}),
        }


class UserForm(forms.ModelForm):
    class Meta:
        model = User
        exclude = ()


class VocabularyUpdateForm(forms.ModelForm):
    class Meta:
        model = Vocabulary
        exclude = ('uploader', 'datePublished', 'dateCreated', 'score', 'votes', 'downloads')
        widgets = {
            'description': forms.Textarea,
            'example': forms.Textarea,
        }

from haystack.forms import ModelSearchForm


class AutocompleteModelSearchForm(ModelSearchForm):

    def search(self):
        if not self.is_valid():
            return self.no_query_found()
        if not self.cleaned_data.get('q'):
            return self.no_query_found()
        sqs = self.searchqueryset.filter(title_auto=self.cleaned_data['q'])

        if self.load_all:
            sqs = sqs.load_all()

        return sqs


class ConfigurationForm(forms.ModelForm):
    class Meta:
        model = Configuration
        exclude = ()