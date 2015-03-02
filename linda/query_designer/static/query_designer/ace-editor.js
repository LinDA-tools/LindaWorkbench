jQuery(function () {
	//auto-completion module
	var langTools = ace.require("ace/ext/language_tools");

	//initial editor configuration
	editor = ace.edit("txt_sparql_query");
	editor.setTheme("ace/theme/monokai");
	editor.setShowPrintMargin(false);
	editor.getSession().setUseWrapMode(true);
	editor.$blockScrolling = Infinity;

	var SparqlMode = require("ace/mode/sparql").Mode;
	editor.getSession().setMode(new SparqlMode());

	ace.config.loadModule("ace/ext/language_tools", function() {
		editor.setOptions({
			enableSnippets: true,
			enableBasicAutocompletion: true
		});
	});

	//add autocomplete for prefixes
	var SparQLCompleter = {
		getCompletions: function(editor, session, pos, prefix, callback) {
			var token = editor.session.getTokenAt(pos.row, pos.column - prefix.length - 1);  //get previous token

			if (!token) {
				return;
			}

			var in_vocabulary = '';
			var vocab_prefix = '';
			if (token.type == "sparql.prefix.constant.language") { //search classes or properties inside a vocabulary
				vocab_prefix = token.value;
				in_vocabulary += '&prefix=' + token.value.split(":")[0];
				token = editor.session.getTokenAt(pos.row, token.start - 1); //get the previous token
			}

			var val = token.value.toLowerCase()
			if (val == "prefix") { //suggest vocabularies
				$.getJSON(
				"/coreapi/recommend/?vocabulary=" + prefix,
				function(vocabularyList) {
					callback(null, vocabularyList.map(function(v) {
						return {caption: v.vocabulary, name: v.vocabulary, value: v.prefix + ": <" + v.uri + ">\n", score: v.ranking, meta: "Vocabulary"}
					}));
				})
			}
			else if (val == "service") { //suggest services
				$.getJSON(
				"/api/datasources/",
				function(datasourceList) {
					callback(null, datasourceList.map(function(d) {
						var tp = "Public endpoint";
						if (!d.public) {
							tp = "Private RDF";
						}
						return {caption: d.title, name: d.title, value: "<" + d.endpoint + "> { ", score: 0, meta: tp}
					}));
				})
			}
			else if ((val == "a") || (val == "type")) { //suggest classes
		        if (in_vocabulary == "") { //look inside the data source
                    $.getJSON(
                    "/query-designer/api/active_classes/" + $("#datasource-select").val() + '/?q=' + editor.session.getTokenAt(pos.row, pos.column).value,
                    function(classList) {
                        callback(null, classList.results.bindings.map(function(c) {
                            var label = uri_to_label(c.Concept.value);
                            return {caption: label, name: label, value: '<' + c.Concept.value + '> ', score: 1000-label.length, meta: $("#datasource-select option:selected").text()}
                        }));
                    });
                } else {
                    $.getJSON( //ask the vocabulary repository
                        "/coreapi/recommend/?class=" + prefix + in_vocabulary,
                        function(classList) {
                            callback(null, classList.map(function(c) {
                                return {caption: c.label, name: c.label, value: c.uri + ' ', score: c.ranking, meta: c.vocabulary}
                            }));
                    });
                }
			} else if ((token.type == "sparql.variable") || (token.type == "sparql.constant.uri")) { //suggest properties
			    if (in_vocabulary == "") { //look inside the data source
			        $.getJSON(
                    "/query-designer/api/active_properties/" + $("#datasource-select").val() + '/?q=' + editor.session.getTokenAt(pos.row, pos.column).value,
                    function(propertyList) {
                        callback(null, propertyList.results.bindings.map(function(c) {
                            var label = uri_to_label(c.property.value);
                            return {caption: label, name: label, value: '<' + c.property.value + '> ', score: 1000-label.length, meta: $("#datasource-select option:selected").text()}
                        }));
                    });
			    } else { //ask the vocabulary repository
                    $.getJSON(
                    "/coreapi/recommend/?property=" + prefix + in_vocabulary,
                    function(propertyList) {
                        callback(null, propertyList.map(function(p) {
                            return {caption: p.label, name: p.label, value: p.uri + ' ', score: p.ranking, meta: p.vocabulary}
                        }));
                    });
                }
			} else if (in_vocabulary != "") {
				$.getJSON(
				"/coreapi/recommend/?class_property=" + prefix + in_vocabulary,
				function(propertyList) {
					callback(null, propertyList.map(function(p) {
						return {caption: p.label, name: p.label, value: p.uri + ' ', score: p.ranking, meta: p.vocabulary}
					}));
				})
			}
		}
	}
	langTools.addCompleter(SparQLCompleter);

	if (typeof(builder_workbench) !== 'undefined') {
		editor.getSession().on('change', function() {
			if ((!builder.is_editing) && (editor.getSession().getValue() != builder.query)) { // changed by human
				editor.changed = true;
				$("#sparql-editor-warning-message > .ui-state-error").html('<p><span class="ui-icon ui-icon-alert"></span><strong>Warning:</strong> Changes in the query will not be saved, and will be dropped when you change the design. You can edit the query manually in the SPARQL Editor.</p>');
			} else { //
				editor.changed = false;
				$("#sparql-editor-warning-message > .ui-state-error").html('');
			}
		});
	}
});