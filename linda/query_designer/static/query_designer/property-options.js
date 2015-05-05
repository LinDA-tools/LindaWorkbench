$(function() {
    $("#property-options").dialog({
        autoOpen: false,
        width: 600
    });


});

var PropertyOptions = {
    i: undefined,
    p: undefined,
    instance: undefined,
    property: undefined,
    prev_name: undefined,

    show: function(i, p) {
        this.i = i;
        this.p = p;
        this.instance = builder_workbench.instances[i];
        this.property = this.instance.selected_properties[p];

        //set dialog title
        $("#ui-id-3").html(this.property.name + " - property options");

        //uri
        if (this.property.uri == 'URI') {
            $("#property-options .property-uri").html('&lt;' + this.instance.uri + '&gt;');
        } else {
            $("#property-options .property-uri").html('&lt;' + this.property.uri + '&gt;');
        }

        //name
        this.prev_name = this.property.name;
        $("#property-options .property-name").val(this.property.name);

        //group by
        $('#property-options .property-group-by').attr('checked', this.property.group_by === true);
        //aggregate
        if (this.property.aggregate !== undefined) {
            $('#property-options .property-aggregate').val(this.property.aggregate);
        } else {
            $('#property-options .property-aggregate').val("");
        }

        //show dialog
        $("#property-options").dialog("open");
    },

    current_property_print: function() {
        return this.property_name_printable_from_string(this.instance.id, this.property.uri, this.property.name);
    },

    property_name_printable: function(i, p) {
        this.instance = builder_workbench.instances[i];
        this.property = this.instance.selected_properties[p];

        return this.current_property_print();
    },

    property_name_printable_from_string: function(i, p_uri, p_name) {
        if (p_uri == "URI") {
            return "URI";
        }

        var result = p_name.replace('_', ' ').replace(builder.instance_names[i], '').trim();
        return result.charAt(0).toUpperCase() + result.slice(1);
    },

    save: function() {
        //save changes
        //change name in builder & workbench
        if ($('#property-options .property-name').val() != this.prev_name) {
            this.property.name = $('#property-options .property-name').val();
            this.property.name_from_user = true;
            $("#class_instance_" + this.i + " .property-row:nth-of-type(" + (this.p+2) + ") span:nth-of-type(2)").html(this.current_property_print());
        }

        this.property.group_by = $('#property-options .property-group-by').is(":checked");
        this.property.aggregate = $('#property-options .property-aggregate').val();
        if (this.property.aggregate === "") {
            this.property.aggregate = undefined;
        }
    }
};

$("#property-options-done").on('click', function(e) {
    PropertyOptions.save();
    $("#property-options").dialog("close");

    builder.reset();
});