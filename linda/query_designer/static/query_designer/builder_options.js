function BuilderOptions(b) {
    this.builder = b;
    this.limit = undefined;
    this.distinct = false;
    this.pattern = "";
    this.variables = [];
    this.materialization = {
        materialize: false,
        period: undefined
    };

    //change order
    this.reorder = function(new_var, old_var, is_before) {
        var v = this.variables;

        //remove the variable
        v.splice(v.indexOf(new_var), 1);

        //insert at the appropriate position
        if (is_before) {
            var offset = -1;
        } else {
            var offset = 0;
        }

        v.splice(v.indexOf(old_var) + offset, 0, new_var);
    };

    //order the select variables
    this.order_select = function() {
        var result = [];

        //remove duplicates from select
        this.builder.select_vars = $.unique(this.builder.select_vars);

        //insert all variables in the suggestion if they where found in the select
        if (typeof(this.variables) != "undefined") {
            for (var i=0; i<this.variables.length; i++) {
                if (this.builder.select_vars.indexOf(this.variables[i]) >= 0) {
                    result.push(this.variables[i]);
                }
            }
        }

        //additionally insert all from select
        for (var i=0; i<this.builder.select_vars.length; i++) {
            result.push(this.builder.select_vars[i]);
        }

        //remove duplicates & save
        this.select_vars = $.unique(result);
    }
}

$(function() {
    $("#builder-options").dialog({
        autoOpen: false,
        width: 600
    });
    $("#builder-options").show();

    //set dialog title
    $("#ui-id-2").html("Query Options");

    //make variables sortable
    $("#query_variables").sortable();
});

//change query options
$("#show-query-options").on('click', function() {
    var o = builder.options;

    //load variables
    $("#query_variables").html('');
    for (var i=0; i<builder.select_vars.length; i++) { //add newly added variables
        $("#query_variables").append('<div class="button variable">' + builder.select_vars[i] + '</div>');
    }

    //load options
    $("#query_pattern").val(o.pattern);
    $("#query_limit").val(o.limit);
    if (o.distinct) {
        $("#query_distinct").prop('checked', true);
    }

    //show dialog
    $("#builder-options").dialog("open");
});

//save new options
$("#query-options-done").on('click', function() {
    var o = builder.options;

    //get variables order
    o.variables = [];
    var variable_buttons = $("#query_variables .variable");
    for (var i=0; i<variable_buttons.length; i++) {
        o.variables.push($(variable_buttons[i]).html());
    }

    //get limit
    var l = $("#query_limit").val();
    if (l == "") {
        o.limit = undefined;
    } else {
        o.limit = Number(l);
    }

    //get distinct
    o.distinct = $("#query_distinct").is(':checked');

    //get pattern
    o.pattern = $("#query_pattern").val().toUpperCase();

    //close the dialog
    $("#builder-options").dialog("close");

    //reset the query
    builder.reset();
});