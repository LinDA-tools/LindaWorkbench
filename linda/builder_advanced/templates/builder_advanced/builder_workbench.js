        var builder_workbench = {
            instances: [],
            selection: undefined,
            property_selection: undefined,

            has_filters: function(filters) {
                for(var i=0; i<filters.length; i++) {
                    if (filters[i] != undefined) {
                        return true;
                    }
                }

                return false;
            },

            /*Add more height to the workbench if necessary*/
            reset_height: function(i) {
                var o = $("#builder_workspace");
                if (i.position().top > o.height() - i.height()) { //when reaching bottom, make sure to enlarge the workspace height
                    o.height(i.position().top + i.height() + 50);
                    $("#tree_toolbar_objects").height(o.height() - 20);
                    $("#builder-canvas").attr('height', o.height());
                    arrows.ctx.height = o.height();

                    arrows.draw();
                }
            },

            /*Adds an instance of a class*/
            add_instance: function(dt_name, uri, x,y, default_properties) {
                var new_id = this.instances.length;
                var new_instance = $.parseHTML('<div id="class_instance_' + new_id + '" class="class-instance" data-n="' + new_id + '"style="left: ' + x + 'px; top: ' + y + 'px;"><div class="title"><h3>' + uri_to_label(uri) + '</h3><span class="uri">&lt;' + uri + '&gt;</span><span class="delete" data-about="' + new_id + '">x</span><span class="dataset">' + dt_name + '</span></div><div class="properties"><span class="loading">Loading properties...</span></div></div>');
                $("#builder_workspace").append(new_instance);
                $(new_instance).draggable({handle: '.title', cursor: 'move', drag: function() {
                    builder_workbench.reset_height($(this));
                    arrows.draw();
                }});
                this.bring_to_front(new_instance);

                var instance_object = {id: new_id, uri: uri, dt_name: dt_name, properties: ['URI'], selected_properties: []}
                this.instances.push(instance_object);

                var self = this;
                $.ajax({  //make an ajax request to get all properties
                    url: ADVANCED_BUILDER_API_URI + "active_class_properties/" +  dt_name + "?class_uri=" + encodeURIComponent(uri),
                    type: "GET",
                    success: function(data, textStatus, jqXHR)
                    {
                        if ((!builder_workbench.instances[new_id]) || (builder_workbench.instances[new_id].uri != uri)) { //the instance was deleted in the mean time
                            return;
                        }

                        var bindings = data.results.bindings;
                        //sort properties by label
                        bindings.sort(function(a,b) {
                            return uri_to_label(a.property.value).toLowerCase().localeCompare(uri_to_label(b.property.value).toLowerCase());
                        });

                        var select = $.parseHTML('<select class="property-select"></select>');
                        for (var i=0; i<bindings.length; i++) {
                            if (uri_to_label(bindings[i].property.value).length > 0){
                                instance_object.properties.push(bindings[i].property.value);
                                $(select).append('<option value="' +bindings[i].property.value+ '">' + uri_to_label(bindings[i].property.value)  + '</option>');
                            }
                        }

                        $(new_instance).find(".properties").html('<div class="property-table"><div class="header-row"><div></div><span>Show</span><span>Property</span><span>Optional</span><span>Order by</span><span>Filters</span><span>Foreign</span></div></div>');
                        $(new_instance).find(".properties").append('<div class="property-control"></div>');
                        var prop_control = $(new_instance).find(".properties .property-control");
                        prop_control.append('Found ' + (instance_object.properties.length-1).toLocaleString() + ' properties. <span class="sort-frequency">Order by frequency</span><br />');

                        try {
                            prop_control.append(select);
                        }
                        catch(err) {
                            console.log(err);
                        }

                        prop_control.append('<span class="add-property" data-about="' + new_id + '">Add property</span></div>');
                        var inst = self.instances[new_id];
                        self.add_property(new_id, 0); //add URI by default

                        if (default_properties) { //for each saved property
                            for (var k=0; k<default_properties.length; k++) {
                                if (typeof default_properties[k] == 'string') { //property uri as input
                                    self.add_property(new_id, -1, default_properties[k]);
                                } else { //property object as input
                                    if (k > 0) { // uri has already been added by default
                                        self.add_property(new_id, -1, default_properties[k].uri);;
                                    }

                                    inst.selected_properties[k] = jQuery.extend(true, {}, default_properties[k]); //clone the property object
                                    var sel = "#class_instance_" + new_id + " .property-row:nth-of-type(" + (k+2) + ") ";
                                    if (!inst.selected_properties[k].show) { //show
                                        $(sel + "span:nth-of-type(1) input").prop('checked', false)
                                    }
                                    if (inst.selected_properties[k].optional) { //optional
                                        $(sel + "span:nth-of-type(3) input").prop('checked', true)
                                    }
                                    if (inst.selected_properties[k].order_by) { //order by
                                        $(sel + "span:nth-of-type(4) select").val(inst.selected_properties[k].order_by);
                                    }

                                    if (builder_workbench.has_filters(inst.selected_properties[k].filters)) { //add the filters tick
                                        $(sel + "span:nth-of-type(5)").html('<span class="ui-icon ui-icon-check"></span>Edit');
                                    }


                                }
                            }

                            builder_workbench.reset_height($("#class_instance_" + new_id));
                        }

                        builder.reset();
                    },
                    error: function (jqXHR, textStatus, errorThrown)
                    {
                        $("#class_instance_" + new_id + " .properties").html('<span class="error">Error loading active properties</span>');
                    }
                });
            },

            bring_to_front: function(obj) {
                var mx = 0;
                for(var i=0; i<$('.class-instance').length; i++) {
                    var zIndex = parseInt($($('.class-instance')[i]).css('z-index'));
                    if (mx<zIndex) {
                        mx=zIndex;
                    }
                }

                $(obj).css("z-index", mx+1);
            },

            add_property: function(i_num, p_num, p_uri) {
                var instance = this.instances[i_num];

                if (!p_uri) { //both interfaces available
                    p_uri = instance.properties[p_num];
                }

                var p_object = {uri: p_uri, n: instance.selected_properties.length, optional:false, show:true, order_by: undefined, filters: []};

                instance.selected_properties.push(p_object);

                var optional_disabled = "";
                if (p_object.uri == "URI") { //URI can not be optional
                    optional_disabled = 'disabled = "disabled"';
                }

                var data_i_n = 'data-i="' + i_num + '" data-n="' + p_object.n + '"';
                if (p_object.uri == "URI") {
                    var delete_property = '<div></div>';
                } else {
                    var delete_property = '<div class="delete-property">x</div>';
                }

                var property_object_str = '<div class="property-row" ' + data_i_n + '>' + delete_property + '<span class="property-show"><input type="checkbox" checked="checked"/></span><span>';
                var order_select = '<select><option value=""></option><option value="ASC">ASC</option><option value="DESC">DESC</option><option value="NUMBER_ASC">ASC (number)</option><option value="NUMBER_DESC">DESC (number)</option><option value="DATE_ASC">ASC (date)</option>><option value="DATE_DESC">DESC (date)</option></select>'
                property_object_str += uri_to_label(p_object.uri) + '</span><span class="property-optional"><input  type="checkbox" ' + optional_disabled + ' /></span><span class="property-order-by">' + order_select + '</span><span>Edit</span><span>+Add connection</span></div>';
                var property_object = $.parseHTML(property_object_str);

                var id = "#class_instance_" + i_num;
                $(id + " .property-table").append(property_object);

                builder_workbench.reset_height($(id));
                builder.reset();

                if (p_object.uri != "URI") {
                    $.ajax({  //make an ajax request to get property return type
                        url: ADVANCED_BUILDER_API_URI + "get_property_type/" + instance.dt_name  + "/?property_uri=" + encodeURIComponent(p_object.uri),
                        type: "GET",
                        success: function(data, textStatus, jqXHR)
                        {
                            p_object.type = data.type;
                            if (p_object.type.length != "") {
                                $("#class_instance_" + i_num + " .property-row:nth-of-type(" + (p_object.n+2) + ") span:nth-of-type(2)").html(uri_to_label(p_object.uri) + ' (' + uri_to_label(p_object.type) + ')');
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown)
                        {
                            console.log(textStatus + ': ' + errorThrown);
                        }
                    });
                }
            },

            from_json: function(data) { //re-construct a query design from a json object
                for(var i=0; i<data.instances.length; i++) { //foreach instance
                    var inst = data.instances[i];

                    this.add_instance(inst.dt_name, inst.uri, inst.position.x, inst.position.y, inst.selected_properties);
                }

                arrows.connections = data.connections; //restore the connections
                arrows.paths = data.paths; //restore connection paths

                arrows.draw();
            },

            to_json: function() { //export the design to a json object
                data = {
                    instances: [],
                    connections: arrows.connections,
                    paths: arrows.paths
                };

                for(var i=0; i<this.instances.length; i++) { //foreach instance
                    data.instances[i] = {
                        uri: this.instances[i].uri,
                        dt_name: this.instances[i].dt_name,
                        position: {
                            x: $("#class_instance_" + i).offset().left - $("#builder_workspace").offset().left,
                            y: $("#class_instance_" + i).offset().top - $("#builder_workspace").offset().top,
                        },

                        selected_properties: this.instances[i].selected_properties
                    };
                }

                return data;
            }
        };

        /*Bring clicked instance front*/
        $("body").on('mousedown','.class-instance', function(e) {
            builder_workbench.bring_to_front(this);
        });

        /*Order properties by frequency*/
        $("body").on('click', '.class-instance .sort-frequency', function() {
            $(this).html("Ordering...");
            $(this).removeClass("sort-frequency");
            $(this).addClass("loading");

            var ord = $(this);
            var n = $(this).parent().parent().parent().data("n");
            var select = $(this).parent().find("select");
            var inst = builder_workbench.instances[n];

            $.ajax({  //make an ajax request to get all properties ordered by usage
                url: ADVANCED_BUILDER_API_URI + "active_class_properties/" +  inst.dt_name + "?order=true&class_uri=" + encodeURIComponent(inst.uri),
                type: "GET",
                success: function(data, textStatus, jqXHR) {
                    $(select).empty(); //empty the existing select box
                    var bindings = data.results.bindings;
                    bindings.sort(function(a,b) { //sort by value, then by label
                        var res = b.cnt.value - a.cnt.value;
                        if (res != 0) {
                            return res;
                        }
                        return uri_to_label(a.property.value).toLowerCase().localeCompare(uri_to_label(b.property.value).toLowerCase());
                    });

                    for (var i=0; i<bindings.length; i++) { //add all options - already in the correct order
                        if (uri_to_label(bindings[i].property.value).length > 0){
                            var num_human = Number(bindings[i].cnt.value).toLocaleString();
                            $(select).append('<option value="' +bindings[i].property.value+ '">' + uri_to_label(bindings[i].property.value) + ' (' + (num_human)  + ')</option>');
                        }
                    }

                    ord.remove();
                }
            });
        });

        /*Delete instances*/
        $("body").on('click', '.class-instance .delete', function() {
            var n = $(this).data("about");
            var id = "#class_instance_" + n;

            $(id).remove(); //delete the instance container

            arrows.remove_instance(id); //remove arrows from and to this instance

            //rearrange remaining instances after the deleted
            for (var i=n+1; i<builder_workbench.instances.length; i++) {
                //update the instance (meta) data
                $("#class_instance_" + i).data('n', (i-1));
                $("#class_instance_" + i).attr('data-n', (i-1));

                //update the x button
                $("#class_instance_" + i + " .delete").data('about', (i-1));
                $("#class_instance_" + i + " .delete").attr('data-about', (i-1));

                //update the add property button
                $("#class_instance_" + i + " .add-property").data('about', (i-1));
                $("#class_instance_" + i + " .add-property").attr('data-about', (i-1));

                //update each property row
                $("#class_instance_" + i + " .property-row").data('i', (i-1));
                $("#class_instance_" + i + " .property-row").attr('data-i', (i-1));

                //change id
                $("#class_instance_" + i).attr('id', "class_instance_" + (i-1));

                //update connections
                arrows.rename_instance("#class_instance_" + i, "#class_instance_" + (i-1));
            }

            builder_workbench.instances.splice(n, 1); //also delete from instance array

            builder.reset();
        });

        /*Delete properties*/
        $("body").on('click', '.class-instance .delete-property', function() {
            var i = $(this).parent().data("i");
            var n = $(this).parent().data("n");

            for (var j=0; j<$(this).parent().siblings().length; j++) { //update next properties' <n> data
                var nx = $(this).parent().siblings()[j];
                if ($(nx).data('n') > n) {
                    var new_n = $(nx).data('n') - 1;
                    $(nx).data('n', new_n);
                    $(nx).attr('data-n', new_n);
                }
            }

            $(this).parent().remove(); //remove the row

            arrows.remove_property('#class_instance_' + i, n); //remove arrows from and to this property
            builder_workbench.instances[i].selected_properties.splice(n, 1); //also delete from selected properties array

            builder.reset();
        });

        /*Adding properties*/
        $("body").on('click', '.add-property', function() {
            var n = $(this).data("about");
            var p = -1;
            var instance = builder_workbench.instances[n];

            for (var i=0; i<instance.properties.length; i++) {
                if ($("#class_instance_" + n + " .property-select").val() == instance.properties[i]) {
                    p = i;
                    break;
                }
            }

            builder_workbench.add_property(n, p);
            builder.reset();
        });

        /*Order by*/
        $("body").on('change', '.property-row span:nth-of-type(4) select', function(e) {
            builder_workbench.instances[ $(this).parent().parent().data('i') ].selected_properties[ $(this).parent().parent().data('n') ].order_by = $(this).val();
            builder.reset();
        });

        /*Adding filter*/
        $("body").on('click', '.property-row span:nth-of-type(5)', function(e) {
            builder_workbench.property_selection = builder_workbench.instances[ $(this).parent().data('i') ].selected_properties[ $(this).parent().data('n') ];
            builder_workbench.property_selection_of_instance = $(this).parent().data('i');
            show_filters();
        });

        /*Adding foreign keys*/
        $("body").on('click', '.property-row span:nth-of-type(6)', function(e) {
            if (builder_workbench.connection_from) { //already set
                return;
            }

            var style = "";
            if ($(this).prev().prev().prev().find('input').is(':checked')) {
                var style = "dashed";
            }

            builder_workbench.connection_from = {i: $(this).parent().data('i'), n: $(this).parent().data('n'), style: style};

            e.preventDefault();
            e.stopPropagation();
        });

        $("#builder_workbench").on('click', function(e) {
            if (e.which != 1) { //not left click
                builder_workbench.connection_from = undefined;
            }
        });

        /*Add arrow on mouse enter*/
        $("body").on('mouseenter', '.property-row', function() {
            var c = builder_workbench.connection_from;
            if (c !=  undefined) {
                if ($(this).data('i') == c.i) return;
                arrows.add_arrow('#class_instance_' + c.i, c.n, '#class_instance_' + $(this).data('i'), $(this).data('n'), c.style);
            }
        });

        /*Add arrow on class header mouse enter*/
        $("body").on('mouseenter', '.class-instance .title', function() {
            var c = builder_workbench.connection_from;
            if (c !=  undefined) {
                var i = $(this).parent().data('n');
                var n = 0; //uri
                if (i == c.i) return;
				
				$(this).addClass('connecting');
                arrows.add_arrow('#class_instance_' + c.i, c.n, '#class_instance_' + i, n, c.style);
            }
        });

        /*Remove arrow on leave*/
        $("body").on('mouseleave', '.property-row', function() {
            var c = builder_workbench.connection_from;
            if (c != undefined) {
                if ($(this).data('i') == c.i) return;
                arrows.remove_arrow('#class_instance_' + c.i, c.n, '#class_instance_' + $(this).data('i'), $(this).data('n'));
            }
        });

        /*Remove arrow on class header mouse enter*/
        $("body").on('mouseleave', '.class-instance .title', function() {
            var c = builder_workbench.connection_from;
            if (c !=  undefined) {
                var i = $(this).parent().data('n');
                var n = 0; //uri property is always at position #0
                if (i == c.i) return;
				
				$(this).removeClass('connecting');
                arrows.remove_arrow('#class_instance_' + c.i, c.n, '#class_instance_' + i, n);
            }
        });

        /*Make arrow permanent*/
        $("body").on('click', '.property-row, .class-instance .title', function(e) {
            if ((e.which == 1) && (builder_workbench.connection_from)) {
				$(this).removeClass('connecting');
				
                builder_workbench.connection_from = undefined;
                builder.reset();

                e.preventDefault();
                e.stopPropagation();
            }
        });

        /*Make and unmake property optional*/
        $("body").on('change', '.property-row .property-optional input', function(e) {
            var i = $(this).parent().parent().data('i');
            var n = $(this).parent().parent().data('n');

            builder_workbench.instances[i].selected_properties[n].optional = $(this).is(':checked');
            var style = "";
            if (builder_workbench.instances[i].selected_properties[n].optional) {
                style = "dashed";
            }

            arrows.set_style('#class_instance_' + i, n, style);
            builder.reset();
        });

        /*Show or not a property in the results*/
        $("body").on('change', '.property-row .property-show input', function(e) {
            var i = $(this).parent().parent().data('i');
            var n = $(this).parent().parent().data('n');

            builder_workbench.instances[i].selected_properties[n].show = $(this).is(':checked');
            builder.reset();
        });


