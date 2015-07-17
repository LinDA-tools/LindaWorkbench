from django import forms

# global fields
hidden_filename_field = forms.CharField(widget=forms.HiddenInput(), required=False)
hidden_model = forms.CharField(widget=forms.HiddenInput(), required=False)
#hidden_csv_content_field = forms.CharField(widget=forms.HiddenInput(),required = False)
hidden_csv_raw_field = forms.CharField(widget=forms.HiddenInput(),required = False)
hidden_rdf_array_field = forms.CharField(widget=forms.HiddenInput(),required = False)
hidden_rdf_prefix_field = forms.CharField(widget=forms.HiddenInput(),required = False)
#hidden_csv_dialect_field = forms.CharField(widget=forms.HiddenInput(),required = False)

class DataChoiceForm(forms.Form):
    list = [('1', 'choose'), ('2', 'your'), ('3', 'file'), ('4', 'here'), ]
    fileList = forms.ChoiceField(choices=list, required=False, )
    fileList.widget.attrs['class'] = 'data_source_select'
    fileList.widget.attrs['size'] = '5'
    initial = {'max_number': '3'}


class UploadFileForm(forms.Form):
    hidden_filename_field = hidden_filename_field
    hidden_csv_raw_field = hidden_csv_raw_field
    hidden_rdf_array_field = hidden_rdf_array_field
    hidden_model = hidden_model

    line_end = forms.CharField(max_length=4, required=False)
    delimiter = forms.CharField(max_length=1, required=False)
    escape = forms.CharField(max_length=1, required=False)
    quotechar = forms.CharField(max_length=1, required=False)
    #won't get automatically refilled for security reasons http://stackoverflow.com/questions/3097982/how-to-make-a-django-form-retain-a-file-after-failing-validation
    upload_file = forms.FileField(required=False)


class CsvColumnChoiceForm(forms.Form):
    hidden_filename_field = hidden_filename_field
    hidden_csv_raw_field = hidden_csv_raw_field
    hidden_rdf_array_field = hidden_rdf_array_field
    hidden_model = hidden_model

    FAVORITE_COLORS_CHOICES = (('blue', 'Blue'),
                               ('green', 'Green'),
                               ('black', 'Black'))
    columns = forms.MultipleChoiceField(required=False,
                                        widget=forms.CheckboxSelectMultiple, choices=FAVORITE_COLORS_CHOICES)


class SubjectForm(forms.Form):
    hidden_filename_field = hidden_filename_field
    hidden_csv_raw_field = hidden_csv_raw_field
    hidden_rdf_array_field = hidden_rdf_array_field
    hidden_model = hidden_model


class PredicateForm(forms.Form):
    hidden_filename_field = hidden_filename_field
    hidden_csv_raw_field = hidden_csv_raw_field
    hidden_rdf_array_field = hidden_rdf_array_field
    hidden_rdf_prefix_field = hidden_rdf_prefix_field
    hidden_model = hidden_model


class ObjectForm(forms.Form):
    hidden_filename_field = hidden_filename_field
    hidden_csv_raw_field = hidden_csv_raw_field
    hidden_rdf_array_field = hidden_rdf_array_field
    hidden_rdf_prefix_field = hidden_rdf_prefix_field
    hidden_model = hidden_model

class EnrichForm(forms.Form):
    hidden_filename_field = hidden_filename_field
    hidden_csv_raw_field = hidden_csv_raw_field
    hidden_rdf_array_field = hidden_rdf_array_field
    hidden_rdf_prefix_field = hidden_rdf_prefix_field
    hidden_model = hidden_model


class PublishForm(forms.Form):
    hidden_filename_field = hidden_filename_field
    hidden_csv_raw_field = hidden_csv_raw_field
    hidden_rdf_array_field = hidden_rdf_array_field
    hidden_rdf_prefix_field = hidden_rdf_prefix_field
    hidden_model = hidden_model

