jQuery(function () {
	var SUGGESTIONS_TIMEOUT = 7000;

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

			var editor_selector = '.ace_content';
			$(editor_selector).css('cursor', 'wait');
			setTimeout(function() {$(editor_selector).css('cursor', 'inherit')}, SUGGESTIONS_TIMEOUT);
			var in_vocabulary = '';
			var vocab_prefix = '';
			if (token.type == "sparql.prefix.constant.language") { //search classes or properties inside a vocabulary
				vocab_prefix = token.value;
				in_vocabulary += '&prefix=' + token.value.split(":")[0];
				token = editor.session.getTokenAt(pos.row, token.start - 1); //get the previous token
			}

			var val = token.value.toLowerCase()
			if (val == "prefix") { //suggest vocabularies
				$.ajax({
					dataType: "json",
					url: "/coreapi/recommend/?vocabulary=" + prefix,
					timeout: SUGGESTIONS_TIMEOUT,
					success: function(vocabularyList) {
						callback(null, vocabularyList.map(function(v) {
							$(editor_selector).css('cursor', 'inherit');
							return {caption: v.vocabulary, name: v.vocabulary, value: v.prefix + ": <" + v.uri + ">\n", score: v.ranking, meta: "Vocabulary"}
						}))
					}
				});
			}
			else if (val == "service") { //suggest services
				$.ajax({
					dataType: "json",
					url: "/api/datasources/",
					timeout: SUGGESTIONS_TIMEOUT,
					success: function(datasourceList) {
						callback(null, datasourceList.map(function(d) {
							var tp = "Public endpoint";
							if (!d.public) {
								tp = "Private RDF";
							}

							$(editor_selector).css('cursor', 'inherit');
							return {caption: d.title, name: d.title, value: "<" + d.endpoint + "> { ", score: 0, meta: tp}
						}))
					}
				});
			}
			else if ((val == "a") || (val == "type")) { //suggest classes
		        if (in_vocabulary == "") { //look inside the data source
					$.ajax({
						dataType: "json",
						url: "/query-designer/api/active_classes/" + $("#datasource-select").val() + '/?q=' + editor.session.getTokenAt(pos.row, pos.column).value,
						timeout: SUGGESTIONS_TIMEOUT,
						success: function(classList) {
							callback(null, classList.results.bindings.map(function(c) {
								var label = uri_to_label(c.Concept.value);

								$(editor_selector).css('cursor', 'inherit');
								return {caption: label, name: label, value: '<' + c.Concept.value + '> ', score: 1000-label.length, meta: $("#datasource-select option:selected").text()}
							}))
						}
                    });
                } else {
                    $.ajax({ //ask the vocabulary repository
						dataType: "json",
                        url: "/coreapi/recommend/?class=" + prefix + in_vocabulary,
                        timeout: SUGGESTIONS_TIMEOUT,
                        success: function(classList) {
                            callback(null, classList.map(function(c) {
                            	$(editor_selector).css('cursor', 'inherit');
                                return {caption: c.label, name: c.label, value: c.uri + ' ', score: c.ranking, meta: c.vocabulary}
							}))
						}
					});
                }
			} else if ((token.type == "sparql.variable") || (token.type == "sparql.constant.uri")) { //suggest properties
			    if (in_vocabulary == "") { //look inside the data source
                    $.ajax({
						dataType: "json",
                        url: "/query-designer/api/active_properties/" + $("#datasource-select").val() + '/?q=' + editor.session.getTokenAt(pos.row, pos.column).value,
                    	timeout: SUGGESTIONS_TIMEOUT,
                    	success: function(propertyList) {
							callback(null, propertyList.results.bindings.map(function(c) {
								var label = uri_to_label(c.property.value);
								$(editor_selector).css('cursor', 'inherit');
								return {caption: label, name: label, value: '<' + c.property.value + '> ', score: 1000-label.length, meta: $("#datasource-select option:selected").text()}
							}))
						}
					});
			    } else { //ask the vocabulary repository
                    $.ajax({
						dataType: "json",
                        url: "/coreapi/recommend/?property=" + prefix + in_vocabulary,
                    	timeout: SUGGESTIONS_TIMEOUT,
                    	success: function(propertyList) {
                        	callback(null, propertyList.map(function(p) {
								$(editor_selector).css('cursor', 'inherit');
								return {caption: p.label, name: p.label, value: p.uri + ' ', score: p.ranking, meta: p.vocabulary}
							}))
						}
					});
				}
			} else if (in_vocabulary != "") {
            	$.ajax({
					dataType: "json",
                    url: "/coreapi/recommend/?class_property=" + prefix + in_vocabulary,
					timeout: SUGGESTIONS_TIMEOUT,
					success: function(propertyList) {
						callback(null, propertyList.map(function(p) {
							$(editor_selector).css('cursor', 'inherit');
							return {caption: p.label, name: p.label, value: p.uri + ' ', score: p.ranking, meta: p.vocabulary}
						}))
					}
				});
			}
		}
	}
	langTools.addCompleter(SparQLCompleter);

	/*F9 to run query*/
	$("body").on('keyup', function(e) {
    	if (e.keyCode == 120) { //F9 key pressed
        	execute_sparql_query();

			e.preventDefault();
			e.stopPropagation();
        }
    });

    /*Ctrl+S to save query*/
	document.addEventListener("keydown", function(e) {
    	if (e.keyCode == 83 && e.ctrlKey) { //Ctrl+S key pressed
        	if (typeof(builder_workbench) === "undefined") {
        		save_query();
        	} else {
        		save_design();
        	}

			e.preventDefault();
			e.stopPropagation();
        }
    }, false);
});

