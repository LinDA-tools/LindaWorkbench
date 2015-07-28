from django import template

register = template.Library()

#swaps file ending in filename for .n3
@register.filter(name='n3')
def n3(filename):
	return filename.rsplit(".", 1)[0]+".n3"

@register.filter(name='model_as_table')
def model_as_table(model, numrows=-1):
	result =  '<table class="table_view">'
	result += model_header_as_table(model)
	result += model_content_as_table(model, numrows)
	result += '</table>'
	return result

@register.filter(name='model_as_table_predicate')
def model_as_table_predicate(model, numrows=-1):
	result =  '<table class="table_view">'
	result += model_header_as_table_predicate(model)
	result += model_content_as_table(model, numrows)
	result += '</table>'
	return result

@register.filter(name='model_as_table_object')
def model_as_table_object(model, numrows=-1):
	result =  '<table class="table_view">'
	result += model_header_as_table_object(model)
	result += model_content_as_table(model, numrows)
	result += '</table>'
	return result

@register.filter(name='model_as_thead')
def model_header_as_table(model):
	num_rows = model['num_cols_selected']
	headers = []
	for col in model['columns']:
		if col['col_num_new'] > -1: #show column
			headers.append(col['header']['orig_val'])

	result = "<thead>"	
	result += "<tr>"

	for i, field in enumerate(headers):
		result += '<td id="id_table_head_' +str(i+1)+ '">'
		result += field
		result += "</td>"

	result += "</tr>"
	result += "</thead>"

	return result

@register.filter(name='model_as_tbody')
def model_content_as_table(model, numrows=-1):
	num_rows = model['num_cols_selected']
	content = []
	for col in model['columns']:
		if col['col_num_new'] > -1: #show column
			row = []
			if numrows != -1:
				fields = col['fields'][:numrows]
			else:
				fields = col['fields']

			for elem in fields:
				row.append(elem['orig_val'])
			content.append(row)

	print(content)
	content = list(zip(*content))
	print(content)

	result = "<tbody>"
	
	for i, row in enumerate(content):
		result += "<tr>"
		for j, field in enumerate(row):
			result += '<td id="id_table_field_' +str(j+1)+ '_' +str(i+1)+ '">'
			result += '<span>'+field+'</span>'
			result += "</td>"
		result += "</tr>"

	result += "</tbody>"

	return result


@register.filter(name='model_as_thead_predicate')
def model_header_as_table_predicate(model):
	num_rows = model['num_cols_selected']
	headers = []
	for col in model['columns']:
		if col['col_num_new'] > -1: #show column
			headers.append(col['header']['orig_val'])

	result = "<thead>"

	result += "<tr>"
	for i, field in enumerate(headers):
		result += '<td id="id_table_head_' +str(i+1)+ '">'
		result += field
		result += "</td>"
	result += "</tr>"

	result += "<tr>"
	for i, field in enumerate(headers):
		result += '<td>'
		result += '<input type="text" value="'+field+'" id="search_textinput_'+str(i+1)+'" onkeyup="delayedOracleCall('+str(i+1)+')" autocomplete="off">'
		result += '<i id="icon_'+str(i+1)+'" class="fa fa-search" onclick="askOracle('+str(i+1)+')"></i>'
		result += '<br><div id="result_area_'+str(i+1)+'">'
		result += '<div class="bb_select" id="search_result_'+str(i+1)+'">'
		result += '</div></div>'
		result += '</td>'
	result += "</tr>"

	result += "</thead>"

	return result

@register.filter(name='model_as_thead_object')
def model_header_as_table_object(model):
	num_rows = model['num_cols_selected']
	headers = []
	for col in model['columns']:
		if col['col_num_new'] > -1: #show column
			headers.append(col['header']['orig_val'])

	result = "<thead>"

	result += "<tr>"
	for i, field in enumerate(headers):
		result += '<td id="id_table_settings_'+str(i+1)+'">'
		result += '<select>'
		result += '<option>no action</option>'
		result += '<option>add URIs</option>'
		result += '<option>add data type</option>'
		result += '</select>'
		result += '</td>'
	result += "</tr>"

	result += "<tr>"
	for i, field in enumerate(headers):
		result += '<td id="id_table_head_' +str(i+1)+ '">'
		result += field
		result += "</td>"
	result += "</tr>"


	result += "</thead>"

	return result


	