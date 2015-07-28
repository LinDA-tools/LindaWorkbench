import csv
from io import TextIOWrapper
from io import StringIO
import os
import json
from django.http import HttpResponse
from django.shortcuts import render, render_to_response
from django.template import RequestContext
import pandas as pd
from django.http import JsonResponse
import requests
from django.core.files.base import ContentFile
from .forms import *
from django.conf import settings
from .settings import API_HOST
import ast


# ###############################################
# MODELS
# ###############################################


def data_choice(request):
    print("VIEW data_choice")
    form = DataChoiceForm()
    return render_to_response('transformation/data_choice.html', {'form': form},
                              context_instance=RequestContext(request))


def csv_upload(request):
    print("VIEW csv_upload")
    form_action = 2
    if request.method == 'POST':
        print("PATH 1 - POST")
        # a raw representation of the CSV file is also kept as we want to be able to change the CSV dialect and then reload the page
        form = None
        csv_raw = None
        csv_rows = None
        csv_dialect = None
        uploadFileName = 'no file selected'
        # if page was loaded without selecting a file in html form    
        if not request.FILES:
            form = UploadFileForm(request.POST)
            if request.POST and form.is_valid() and form != None:
                print("PATH 1.1 - no file uploaded")
                # content  is passed on via hidden html input fields
                if form.cleaned_data['hidden_csv_raw_field']:
                    csv_raw = form.cleaned_data['hidden_csv_raw_field']
                    csv_rows, csv_dialect = process_csv(StringIO(form.cleaned_data['hidden_csv_raw_field']), form)
                else:
                    print('no raw csv')

                uploadFileName = form.cleaned_data['hidden_filename_field']

            # if page is loaded without POST
            else:
                print("PATH 1.2")

        # when an upload file was selected in html form, APPLY BUTTON
        else:  # if not request.FILES:
            print("PATH 3 - file was uploaded")

            form = UploadFileForm(request.POST, request.FILES)
            uploadFileName = request.FILES['upload_file'].name
            uploadFile = request.FILES['upload_file'].file
            #print(uploadFileName[-4:]);
            if (uploadFileName[-4:] == "xlsx" or uploadFileName[-4:] == ".xls"):
                #print(uploadFileName[-4:]);
                data_xls = pd.read_excel(request.FILES['upload_file'], 0, index_col=None)
                if not os.path.exists('tmp'):
                    os.makedirs('tmp')
                data_xls.to_csv('tmp/' + uploadFileName[:-4] + '.csv', encoding='utf-8')
                uploadFile = open('tmp/' + uploadFileName[:-4] + '.csv', "rb")
                uploadFileName = uploadFileName[:-4] + '.csv'

            if form.is_valid():
                csv_rows = []
                csvLines = []
                rows = []
                csv_dialect = {}
                csv_raw = ""

                # read/process the CSV file and find out about its dialect (csv params such as delimiter, line end...)
                # https://docs.python.org/2/library/csv.html#
                with TextIOWrapper(uploadFile, encoding=request.encoding) as csvfile:
                    #with TextIOWrapper(uploadFile, encoding='utf-8') as csvfile:
                    # the file is also provided in raw formatting, so users can appy changes (choose csv params) without reloading file 
                    csv_raw = csvfile.read()
                    csv_rows, csv_dialect = process_csv(csvfile, form)
            else:  # if form.is_valid():
                print("form not valid")

        if 'button_upload' in request.POST:
            print("UPLOAD BUTTON PRESSED")
            csv_rows = csv_rows if csv_rows else None

            request.session['csv_dialect'] = csv_dialect
            request.session['csv_rows'] = csv_rows
            request.session['csv_raw'] = csv_raw
            if 'upload_file' in request.FILES:
                request.session['file_name'] = request.FILES['upload_file'].name
            #return redirect(reverse('csv-column-choice-view'))
            html_post_data = {
                'action': form_action,
                'form': form,
                'csvContent': request.session['csv_rows'],
                'csvRaw': request.session['csv_raw'],
                'csvDialect': request.session['csv_dialect'],
                'filename': request.session['file_name']
            }
            return render(request, 'transformation/csv_upload.html', html_post_data)

    # html GET, we get here when loading the page 'for the first time'
    else:  # if request.method == 'POST':
        print("PATH 4 - initial page call (HTML GET)")
        form = UploadFileForm()
        return render(request, 'transformation/csv_upload.html', {'action': 1, 'form': form})


def csv_column_choice(request):
    print("VIEW csv_column_choice")
    form_action = 3
    html_post_data = {
        'action': form_action,
        'csvContent': request.session['csv_rows'],
        'filename': request.session['file_name']
    }
    return render(request, 'transformation/csv_column_choice.html', html_post_data)


def csv_subject(request):
    print("VIEW csv_subject")
    form_action = 4
    form = SubjectForm(request.POST)
    if request.POST and form.is_valid() and form != None:
        # content  is passed on via hidden html input fields
        if 'hidden_rdf_array_field' in form.cleaned_data:
            request.session['rdf_array'] = form.cleaned_data['hidden_rdf_array_field']
        else:
            request.session['rdf_array'] = ""

        if 'hidden_rdf_prefix_field' in form.cleaned_data:
            request.session['rdf_prefix'] = form.cleaned_data['hidden_rdf_prefix_field']
        else:
            request.session['rdf_prefix'] = ""
        #print(form.cleaned_data)
        if form.cleaned_data['hidden_model']:
        #if 'hidden_model' in form.cleaned_data:
            print('model existing')
            request.session['model'] = ast.literal_eval(form.cleaned_data['hidden_model'])

        else:
            print('creating model')
            # identify which columns to keep from html form checkboxes
            # like <input name="rowselect2" ... >
            request.session['selected_columns'] = []
            #print("POST ", request.POST)
            num_csv_rows = len(request.session['csv_rows'][0])
            for i in range(len(request.session['csv_rows'][0])):
                colnum = i + 1
                colname = 'rowselect' + str(colnum)
                if colname in request.POST:
                    #print(colnum, " selected ", request.POST.get(colname))
                    request.session['selected_columns'].append(
                        {"col_num_orig": colnum, "checkbox_name": colname, "column_name": request.POST.get(colname)})

            # csv without rows that were not selected in html form
            csv_rows_selected_columns = get_selected_rows_content(request.session)

            # create model that contains all data in json object / python dictionary
            #if not hasattr(request.session, 'model') or true:
            request.session['model'] = {"num_total_fields": num_csv_rows, "columns": []} # get csv column-wise
            inverted_csv = list(zip(*request.session['csv_rows']))
            for i, col in enumerate(inverted_csv):
                column_obj = {"col_num_orig": i+1, "fields": []}
                for j, field in enumerate(col):
                    if j == 0: # table header / first row
                        column_obj['header'] = {"orig_val": field}
                    else:
                        column_obj['fields'].append({"orig_val": field, "field_num": j})
                request.session['model']['columns'].append(column_obj)

            mark_selected_rows_in_model(request.session)

    html_post_data = {
        'rdfModel': request.session['model'],         
        'action': form_action,
        #'csvContent': csv_rows_selected_columns,
        'filename': request.session['file_name'],
        'rdfArray': request.session['rdf_array'],
        'rdfPrefix': request.session['rdf_prefix']
    }
    return render(request, 'transformation/csv_subject.html', html_post_data)


def csv_predicate(request):
    print("VIEW csv_predicate")
    form_action = 5
    form = PredicateForm(request.POST)
    if request.POST and form.is_valid() and form != None:
        # content  is passed on via hidden html input fields
        if 'hidden_rdf_array_field' in form.cleaned_data:
            request.session['rdf_array'] = form.cleaned_data['hidden_rdf_array_field']
        else:
            request.session['rdf_array'] = ""

        if 'hidden_rdf_prefix_field' in form.cleaned_data:
            request.session['rdf_prefix'] = form.cleaned_data['hidden_rdf_prefix_field']
        else:
            request.session['rdf_prefix'] = ""

        if 'hidden_model' in form.cleaned_data:
            request.session['model'] = ast.literal_eval(form.cleaned_data['hidden_model'])
        else:
            request.session['model'] = ""

    csv_rows_selected_columns = get_selected_rows_content(request.session)
    html_post_data = {
        'action': form_action,
        'rdfModel': request.session['model'], 
        'csvContent': csv_rows_selected_columns,
        'filename': request.session['file_name'],
        'rdfArray': request.session['rdf_array'],
	    'rdfPrefix': request.session['rdf_prefix']
    }
    return render(request, 'transformation/csv_predicate.html', html_post_data)


def csv_object(request):
    print("VIEW csv_object")
    form_action = 6
    form = ObjectForm(request.POST)
    if request.POST and form.is_valid() and form != None:
        # content  is passed on via hidden html input fields
        if 'hidden_rdf_array_field' in form.cleaned_data:
            request.session['rdf_array'] = form.cleaned_data['hidden_rdf_array_field']
        else:
            request.session['rdf_array'] = ""

        if 'hidden_rdf_prefix_field' in form.cleaned_data:
            request.session['rdf_prefix'] = form.cleaned_data['hidden_rdf_prefix_field']
        else:
            request.session['rdf_prefix'] = ""

        if 'hidden_model' in form.cleaned_data:
            request.session['model'] = ast.literal_eval(form.cleaned_data['hidden_model'])
        else:
            request.session['model'] = ""

    csv_rows_selected_columns = get_selected_rows_content(request.session)
    html_post_data = {
        'action': form_action,
        'rdfModel': request.session['model'], 
        'csvContent': csv_rows_selected_columns,
        'filename': request.session['file_name'],
        'rdfArray': request.session['rdf_array'],
	    'rdfPrefix': request.session['rdf_prefix']
    }
    return render(request, 'transformation/csv_object.html', html_post_data)


def csv_enrich(request):
    print("VIEW csv_additional")
    form_action = 7
    form = EnrichForm(request.POST)
    if request.POST and form.is_valid() and form != None:
        # content  is passed on via hidden html input fields
        if 'hidden_rdf_array_field' in form.cleaned_data:
            request.session['rdf_array'] = form.cleaned_data['hidden_rdf_array_field']
        else:
            request.session['rdf_array'] = ""

        if 'hidden_rdf_prefix_field' in form.cleaned_data:
            request.session['rdf_prefix'] = form.cleaned_data['hidden_rdf_prefix_field']
        else:
            request.session['rdf_prefix'] = ""

        if 'hidden_model' in form.cleaned_data:
            request.session['model'] = ast.literal_eval(form.cleaned_data['hidden_model'])
        else:
            request.session['model'] = ""

    csv_rows_selected_columns = get_selected_rows_content(request.session)
    html_post_data = {
        'action': form_action,
        'rdfModel': request.session['model'], 
        'csvContent': csv_rows_selected_columns,
        'filename': request.session['file_name'],
        'rdfArray': request.session['rdf_array'],
	    'rdfPrefix': request.session['rdf_prefix']
    }
    return render(request, 'transformation/csv_enrich.html', html_post_data)


def csv_publish(request):
    print("VIEW csv_publish")
    form_action = 7  #refers to itself
    form = PublishForm(request.POST)
    rdf_n3 = "@prefix dbpedia: <http://dbpedia.org/resource> .\n"
    publish_massage = ""
    if request.POST and form.is_valid() and form != None:

        if form.cleaned_data['hidden_rdf_array_field']:
            request.session['rdf_array'] = form.cleaned_data['hidden_rdf_array_field']
            for row in ast.literal_eval(request.session['rdf_array']):
                for elem in row:
                    elem = elem.replace(",","\\,"); # escape commas
                    if elem[-1:] == ".": # cut off as we had problems when uploading some uri like xyz_inc. with trailing dot
                        elem = elem[:-1]
                    rdf_n3 += elem + " "
                rdf_n3 += ".\n"
        else:
            request.session['rdf_array'] = ""

        if 'hidden_model' in form.cleaned_data:
            request.session['model'] = ast.literal_eval(form.cleaned_data['hidden_model'])

        if 'button_publish' in request.POST:
            print("PUBLISH BUTTON PRESSED")
            #print(rdf_n3)
            payload = {'title': request.POST.get('name_publish'), 'content': rdf_n3, 'format': 'text/rdf+n3'}
            #Please set the API_HOST in the settings file
            r = requests.post('http://' + API_HOST + '/api/datasource/create/', data=payload)
            j = json.loads(r.text)
            print(j["message"])
            publish_massage = j["message"]

        if 'button_download' in request.POST:
            new_fname = request.session['model']['file_name'].rsplit(".", 1)[0]+".n3"
            rdf_string = rdf_n3
            rdf_file = ContentFile(rdf_string.encode('utf-8'))
            response = HttpResponse(rdf_file, 'application/force-download')
            response['Content-Length'] = rdf_file.size
            response['Content-Disposition'] = 'attachment; filename="'+new_fname+'"'
            #print(rdf_n3)
            return response

        if 'button_r2rml' in request.POST:
            new_fname = request.session['model']['file_name'].rsplit(".", 1)[0]+"_R2RML.ttl"
            r2rml_string = transform2r2rml(request.session['model'])
            r2rml_file = ContentFile(r2rml_string.encode('utf-8'))
            response = HttpResponse(r2rml_file, 'application/force-download')
            response['Content-Length'] = r2rml_file.size
            response['Content-Disposition'] = 'attachment; filename="'+new_fname+'"'
            return response

    csv_rows_selected_columns = get_selected_rows_content(request.session)
    html_post_data = {
        'publish_massage': publish_massage,
        'action': form_action,
        'rdfModel': request.session['model'], 
        'csvContent': csv_rows_selected_columns,
        'filename': request.session['file_name'],
        'rdfArray': request.session['rdf_array'],
	    'rdfPrefix': request.session['rdf_prefix']
    }
    print("Model:")
    print(request.session['model'])
    return render(request, 'transformation/csv_publish.html', html_post_data)


def lookup(request, queryClass, queryString, callback):
    headers = {'Accept': 'application/json'}
    r = requests.get(
        'http://lookup.dbpedia.org/api/search/KeywordSearch?QueryClass=' + queryClass + '&QueryString=' + queryString,
        headers=headers)
    text = r.text
    results = json.loads(text)
    return callback + "(" + JsonResponse(results) + ");"


# ###############################################
#  OTHER FUNCTIONS
# ###############################################

# returns only the contents of the columns that were chosen in the html form from the session data
# for step 2 (column selection)
def get_selected_rows_content(session):
    result = []
    # write column numbers in array
    col_nums = []
    for col_num in session['selected_columns']:
        col_nums.append(col_num.get("col_num_orig"))

    for row in session['csv_rows']:
        tmp_row = []
        for cn in col_nums:
            tmp_row.append(row[cn - 1])
        result.append(tmp_row)
    return result

# marks selected columns directly in model
def mark_selected_rows_in_model(session):
    # write column numbers in array
    col_nums = []
    for col_num in session['selected_columns']:
        col_nums.append(col_num.get("col_num_orig"))
    session['model']['num_cols_selected'] = len(col_nums)
    counter = 1;
    for i, col in enumerate(session['model']['columns']):
        if col["col_num_orig"] in col_nums:
            col["col_num_new"] = counter
            counter = counter + 1
        else:
            col["col_num_new"] = -1





def process_csv(csvfile, form):
    '''
    Processes the CSV File and converts it to a 2dim array.
    Uses either the CSV Paramaters specified in the HTML form if those exist
    or the autodetected params instead.
    '''
    csv_dialect = {}
    csv_rows = []
    csvfile.seek(0)
    # Sniffer guesses CSV parameters / dialect
    # when error 'could not determine delimiter' -> raise bytes to sniff
    dialect = csv.Sniffer().sniff(csvfile.read(10240))
    csvfile.seek(0)
    # ['delimiter', 'doublequote', 'escapechar', 'lineterminator', 'quotechar', 'quoting', 'skipinitialspace']
    csv_dialect['delimiter'] = dialect.delimiter
    csv_dialect['escape'] = dialect.escapechar
    csv_dialect['quotechar'] = dialect.quotechar
    csv_dialect['line_end'] = dialect.lineterminator.replace('\r', 'cr').replace('\n', 'lf')

    # use csv params / dialect chosen by user if specified
    # to avoid '"delimiter" must be an 1-character string' error, I encoded to utf-8
    # http://stackoverflow.com/questions/11174790/convert-unicode-string-to-byte-string
    if form.cleaned_data['delimiter'] != "":
        dialect.delimiter = form.cleaned_data['delimiter']  #.encode('utf-8')
    if form.cleaned_data['escape'] != "":
        dialect.escapechar = form.cleaned_data['escape']  #.encode('utf-8')
    if form.cleaned_data['quotechar'] != "":
        dialect.quotechar = form.cleaned_data['quotechar']  #.encode('utf-8')
    if form.cleaned_data['line_end'] != "":
        dialect.lineterminator = form.cleaned_data['line_end']  #.encode('utf-8')

    csvreader = csv.reader(csvfile, dialect)



    for row in csvreader:
        csv_rows.append(row)

    #removal of blanks, especially special blanks \xA0 etc.
    for i,rowa in enumerate(csv_rows):
        for j,field in enumerate(rowa):
            csv_rows[i][j] = field.strip()

    return [csv_rows, csv_dialect]

def transform2r2rml(jsonmodel):
    #head = json.load(jsonmodel)

    subject = jsonmodel["subject"]
    columns = jsonmodel["columns"]
    ourprefix = "demo"
    subjtypes = []
    output = ""

    if "enrich" in jsonmodel:
        for enr in jsonmodel["enrich"]:
            subjtypes.append(enr["url"])

    output = "@prefix rr: <http://www.w3.org/ns/r2rml#>.\n" \
             "@prefix " + ourprefix + ": <" + subject["base_url"] + ">.\n\n" + ourprefix + ":TriplesMap a rr:TriplesMapClass;\n" \
                "\trr:logicalTable [ rr:tableName \"" + jsonmodel["file_name"] + "\" ];\n\n\trr:subjectMap [ rr:template \"" + \
             subject["base_url"] + subject["skeleton"] + "\""

    for sutp in subjtypes:
        output += ";\n\t\trr:class " + sutp

    output += "\n\t];  # of columns selected: " + str(jsonmodel["num_cols_selected"])

    for column in columns:
        if (column["col_num_new"] >= 0) and ("predicate" in column):
            predicate = column["predicate"]
            header = column["header"]
            output += ";\n\trr:predicateObjectMap [\n\t\trr:predicateMap [ rr:predicate " + predicate["url"] + " ];\n\t\t" \
                        "rr:ObjectMap [ rr:column \"" + header["orig_val"] + "\" ]\n\t]"

    output += "."

    return output
