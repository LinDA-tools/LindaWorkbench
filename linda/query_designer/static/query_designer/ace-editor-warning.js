    jQuery(function () {
        editor.getSession().on('change', function() {
			if ((!builder.is_editing) && (editor.getSession().getValue() != builder.query)) { // changed by human
				editor.changed = true;
				$("#sparql-editor-warning-message > .ui-state-error").html('<p><span class="ui-icon ui-icon-alert"></span><strong>Warning:</strong> Changes in the query will not be saved, and will be dropped when you change the design. You can edit the query manually in the SPARQL Editor.</p>');
			} else { //
				editor.changed = false;
				$("#sparql-editor-warning-message > .ui-state-error").html('');
			}
		});
    });