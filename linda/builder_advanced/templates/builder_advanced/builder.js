var builder = {
    query: "",
    select_clause: "SELECT",
    where_clause: "WHERE ",
    error: "",
    instance_names: [],
    endpoint: "",

    uri_to_constraint: function(uri) {
        var spl = uri.split('/');
        var label = spl.pop();

        var start_pos = 0;
        if (label.indexOf('#') >= 0) {
            label = label.substr(label.indexOf('#') + 1);
        }

        return decodeURI(label);
    },

    get_constraint_name: function(uri) {
        var label = this.uri_to_constraint(uri);
        return label.charAt(0).toLowerCase() + label.slice(1); //make first letter lower case
    },

    is_initial: function(w, i) {
        for (var j=0; j<arrows.connections.length; j++) {
            if (arrows.connections[j].t == '#class_instance_' + i) {
                return false;
            }
        }

        return true;
    },

    get_foreign: function(w, i, p_name, p) {
        var wh_c = '';

        for (var j=0; j<arrows.connections.length; j++) {
             if ((arrows.connections[j].f == '#class_instance_' + i) && (arrows.connections[j].fp == p)) {
                var tn = arrows.connections[j].t.split('_')[2] //3rd part is the number #class_instance_1
                wh_c += this.add_instance(w, p_name, tn);
             }
        }

        return wh_c;
    },

        /*Adds an instance to the query*/
        /*Continues recursively*/
        add_instance: function(w, instance_name, i) {
            var wh_c = ' ';

            var inst = w.instances[i];
            var i_name = '?' + instance_name;

            //check if resource comes from a remote endpoint
            var endpoint = total_endpoints[ w.instances[i].dt_name ];

            if (endpoint != this.endpoint) { //use SERVICE keyword
                wh_c += 'SERVICE <' + endpoint + '> {';
            }

            //add class constraint -- local copy of total where clause
            wh_c += i_name + ' a <' + inst.uri + '>.';

            //connect class instance to properties
            for (var j=0; j<inst.selected_properties.length; j++) {
                var p = inst.selected_properties[j];
                var p_name = instance_name + '_' + this.uri_to_constraint(p.uri); //e.g ?city_leaderName

                //add chosen properties to select
                if (p.show) {
                    if (p.uri == 'URI') {
                        this.select_clause += i_name;
                    } else {
                        this.select_clause += '?' + p_name;
                    }

                    this.select_clause += ' ';
                }

                //connect property to class instances
                if (p.uri != 'URI') {
                    var constraint = i_name + ' <' + p.uri + '> ?' + p_name + '. ';

                    //handle foreign keys
                    constraint += this.get_foreign(w, i, p_name, j) + '\n';

                    if (p.optional) { //mark optional properties
                        constraint = 'OPTIONAL {' + constraint + '}';
                    }

                    wh_c += constraint;
                }
            }

            if (endpoint != this.endpoint) { //close SERVICE keyword
                wh_c += '}. '
            }

            return wh_c;
        },

    create: function() {
        var w = builder_workbench;
        var i_names = this.instance_names;

        this.error = "";
        this.select_clause = "SELECT ";
        this.where_clause = "WHERE ";
        this.endpoint = "";

        //initialize base unique names to empty
        for (var i=0; i<w.instances.length; i++) {
            i_names[i] = "";
        }

        //set base unique names
        for (var i=0; i<w.instances.length; i++) {
            if (w.instances[i] == undefined) continue;
            if (i_names[i] != "") continue;

            var label = this.get_constraint_name(w.instances[i].uri); //get the constraint name

            var cnt = 1; //label is found once
            for (var j=i+1; j<w.instances.length; j++) {  //search if there are class instances with the same label
                if (w.instances[j] == undefined) continue;

                if (this.get_constraint_name(w.instances[j].uri) == label) {
                    if (i_names[i] == "") {
                        i_names[i] = label + '1';
                    }

                    cnt++;
                    i_names[j] = label + cnt;
                }
            }

            if (i_names[i] == "") {
                i_names[i] = label;
            }
        }

        var cnt_objects = 0;

        //create the query string
        this.where_clause += "{\n";
        for (var i=0; i<w.instances.length; i++) {
            if (w.instances[i] == undefined) continue;

            if (this.is_initial(w, i)) {
                cnt_objects++;
                if (this.endpoint == "") {
                    this.endpoint = total_endpoints[ w.instances[i].dt_name ];
                }

                this.where_clause += this.add_instance(w, i_names[i], i) + '\n';
            }
        }
        this.where_clause += "}";

        //the result is the SELECT ... WHERE ...
        this.query = this.select_clause + '\n' + this.where_clause;

        if (cnt_objects == 0) { //empty query
            this.query == '';
        }

        return this.query;
    },

    reset: function() {
        this.create();
        $("#txt_sparql_query").val(this.query);
        $("#hdn_qb_dataset").val(this.endpoint);
    }
};