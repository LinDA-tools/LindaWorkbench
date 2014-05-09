from django import forms
from django.forms.widgets import Select
from models import *


class UserProfileForm(forms.ModelForm):
    picture = forms.ImageField(required=False)

    class Meta:
        model = UserProfile
        exclude = ('user')
        widgets = {
            'country': Select(attrs={'class': 'chzn-select'}),
            'scientific_background': Select(attrs={'class': 'chzn-select'}),
            'rpg_class': Select(attrs={'class': 'chzn-select'}),
        }


class UserForm(forms.ModelForm):
    class Meta:
        model = User