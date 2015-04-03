    last_shown_tooltip = '';

    //show a new tooltip
    function tooltip(selector, text, position) {
        toolbar_destroy();

        $(selector).tooltipster({
            content: text,
            trigger: 'custom',
            contentAsHTML: true,
            position: position,
            interactive: true
        });
        $(selector).tooltipster('show');

        last_shown_tooltip = selector;
    }

    //destroy an existing toolbar
    function toolbar_destroy() {
        if (last_shown_tooltip != "") {
            $(last_shown_tooltip).tooltipster('destroy');
            $(last_shown_tooltip).attr('title', '');
        }
        last_shown_tooltip = '';
    }

    //check if the URIs of the properties in the p_arr have been added to the instance i
    function check_properties(i, p_arr) {
        if (builder_workbench.instances[i].selected_properties.length >= p_arr.length) {
                var n_of_found = 0;
                for (var p=0; p<builder_workbench.instances[i].selected_properties.length; p++) {
                    for (var j=0; j<p_arr.length; j++) {
                        if (builder_workbench.instances[i].selected_properties[p].uri == p_arr[j]) {
                            n_of_found++;
                            if (n_of_found == p_arr.length) {
                                break;
                            }
                        }
                    }
                }

            return n_of_found == p_arr.length//all properties are are added
        }
    }