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
							return {caption: v.vocabulary, name: v.vocabulary, value: v.prefix + ": <" + v.uri + ">\n", score: v.ranking, meta: "Vocabulary", snippet: "this is the snippet"}
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

    /*Check if autocomplete selection has changed*/
    setInterval(function() {
    	var prev = editor.autocomplete_selection;
    	var res = $('.ace_autocomplete .ace_text-layer .ace_line.ace_selected');
    	editor.autocomplete_selection = undefined;
    	if (res.length > 0) {
    		if (editor.completer.completions) {
    			editor.autocomplete_selection_index = $(res[0]).index();
    			editor.autocomplete_selection = editor.completer.completions.filtered[editor.autocomplete_selection_index];
			}
		}

		if (prev != editor.autocomplete_selection) { //selection changed
			$('.autocomplete-tooltip').remove(); //remove prev tooltip
			if (editor.autocomplete_selection) {
				var a = editor.autocomplete_selection;

				$('body').append('<div class="autocomplete-tooltip"><h3>' + a.name + '</h3><span class="loading"></span></div>');
				$('.autocomplete-tooltip').css('left', $('.ace_autocomplete').offset().left + $('.ace_autocomplete').width() + 5);
				$('.autocomplete-tooltip').css('top', $('.ace_autocomplete').offset().top + editor.autocomplete_selection_index*16);

				var info = "No info found";
				var callback = function(data) {
					info = data;
					$('.autocomplete-tooltip span.loading').remove();
					console.log(info);
					$('.autocomplete-tooltip').append(info);

					//apply formatting
					var pre_list = $('.autocomplete-tooltip pre');
					for (var i=0; i<pre_list.length; i++) {
						var text = $(pre_list[i]).text();
						$(pre_list[i]).text(decodeURIComponent(text));
					}
				};

				if (a.meta == "SPARQL Core") { //core
					info = $.ajax({url: 'http://localhost:8000/query-designer/docs/sparql/' + a.value + '/'}).then(callback);
				}
			}
		}
    }, 1000);
});

