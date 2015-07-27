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

	//add autocompletion
	ace.config.loadModule("ace/ext/language_tools", function() {
		editor.setOptions({
			enableSnippets: true,
			enableBasicAutocompletion: true
		});
	});

	var SparQLCompleter = {
		getCompletions: function(editor, session, pos, prefix, callback) {
			var token = editor.session.getTokenAt(pos.row, pos.column - prefix.length - 1);  //get previous token
			if (!token) {
				return;
			}

			editor.recommendation = "";
			editor.recommendation_from = "";

			var editor_selector = '.ace_content';
			setTimeout(function() {$(editor_selector).css('cursor', 'inherit')}, SUGGESTIONS_TIMEOUT);
			var in_vocabulary = '';
			var vocab_prefix = '';
			if (token.type == "sparql.prefix.constant.language") { //search classes or properties inside a vocabulary
				vocab_prefix = token.value;
				in_vocabulary += '&prefix=' + token.value.split(":")[0];
				token = editor.session.getTokenAt(pos.row, token.start - 1); //get the previous token
			}

			var val = token.value.toLowerCase();
			if (val == "prefix") { //suggest vocabularies
				$(editor_selector).css('cursor', 'wait');
				editor.recommendation = 'vocabulary';
				$.ajax({
					dataType: "json",
					url: "/coreapi/recommend/?vocabulary=" + prefix,
					timeout: SUGGESTIONS_TIMEOUT,
					success: function(vocabularyList) {
						callback(null, vocabularyList.map(function(v) {
							$(editor_selector).css('cursor', 'inherit');
							return {caption: v.vocabulary, name: v.vocabulary, value: v.prefix + ": <" + v.uri + ">\n", score: Math.max(v.ranking, 1), meta: "Vocabulary", full_uri: v.uri}
						}))
					}
				});
			}
			else if (val == "service") { //suggest services
				$(editor_selector).css('cursor', 'wait');
				editor.recommendation = 'service';
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
							return {caption: d.title, name: d.title, value: "<" + d.endpoint + "> { ", score: 1, meta: tp}
						}))
					}
				});
			}
			else if ((val == "a") || (val == "type")) { //suggest classes
		        if (in_vocabulary == "") { //look inside the data source
		        	var dt_name = $("#datasource-select").val();
		        	if (dt_name !== "") { // in a datasource
		        		dt_name = encodeURIComponent(datasource_endpoints[dt_name]);
						$(editor_selector).css('cursor', 'wait');
						editor.recommendation = 'active-classes';

						editor.recommendation_from = dt_name;

						var val =  editor.session.getTokenAt(pos.row, pos.column).value;
						var url = "/query-designer/api/active_classes/" + dt_name + '/?q=' + val;
						if (val == "") {
							url += '&distinct=True';
						}
						$.ajax({
							dataType: "json",
							url: url,
							timeout: SUGGESTIONS_TIMEOUT,
							success: function(classList) {
								callback(null, classList.results.bindings.map(function(c) {
									var label = uri_to_label(c.Concept.value);

									$(editor_selector).css('cursor', 'inherit');
									return {caption: label, name: label, value: '<' + c.Concept.value + '> ', score: 1000-label.length, meta: $("#datasource-select option:selected").text(), full_uri: c.Concept.value}
								}))
							}
						});
					}
                } else {
                	$(editor_selector).css('cursor', 'wait');
                	editor.recommendation = 'classes';
                	editor.recommendation_from = in_vocabulary.split('=')[1];
                    $.ajax({ //ask the vocabulary repository
						dataType: "json",
                        url: "/coreapi/recommend/?class=" + prefix + in_vocabulary,
                        timeout: SUGGESTIONS_TIMEOUT,
                        success: function(classList) {
                            callback(null, classList.map(function(c) {
                            	$(editor_selector).css('cursor', 'inherit');
                                return {caption: c.label, name: c.label, value: c.uri + ' ', score: Math.max(c.ranking, 1), meta: c.vocabulary, full_uri: c.full_uri}
							}))
						}
					});
                }
			} else if ((token.type == "sparql.variable") || (token.type == "sparql.constant.uri")) { //suggest properties
			    if (in_vocabulary == "") { //look inside the data source
			    	var dt_name = $("#datasource-select").val();
					if (dt_name !== "") { // in a datasource
						dt_name = encodeURIComponent(datasource_endpoints[dt_name]);
						$(editor_selector).css('cursor', 'wait');
						editor.recommendation = 'active-properties';
						editor.recommendation_from = dt_name;
						$.ajax({
							dataType: "json",
							url: "/query-designer/api/active_properties/" + dt_name + '/?q=' + editor.session.getTokenAt(pos.row, pos.column).value,
							timeout: SUGGESTIONS_TIMEOUT,
							success: function(propertyList) {
								callback(null, propertyList.results.bindings.map(function(c) {
									var label = uri_to_label(c.property.value);
									$(editor_selector).css('cursor', 'inherit');
									return {caption: label, name: label, value: '<' + c.property.value + '> ', score: 1000-label.length, meta: $("#datasource-select option:selected").text(), full_uri: c.property.value}
								}))
							}
						});
					}
			    } else { //ask the vocabulary repository
			    	$(editor_selector).css('cursor', 'wait');
			    	editor.recommendation = 'properties';
                	editor.recommendation_from = in_vocabulary.split('=')[1];
                    $.ajax({
						dataType: "json",
                        url: "/coreapi/recommend/?property=" + prefix + in_vocabulary,
                    	timeout: SUGGESTIONS_TIMEOUT,
                    	success: function(propertyList) {
                        	callback(null, propertyList.map(function(p) {
								$(editor_selector).css('cursor', 'inherit');
								return {caption: p.label, name: p.label, value: p.uri + ' ', score: Math.max(p.ranking, 1), meta: p.vocabulary, full_uri: p.full_uri}
							}))
						}
					});
				}
			} else if (in_vocabulary != "") {
				$(editor_selector).css('cursor', 'wait');
				editor.recommendation = 'class-property';
				editor.recommendation_from = in_vocabulary.split('=')[1];
            	$.ajax({
					dataType: "json",
                    url: "/coreapi/recommend/?class_property=" + prefix + in_vocabulary,
					timeout: SUGGESTIONS_TIMEOUT,
					success: function(propertyList) {
						callback(null, propertyList.map(function(p) {
							$(editor_selector).css('cursor', 'inherit');
							return {caption: p.label, name: p.label, value: p.uri + ' ', score: Math.max(p.ranking, 1), meta: p.vocabulary, full_uri: p.full_uri}
						}))
					}
				});
			}
		}
	};
	langTools.addCompleter(SparQLCompleter);

	/*F9 to run query*/
	$("body").on('keyup', function(e) {
    	if (e.keyCode == 120) { //F9 key pressed
    		if ($(".designer-button.run-button").length > 0) {
    			$(".designer-button.run-button").click();
    		} else {
    			execute_sparql_query();
    		}
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
    function watch_autocomplete() {
    	if (typeof(editor.completer) === "undefined") {
    		return;
    	}

    	var prev = editor.autocomplete_selection;
    	var res = editor.completer.popup.getRow();
    	editor.autocomplete_selection = undefined;
    	if (res >= 0) {
    		if (editor.completer.completions) {
    			editor.autocomplete_selection_index = res;
    			editor.autocomplete_selection = editor.completer.completions.filtered[res];
			}
		}

		if (prev !== editor.autocomplete_selection) { //selection changed
			$('.autocomplete-tooltip').remove(); //remove prev tooltip
			if (editor.autocomplete_selection) {
				var a = editor.autocomplete_selection;

				var title = a.name || a.caption || a.value;
				$('body').append('<div class="autocomplete-tooltip"><h3>' + title + '</h3><div class="content"><span class="loading"></span></div></div>');
				$('.autocomplete-tooltip').css('left', $('.ace_autocomplete').offset().left - $(document).scrollLeft() + $('.ace_autocomplete').width() + 5);
				$('.autocomplete-tooltip').css('top', $('.ace_autocomplete').offset().top - $(document).scrollTop() + editor.autocomplete_selection_index*16);

				var info = "<p>No info found.</p>";
				var callback = function(data) {
					//check if selection has changed
					var a = editor.autocomplete_selection;
					var new_title = a.name || a.caption || a.value;
					if (title != new_title) return;

					info = data;
					$('.autocomplete-tooltip > .content').html(info);

					//apply formatting
					var pre_list = $('.autocomplete-tooltip pre');
					for (var i=0; i<pre_list.length; i++) {
						var text = $(pre_list[i]).text();
						$(pre_list[i]).text(decodeURIComponent(text));
					}
				};

				var info_url = '';
				if (a.meta == "local") { //local variables
					$('.autocomplete-tooltip > .content').html('<p>Local term.</p>');
				}
				else { //everything else
					if (a.meta == "SPARQL Core") { //core
						info_url = '/query-designer/docs/sparql/' + a.value + '/'
					} else {
						info_url = '/query-designer/docs/' + editor.recommendation + '/';
						if (editor.recommendation_from !== "") {
							info_url += encodeURIComponent(editor.recommendation_from) + '/'
						}
						info_url += '?q=' + encodeURIComponent(editor.autocomplete_selection.full_uri);
					}

					//get the info from server
					info = $.ajax({url: info_url}).then(callback, function() {
						$('.autocomplete-tooltip > .content').append('<p>No info found.</p>');
					});
				}
			}
		}
    }

	/* watch body for changes */
	$("body")[0].addEventListener('DOMNodeInserted', function() {
		var res = $('.ace_autocomplete');
		if ((res.length > 0 && res.css('display') != "none") && (typeof(editor.selection.watch) === "undefined")) {
		editor.selection.watch = setInterval(watch_autocomplete, 500);
		}
		else if ((res.length == 0 || res.css('display') == "none") && (typeof(editor.selection.watch) !== "undefined")) {
		clearInterval(editor.selection.watch);
		editor.selection.watch = undefined;
		watch_autocomplete();
		}
	}, false);
});

