$(function() {
    $("#property-filters").dialog({
        autoOpen: false,
        width: 600
    });
    $("#property-filters").show();

    //initially hide all categories
    $(".filter-type").hide();
    //hide custom prototype text
    $("#filter-prototype-str").hide();
});

/*On filter prototype change*/
$(".filter-prototype select").change(function() {
    var val = $(this).val();

    if (val == "custom" ) {
        $("#filter-prototype-str").show();
    } else {
        $("#filter-prototype-str").hide();
    }
});

/*On data type change*/
$("#property-filters .select-filter-type select").change(function() {
    var val = $(this).val();

    if (val == "str")
        $("#property-filters .filter-type-str").show();
    else
        $("#property-filters .filter-type-str").hide();

    if (val == "num")
        $("#property-filters .filter-type-num").show();
    else
        $("#property-filters .filter-type-num").hide();

    if (val == "date")
        $("#property-filters .filter-type-date").show();
    else
        $("#property-filters .filter-type-date").hide();

    if (val == "value")
        $("#property-filters .filter-type-value").show();
    else
        $("#property-filters .filter-type-value").hide();
});

/*String filter change*/
$("#property-filters .filter-type-str select").change(function() {
    if ($(this).val() == "language") {
        $("#property-filters .filter-type-str .control-case-sensitive").hide();
    } else {
        $("#property-filters .filter-type-str .control-case-sensitive").show();
    }
});

function show_filters() {
    $("#property-filters").dialog("open");
    $("#all-filters").html('');

    if (builder_workbench.property_selection) {
        var p = builder_workbench.property_selection;
        var cnt = 0;

        //set dialog title
        $("#ui-id-1").html(uri_to_label(builder_workbench.instances[builder_workbench.property_selection_of_instance].uri) + '.' + uri_to_label(p.uri));

        //show current filters
        $("#all-filters").html('');
        for (var i=0; i<p.filters.length; i++) {
            if (p.filters[i] == undefined) continue;

            cnt++;
            $("#all-filters").append('<div class="filter-object">' + p.filters[i].operator_label + ' ' +p.filters[i].value + '<span class="filter-id">[' + i + ']</span><span class="filter-remove" data-about="' + i + '">x</span></div>');
        }

        if (cnt == 0) {
            $("#all-filters").html('No filters applied.');
        } else if (p.filter_prototype) { //restore filter type
            if ((p.filter_prototype.indexOf("&&") < 0) && (p.filter_prototype.indexOf("||") < 0) && (p.filter_prototype.indexOf("!") < 0)) { //no operator -- default to AND
                $(".filter-prototype select").val('and');
                $("#filter-prototype-str").hide();
            }
            else if ((p.filter_prototype.indexOf("&&") >= 0) && (p.filter_prototype.indexOf("||") < 0) && (p.filter_prototype.indexOf("!") < 0)) { //AND join filters
                $(".filter-prototype select").val('and');
                $("#filter-prototype-str").hide();
            }
            else if ((p.filter_prototype.indexOf("&&") < 0) && (p.filter_prototype.indexOf("||") >= 0) && (p.filter_prototype.indexOf("!") < 0)) { //OR join filters
                $(".filter-prototype select").val('or');
                $("#filter-prototype-str").hide();
            } else { //CUSTOM join filter boolean expression
                $(".filter-prototype select").val('custom');
                $("#filter-prototype-str").val(p.filter_prototype);
                $("#filter-prototype-str").show();
            }
        }

        /*Find specific value autocomplete*/
        if (builder_workbench.property_selection.uri == "URI") {
            $(".filter-type-value input").autocomplete({
                source: "/query-designer/api/suggest/" + builder_workbench.instances[builder_workbench.property_selection_of_instance].dt_name + "/?class_uri=" +
                                                 encodeURIComponent(builder_workbench.instances[builder_workbench.property_selection_of_instance].uri),
            });
        } else {
         $(".filter-type-value input").autocomplete({
                source: "/query-designer/api/suggest/" + builder_workbench.instances[builder_workbench.property_selection_of_instance].dt_name + "/?class_uri=" +
                                                 encodeURIComponent(builder_workbench.instances[builder_workbench.property_selection_of_instance].uri) +
                                                 "&property_uri=" + encodeURIComponent(builder_workbench.property_selection.uri),
            });
        }
    }
}

/* On add a filter click*/
$(".add-filter").click(function() {
    //create the new filter object
    var nf = {};
    nf.type = $("#property-filters .select-filter-type select").val();
    nf.operator = $(".filter-type-" + nf.type + " select").val();
    nf.operator_label = $(".filter-type-" + nf.type + " select option:selected").text();
    nf.value = $(".filter-type-" + nf.type + " input").val();
    if (nf.type == "str") {
        nf.case_sensitive = $("#case-sensitive").is(':checked');
    }

    //save the new filter and refresh
    builder_workbench.property_selection.filters.push(nf);
    show_filters();
});

/* on done with filters click */
$(".done").click(function() {
    var n = 0;
    var p = builder_workbench.property_selection;
    var f_proto_val = $(".filter-prototype select").val();
    var proto = "";

    if ((f_proto_val == "and") || (f_proto_val == "or")) { //automatically create the prototype
        for (var f=0; f<p.filters.length; f++) {
            if (p.filters[f] == undefined) continue;

            n++;
            proto += '[' + f + ']';
            if (f < p.filters.length - 1) {
                if (f_proto_val == "and") {
                    proto += ' && ';
                } else {
                    proto += ' || ';
                }
            }
        }
    } else { //get prototype from user
        proto = $("#filter-prototype-str").val();

        for (var f=0; f<p.filters.length; f++) {
            if (p.filters[f] == undefined) continue;
            n++;
        }
    }

    p.filter_prototype = proto;
    $("#property-filters").dialog("close");

    //add icon to show which properties have filters
    if (n>0) {
        $('#class_instance_' + builder_workbench.property_selection_of_instance + ' .property-row:nth-of-type(' + (builder_workbench.property_selection.n+2) + ') span:nth-of-type(5)').html('<span class="ui-icon ui-icon-check"></span>Edit');
    } else {
        $('#class_instance_' + builder_workbench.property_selection_of_instance + ' .property-row:nth-of-type(' + (builder_workbench.property_selection.n+2) + ') span:nth-of-type(5)').html('Edit');
    }

    //reset the query
    builder.reset();
});

/*On filter remove click*/
$("body").on('click', '.filter-remove', function() {
    var f = $(this).data('about');
    builder_workbench.property_selection.filters[f] = undefined;
    show_filters();
});
