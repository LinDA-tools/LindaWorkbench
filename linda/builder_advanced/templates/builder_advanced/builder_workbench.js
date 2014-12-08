        var builder_workbench = {
            instances: [],
            selection: undefined,

            /*Adds an instance of a class*/
            add_instance: function(dt_name, uri, x,y) {
                var new_id = this.instances.length;
                var new_instance = $.parseHTML('<div id="class_instance_' + this.instances.length + '" class="class-instance" style="left: ' + x + 'px; top: ' + y + 'px;" class="class-instance"><div class="title"><h3>' + uri_to_label(uri) + '</h3><span class="delete" data-about="' + new_id + '">x</span><span>' + dt_name + '</span></div><div class="properties"><span class="loading">Loading properties...</span></div></div>');
                $("#builder_workspace").append(new_instance);
                $(new_instance).draggable({drag: function() {arrows.draw()}});
                this.bring_to_front(new_instance);

                var instance_object = {id: new_id, uri: uri, dt_name: dt_name, properties: ['URI'], selected_properties: []}
                this.instances.push(instance_object);

                var self = this;
                $.ajax({  //make an ajax request to get all properties
                    url: ADVANCED_BUILDER_API_URI + "active_class_properties/" +  dt_name + "?class_uri=" + encodeURIComponent(uri),
                    type: "GET",
                    success: function(data, textStatus, jqXHR)
                    {
                        var bindings = data.results.bindings;

                        var select = $.parseHTML('<select class="property-select"></select>');
                        for (var i=0; i<bindings.length; i++) {
                            instance_object.properties.push(bindings[i].property.value);
                            $(select).append('<option value="' +bindings[i].property.value+ '">' + uri_to_label(bindings[i].property.value)  + '</option>');
                        }

                        $(new_instance).find(".properties").html('<div class="property-table"><div class="header-row"><div></div><span>Show</span><span>Property</span><span>Optional</span><span>Order by</span><span>Filters</span><span>Foreign</span></div></div>');
                        $(new_instance).find(".properties").append('<div class="property-control"></div>');
                        var prop_control = $(new_instance).find(".properties .property-control");
                        prop_control.append('Found ' + instance_object.properties.length + ' different properties in data.<br />');
                        prop_control.append(select);
                        prop_control.append('<span class="add-property" data-about="' + new_id + '">Add property</span></div>');
                        self.add_property(new_id, 0); //add URI by default
                    },
                    error: function (jqXHR, textStatus, errorThrown)
                    {
                        console.log(textStatus + ': ' + errorThrown);
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

            add_property: function(i_num, p_num) {
                var instance = this.instances[i_num];
                var p_object = {uri: instance.properties[p_num], n: instance.selected_properties.length, optional:false, show:true};

                instance.selected_properties.push(p_object);

                var optional_disabled = "";
                if (p_object.uri == "URI") { //URI can not be optional
                    optional_disabled = 'disabled = "disabled"';
                }

                var data_i_n = 'data-i="' + i_num + '" data-n="' + p_object.n + '"';
                if (p_object.uri == "URI") {
                    var delete_property = '<div></div>';
                } else {
                    var delete_property = '<div class="delete-property" ' + data_i_n + '>x</div>';
                }

                var property_object_str = '<div class="property-row" ' + data_i_n + '>' + delete_property + '<span class="property-show"><input type="checkbox" checked="checked"/></span><span>';
                property_object_str += uri_to_label(p_object.uri) + '</span><span class="property-optional"><input  type="checkbox" ' + optional_disabled + ' /></span><span class="property-order-by"><select><option value=""></option><option value="ASC">ASC</option><option value="DESC">DESC</option></select></span><span>Filters</span><span ' + data_i_n + '>+Add connection</span></div>';
                var property_object = $.parseHTML(property_object_str);

                var id = "#class_instance_" + i_num;
                $(id + " .property-table").append(property_object);
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
            }
        };

        /*Bring clicked instance front*/
        $("body").on('mousedown','.class-instance', function(e) {
            builder_workbench.bring_to_front(this);
        });

        /*Delete instances*/
        $("body").on('click', '.class-instance .delete', function() {
            var n = $(this).data("about");
            var id = "#class_instance_" + n;

            $(id).remove();

            arrows.remove_instance(id); //remove arrows from and to this instance
            builder_workbench.instances[n] = undefined; //also delete from instance array

            builder.reset();
        });

        /*Delete properties*/
        $("body").on('click', '.class-instance .delete-property', function() {
            var i = $(this).parent().data("i");
            var n = $(this).parent().data("n");

            for (var j=0; j<$(this).parent().siblings().length; j++) { //update next properties' <n> data
                var nx = $(this).parent().siblings()[j]
                if ($(nx).data('n') > n) {
                    var new_n = $(nx).data('n') - 1;
                    $(nx).data('n', new_n);
                    $(nx).attr('data-n', new_n);
                    $(nx).find(".delete-property, span:nth-of-type(6)").data('n', new_n);
                    $(nx).find(".delete-property, span:nth-of-type(6)").attr('data-n', new_n);
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

        /*Adding foreign keys*/
        $("body").on('click', '.property-row span:nth-of-type(6)', function(e) {
            var style = "";
            if ($(this).prev().prev().prev().find('input').is(':checked')) {
                var style = "dashed";
            }

            builder_workbench.connection_from = {i: $(this).data('i'), n: $(this).data('n'), style: style};

            e.preventDefault();
            e.stopPropagation();
        });

        $("#builder_workbench").on('click', function(e) {
            if (e.which != 1) { //not left click
                builder_workbench.connection_from = undefined;
            }
        });

        /*Add arrow on enter*/
        $("body").on('mouseenter', '.property-row', function() {
            var c = builder_workbench.connection_from;
            if (c !=  undefined) {
                if ($(this).data('i') == c.i) return;

                arrows.add_arrow('#class_instance_' + c.i, c.n, '#class_instance_' + $(this).data('i'), $(this).data('n'), c.style);
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

        /*Make arrow permanent*/
        $("body").on('click', '.property-row', function(e) {
            if ((e.which == 1) && (builder_workbench.connection_from)) {
                builder_workbench.connection_from = undefined;
                builder.reset();
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

        /*Show filters dialog*/
        $("body").on('click', '.property-row span:nth-of-type(5)', function(e) {
            show_filters();
        });

