var builder = {
    query: "",
    select_vars: [],
    where_clause: "WHERE ",
    order_clause: "",
    error: "",
    instance_names: [],
    endpoint: "",
    prefixes: [],

    get_prefixes: function() {
        var prefix_str = "";
        var keys = Object.keys(this.prefixes);
        for(var i=0; i<keys.length; i++) {
            prefix_str += 'PREFIX ' + keys[i] + ':' + this.prefixes[ keys[i] ] + '\n';
        }

        if (prefix_str != "") {
            prefix_str += '\n';
        }

        return prefix_str;
    },

    uri_to_constraint: function(uri) {
        var spl = uri.split('/');
        var label = spl.pop();

        var start_pos = 0;
        if (label.indexOf('#') >= 0) {
            if (label.substr( label.indexOf('#') + 1).length > 0) {
                label = label.substr( label.indexOf('#') + 1);
            } else {
                label = label.substr(0, label.indexOf('#'));
            }
        }

        label = label.replace(/-/, '_');
        label = label.replace(/./, '_');

        return decodeURI(label);
    },

    get_constraint_name: function(uri, is_class) {
        var label = this.uri_to_constraint(uri);
        if (is_class == true) {
            return label.charAt(0).toUpperCase() + label.slice(1);
        } else {
            return label.charAt(0).toLowerCase() + label.slice(1); //make first letter lower case
        }
    },

    is_initial: function(w, i) {
        for (var j=0; j<arrows.connections.length; j++) {
            if (arrows.connections[j].t == '#class_instance_' + i) {
                return false;
            }
        }

        return true;
    },

    get_filter: function(p_name, f) { //get a specific filter
        var result = "";

        if (f.type == "str") {
            if (f.operator == "eq") {
                result = "regex(str(" + p_name + "), '^" + f.value + "$$'"; //double $ to avoid getting replaced later by javascript regex
            }
            else if (f.operator == "neq") {
                result = "!regex(str(" + p_name + "), '^" + f.value + "$$'";
            }
            else if (f.operator == "starts") {
                result = "regex(str(" + p_name + "), '^" + f.value + "'";
            }
            else if (f.operator == "ends") {
                result = "regex(str(" + p_name + "), '" + f.value + "$$'";
            }
            else if (f.operator == "contains") {
                result = "regex(str(" + p_name + "), '" + f.value + "'";
            }
            else if (f.operator == "language") {
                result = 'lang(' + p_name + ') = "" || langMatches(lang(' + p_name + '), "' + f.value + '")';
            }
            else {
                result = "regex(str(" + p_name + "), '" + f.value + "'";
            }

            //case sensitivity
            if (f.operator != "language") {
                if (f.case_sensitive) {
                    result += ")";
                } else {
                    result += ", 'i')";
                }
            }
        }
        else if (f.type == "num") {
            var ops = {'eq': '==', 'neq': '!=', 'gt': '>', 'lt': '<', 'gte': '>=', 'lte': '<='};
            this.prefixes['xsd'] = "<http://www.w3.org/2001/XMLSchema#>";
            result = 'xsd:decimal(' + p_name + ')' + ops[f.operator] + f.value;
        }
        else if (f.type == "date") {
            var ops = {'eq': '=', 'neq': '!=', 'gt': '>', 'lt': '<', 'gte': '>=', 'lte': '<='};
            this.prefixes['xsd'] = "<http://www.w3.org/2001/XMLSchema#>";
            result = "xsd:date(" + p_name + ")" + ops[f.operator] + "xsd:date('" + f.value + "')";
        }

        return result;
    },

    get_filters: function(p_name, p) { //returns the total filter
        var n = 0;

        var result = p.filter_prototype; //e.g [1] && ([2] || [3])
        for (var f=0; f<p.filters.length; f++) { //foreach filter
            if (p.filters[f] == undefined) continue;

            n++;
            var f_str = this.get_filter(p_name, p.filters[f]);
            result = result.replace('[' + f + ']', '(' + f_str + ')');
        }

        if (n == 0) return '';

        return 'FILTER (' + result + ')\n';
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
            var i_name = instance_name;

            //check if resource comes from a remote endpoint
            var endpoint = total_endpoints[ w.instances[i].dt_name ];

            if (endpoint != this.endpoint) { //use SERVICE keyword
                wh_c += '\nSERVICE <' + endpoint + '> {\n';
            }

            //add class constraint -- local copy of total where clause
            wh_c += '?' + i_name + ' a <' + inst.uri + '>.';

            //add properties to select clause
            for (var j=0; j<inst.selected_properties.length; j++) {
                var p = inst.selected_properties[j];
                var p_name = instance_name + '_' + this.uri_to_constraint(p.uri); //e.g ?city_leaderName

                //add chosen properties to select
                if (p.show) {
                    if (p.uri == 'URI') {
                        this.select_vars.push('?' + i_name);
                    } else {
                        this.select_vars.push('?' + p_name);
                    }
                }
            }

            //connect class instance to properties
            for (var j=0; j<inst.selected_properties.length; j++) {
                var p = inst.selected_properties[j];
                var p_name = instance_name + '_' + this.uri_to_constraint(p.uri); //e.g ?city_leaderName

                //connect property to class instances
                var constraint = '';
                if (p.uri != 'URI') {
                    constraint = '?' + i_name + ' <' + p.uri + '> ?' + p_name + '. \n';
                    constraint += this.get_foreign(w, i, p_name, j) + '\n'; //handle foreign keys
                } else {
                    constraint = this.get_foreign(w, i, i_name, j) + '\n'; //handle foreign keys
                }

                //add filters
                if (p.filters) {
                    if (p.uri != 'URI') {
                        constraint += this.get_filters('?' + p_name, p);
                    } else {
                        constraint += this.get_filters('?' + i_name, p);
                    }
                }

                //check if order
                if ((p.order_by) && (p.order_by.length > 0)) {

                    if (this.order_clause == "") {
                        this.order_clause = "ORDER BY";
                    }

                    var v_name = "";
                    //this.order_clause += ' ' + p.order_by + "(?" + p_name + ')';
                    if (p.uri != 'URI') {
                         v_name = "?" + p_name;
                    } else {
                         v_name = "?" + i_name;
                    }

                    var new_order_clause = "";
                    if ((p.order_by == "ASC") || (p.order_by == "DESC")) {
                        new_order_clause = p.order_by + "(" + v_name + ')';
                    }
                    else if ((p.order_by == "NUMBER_ASC") || (p.order_by == "NUMBER_DESC")) {
                        this.prefixes['xsd'] = "<http://www.w3.org/2001/XMLSchema#>";
                        new_order_clause = p.order_by.split('_')[1] + "(xsd:decimal(" + v_name + '))';
                    }
                    else if ((p.order_by == "DATE_ASC") || (p.order_by == "DATE_DESC")) {
                        this.prefixes['xsd'] = "<http://www.w3.org/2001/XMLSchema#>";
                        new_order_clause = p.order_by.split('_')[1] + "(xsd:date(" + v_name + '))';
                    }

                    this.order_clause += ' ' + new_order_clause;
                }

                //mark optional properties
                if (p.optional) {
                    constraint = 'OPTIONAL {' + constraint + '}\n';
                }

                wh_c += constraint;
            }

            if (endpoint != this.endpoint) { //close SERVICE keyword
                wh_c += '}. \n';
            }

            return wh_c;
        },

    create: function() {
        var w = builder_workbench;
        var i_names = this.instance_names;

        this.error = "";
        this.select_vars = [];
        this.where_clause = "WHERE ";
        this.order_clause = "";
        this.endpoint = "";

        //initialize base unique names to empty
        for (var i=0; i<w.instances.length; i++) {
            i_names[i] = "";
        }

        //set base unique names
        for (var i=0; i<w.instances.length; i++) {
            if (w.instances[i] == undefined) continue;
            if (i_names[i] != "") continue;

            var label = this.get_constraint_name(w.instances[i].uri, true); //get the constraint name

            var cnt = 1; //label is found once
            for (var j=i+1; j<w.instances.length; j++) {  //search if there are class instances with the same label
                if (w.instances[j] == undefined) continue;

                if (this.get_constraint_name(w.instances[j].uri, true) == label) {
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

                this.where_clause += this.add_instance(w, i_names[i], i);
            }
        }
        this.where_clause += "}";

        //construct the select clause -- only keep unique values
        this.select_vars = $.unique(this.select_vars);
        var select_clause = "SELECT";
        for (var i=0; i<this.select_vars.length; i++) {
            select_clause += ' ' + this.select_vars[i];
        }

        if (cnt_objects == 0) { //empty query
            this.query = '';
        } else { //the result is the SELECT ... WHERE ...
            this.query = this.get_prefixes() + select_clause + '\n' + this.where_clause + this.order_clause;
        }

        return this.query;
    },

    reset: function() {
        this.create();
        editor.setValue(this.query);
        $("#hdn_qb_dataset").val(this.endpoint);
        $("#sparql_results_container").hide();
    }
};