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
        if (this.property.uri == "URI") {
            return "URI";
        }

        return this.property.name.replace('_', ' ').replace(builder.instance_names[this.instance.id], '').charAt(0).toUpperCase();
    },

    property_name_printable: function(i, p) {
        this.instance = builder_workbench.instances[i];
        this.property = this.instance.selected_properties[p];

        return this.current_property_print();
    },

    save: function() {
        //save changes
        //change name in builder & workbench
        if ($('#property-options .property-name').val() != builder.property_names[this.i][this.p]) {
            this.property.name = $('#property-options .property-name').val();
            $("#class_instance_" + this.i + " .property-row:nth-of-type(" + (this.p+2) + ") span:nth-of-type(2)").html(this.current_property_print());
            builder.property_names[this.i][this.p] = undefined;
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