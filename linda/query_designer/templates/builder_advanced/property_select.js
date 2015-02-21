function property_select(instance) {
    this.c = instance;
    this.properties = [];
    this.page = undefined;
    this.started_loading = false;
    this.finished_loading = false;
    this.PROPERTY_PAGE_LIMIT = 200;
    this.SELECT_SIZE = 25;
    this.offset = 0;

    this.load = function(p) { // load the current page of properties
        var that = this;
        var c = this.c;

        if (this.to_stop) {
            return;
        }

        $.ajax({  //make an ajax request to get properties
            url: ADVANCED_BUILDER_API_URI + "active_class_properties/" +  c.dt_name + "?class_uri=" + encodeURIComponent(c.uri) + '&order=true&page=' + p,
            type: "GET",
            success: function(data, textStatus, jqXHR) {
                if (!c || that.to_stop) { //the instance was deleted in the mean time
                    return;
                }

                that.started_loading = true;

                var bindings = data.results.bindings;
                for (var i=0; i<bindings.length; i++) { //add the properties
                    that.properties.push({'uri': bindings[i].property.value, 'frequence': Number(bindings[i].cnt.value).toLocaleString()});
                }

                $("#class_instance_" + that.c.id + " .property-control .properties-found").html(Number(that.properties.length).toLocaleString() + ' properties found');

                if (bindings.length == that.PROPERTY_PAGE_LIMIT) { //load next page
                    that.load(p+1);
                } else {
                    that.finished_loading = true;
                }

                if (!that.page) { //initial page of select
                    that.set_page(1);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus + ': ' + errorThrown);
                if (builder_workbench.instances[that.c.id].property_select.properties.length == 0) {
                    $("#class_instance_" + that.c.id + " .dropdown-toggle-properties > span").removeClass("loading");
                    $("#class_instance_" + that.c.id + " .dropdown-toggle-properties > span").addClass("error");
                    $("#class_instance_" + that.c.id + " .dropdown-toggle-properties > span").html('X');
                    $("#class_instance_" + that.c.id + " .property-control .properties-found").html('Could not load properties');
                }
            }
        });
    }

    this.stop = function() {
        this.to_stop = true;
    };

    this.show = function() {
        var filter = $("#class_instance_" + this.c.id + " .property-control input").val();
        var added = 0;
        var total = 0;
        var limit = this.SELECT_SIZE;
        var offset = (this.page-1)*limit;
        $("#class_instance_" + this.c.id + " .property-control .property-dropdown .properties-list").html('');
        $("#class_instance_" + this.c.id + " .dropdown-toggle-properties > span").removeClass("loading");
        $("#class_instance_" + this.c.id + " .dropdown-toggle-properties > span").addClass("caret");

        if (this.page > 1) { // previous page
            $("#class_instance_" + this.c.id + " .property-control .property-dropdown .up").html('&uarr; results ' + (offset - limit + 1) + ' - ' + (offset));
            $("#class_instance_" + this.c.id + " .property-control .property-dropdown .up").show();
        } else {
            $("#class_instance_" + this.c.id + " .property-control .property-dropdown .up").hide();
        }

        for (var i=0; i<this.properties.length; i++) { //foreach property loaded until now
            var label = uri_to_label(this.properties[i].uri);

            if (!filter || (label.toLowerCase().indexOf(filter.toLowerCase()) >= 0)) {
                total++;

                if ((total > offset) && (total <= offset + limit)) {
                    var data_str = 'data-uri="' + this.properties[i].uri + '"';
                    $("#class_instance_" + this.c.id + " .property-control .property-dropdown .properties-list").append('<div class="property" ' + data_str + '>' + label + ' (' + this.properties[i].frequence + ')</div>');
                    added++;
                }

                if (added == limit) {
                    break;
                }
            }
        }

        if (added == limit) { // there are more than those that are shown
            $("#class_instance_" + this.c.id + " .property-control .property-dropdown .down").html('&darr; results ' + (offset + limit + 1) + ' - ' + (offset + 2*limit));
            $("#class_instance_" + this.c.id + " .property-control .property-dropdown .down").show();
        } else {
            $("#class_instance_" + this.c.id + " .property-control .property-dropdown .down").hide();
        }
    };

    this.set_page = function(page) {
        this.page = page;

        if (page < 1) {
            page = 1;
        }

        this.show();
    };

    this.load(1); //start loading properties

    $("#class_instance_" + this.c.id + " .property-control").html('<input type="search" autocomplete="false" placeholder="search"/><div class="dropdown-toggle-properties"><span class="loading"></span></div><span class="properties-found">Loading properties</span>');
    $("#class_instance_" + this.c.id + " .property-control").append('<div class="property-dropdown"><div class="button up"></div><div class="properties-list"></div><div class="button down"></button></div>');
}

/* On toggle press */
$('body').on('click', '.property-control .dropdown-toggle-properties', function(e) {
    var n = $(this).closest(".class-instance").data('n');
    if (builder_workbench.instances[n].property_select.properties.length > 0) { //properties have loaded
        $('.class-instance:not(#class_instance_' + $(this).closest(".class-instance").data('n') + ') .property-dropdown').hide();
        $(this).parent().find(".property-dropdown").toggle();
        var that = this;

        setTimeout( function() {$(that).parent().find("input").focus()}, 100);

        e.preventDefault();
        e.stopPropagation();
    }
});

/* Don't hide the select on same input */
$("body").on('click','.property-control input', function(e) {
    $('.class-instance:not(#class_instance_' + $(this).closest(".class-instance").data('n') + ') .property-dropdown').hide();

    e.preventDefault();
    e.stopPropagation();
});

/* hide the select otherwise */
$("body").on('click', function() {
    $(".property-dropdown").hide();
});

/* On filter */
$("body").on('input','.property-control input', function() {
    var n = $(this).parent().parent().parent().data('n');
    builder_workbench.instances[n].property_select.set_page(1);
    $(this).parent().find('.property-dropdown').show();
});


/* prev & next property pages */
$("body").on('click', '.property-control .property-dropdown > .up', function(e) {
    var n = $(this).closest(".class-instance").data('n');
    p_select = builder_workbench.instances[n].property_select;
    p_select.set_page(p_select.page - 1);

    e.preventDefault();
    e.stopPropagation();
});

$("body").on('click', '.property-control .property-dropdown > .down', function(e) {
    var n = $(this).closest(".class-instance").data('n');
    p_select = builder_workbench.instances[n].property_select;
    p_select.set_page(p_select.page + 1);

    //scroll back to top
    $(this).parent().animate({
        scrollTop: 0
    }, 300);

    e.preventDefault();
    e.stopPropagation();
});

/*Adding properties*/
$("body").on('click', '.property-control .property-dropdown .property', function(e) {
    var uri = $(this).data("uri");
    var n = $(this).closest(".class-instance").data('n');

    builder_workbench.add_property(n, uri);
    builder.reset();

    $(this).closest(".property-dropdown").toggle();

    //reset search
    $(this).closest(".property-dropdown").parent().find("input").val('');
    builder_workbench.instances[n].property_select.set_page(1);

    e.preventDefault();
    e.stopPropagation();
});