function property_select(instance) {
    this.c = instance;
    this.properties = [];
    this.page = undefined;
    this.started_loading = false;
    this.finished_loading = false;
    this.PROPERTY_PAGE_LIMIT = 200;
    this.SELECT_SIZE = 25;
    this.offset = 0;

    this.load_property_page = function(p, order, push) {
        var that = this;
        var c = this.c;

        var url;
        if (p == 0) { //vocabulary properties
            url = ADVANCED_BUILDER_API_URI + "get_properties_with_domain/" +  c.dt_name + "?class_uri=" + encodeURIComponent(c.uri)
        } else { //search in the endpoint
            url = ADVANCED_BUILDER_API_URI + "active_class_properties/" +  c.dt_name + "?class_uri=" + encodeURIComponent(c.uri) + '&order=' + order.toString() + '&page=' + p;
        }

        $.ajax({  //make an ajax request to get properties
            url: url,
            type: "GET",
            success: function(data, textStatus, jqXHR) {
                if (!c || that.to_stop) { //the instance was deleted in the mean time
                    return;
                }

                if (push === undefined) {
                    push = true;
                }
                if ((p == 1) && (that.started_loading)) { //another load effort already started loading
                    push = false;
                }

                if (p > 0) {
                    that.started_loading = true;
                }

                var bindings = data.results.bindings;
                var prev_properties_length = that.properties.length;
                for (var i=0; i<bindings.length; i++) { //add the properties
                    if (push) { //add the property
                        //properties found from the vocabulary are not certain to exist in the data source
                        var o = {'uri': bindings[i].property.value, 'uncertain': (p == 0)};

                        if (order) { //if order add frequence
                            o.frequence = Number(bindings[i].cnt.value).toLocaleString();
                        } else {
                            //if order = false, we must check for distinct values by hand
                            var already_exists = false;
                            for (var j=0; j<that.properties.length; j++) {
                                if (that.properties[j].uri == o.uri) {
                                    that.properties[j].uncertain = false;
                                    already_exists = true;
                                    break;
                                }
                            }

                            if (already_exists) {
                                continue;
                            }
                        }

                        that.properties.push(o);
                    } else { //just update property frequency
                        for (var j=0; j<that.properties.length; j++) {
                            if (that.properties[j].uri == bindings[i].property.value) {
                                that.properties[j].frequence = Number(bindings[i].cnt.value).toLocaleString()
                                 break;
                            }
                        }
                    }
                }

                if (p > 0) { //page zero is the vocabulary repository properties
                    if (push) {
                        if (that.properties.length == prev_properties_length) { //number of properties not increased
                            that.repeating_pages += 1;

                            if (that.repeating_pages == 20) { //after 20 pages without new properties, stop
                                that.finished_loading = true;
                                return;
                            }
                        } else {  //number of properties has changes
                            that.repeating_pages = 0;
                            $("#class_instance_" + that.c.id + " .property-control .properties-found").html(Number(that.properties.length).toLocaleString() + ' properties found');
                        }
                    }

                    that.show();

                    if (bindings.length == that.PROPERTY_PAGE_LIMIT) { //load next page
                        that.load_property_page(p+1, order, push);
                    } else {
                        that.finished_loading = true;
                    }

                    if (!that.page) { //initial page of select
                        that.set_page(1);
                    }
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
    },

    this.load = function() { // load the current page of properties
        var that = this;

        if (this.to_stop) {
            return;
        }

        this.repeating_pages = 0;
        this.load_property_page(1, true);

        //set a timeout so after 10 seconds degraded loading starts
        setTimeout(function() {
            if (that.started_loading) {
                return;
            }

            that.load_property_page(0, false);
            that.load_property_page(1, false);
        }, 10000);
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

                    //create the property html object
                    var class_str = 'class="property';
                    if (this.properties[i].uncertain === true) {
                        class_str += ' uncertain';
                    }
                    class_str += '"';

                    var property_div = '<div ' + class_str + ' ' + data_str + '>' + label;
                    if (typeof(this.properties[i].frequence) != "undefined") {
                        property_div += ' (' + this.properties[i].frequence + ')';
                    }
                    property_div += '</div>';

                    //append the property to the select
                    $("#class_instance_" + this.c.id + " .property-control .property-dropdown .properties-list").append(property_div);
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

    this.load(); //start loading properties

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

$("body").on('keyup','.property-control input', function(e) {
    if (e.keyCode == 13) {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
          '(\\#[-a-z\\d_]*)?$','i');

        var v = $(this).val();
        if (pattern.test(v)) { // is URI
            var n = $(this).closest(".class-instance").data('n');
            p_select = builder_workbench.instances[n].property_select;

            //add to properties if it was not found
            var found = false;
            for (var i=0; i<p_select.properties.length; i++) {
                if (p_select.properties[i].uri == v) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                p_select.properties.push({'uri': v});
            }

            builder_workbench.add_property(n, v);
            builder.reset();

            $(this).parent().find(".property-dropdown").hide();
            $(this).closest(".class-instance").find(".property-control .properties-found").html(Number(p_select.properties.length).toLocaleString() + ' properties found');

            //reset search
            $(this).val('');
            builder_workbench.instances[n].property_select.set_page(1);

            e.preventDefault();
            e.stopPropagation();
        }
    }
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