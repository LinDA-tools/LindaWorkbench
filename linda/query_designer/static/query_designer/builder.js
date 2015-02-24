var builder = {
    query: "",
    select_vars: [],
    where_clause: "",
    order_clause: "",
    error: "",
    instance_names: [],
    property_names: new Array([]),
    endpoint: "",
    prefixes: [],
    known_prefixes: [],
    is_editing: false,
    pattern: '',

    get_prefixes: function() {
        var prefix_str = "";
        var keys = Object.keys(this.prefixes);
        for(var i=0; i<keys.length; i++) {
            prefix_str += 'PREFIX ' + keys[i] + ': ' + this.prefixes[ keys[i] ] + '\n';
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

        label = label.replace(/-/g, '_');
        label = label.replace(/\./g, '_');
		label = label.replace(/\(/g, '_');
		label = label.replace(/\)/g, '_');
		
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

    get_root_uri: function(uri) {
        var spl = uri.split('/');
        var last_part = spl.pop();

        if (last_part.indexOf('#') >= 0) {
            last_part = last_part.substr(0, last_part.indexOf('#')+1);
        } else {
            last_part = '';
        }

        var result = '';
        for (var i=0; i<spl.length; i++) {
            result += spl[i] + '/';
        }
        result += last_part;

        return result.substr(1);
    },

    find_in_prefixes: function(v) {
        for (var x in this.prefixes) {if (this.prefixes[x] == v) return x;} return undefined;
    },

    detect_prefixes: function(q) {
        var entity_pattern = /<http:\/\/[^>]*>/g; //regex to detect <http://[any char except >]*>
        var res = q.match(entity_pattern);

        var cnt = [];
        // foreach uri detect its root and calculate frequency of each root
        while ((match = entity_pattern.exec(q)) != null) {
            var root = this.get_root_uri(match[0]);

            if (cnt[root] == undefined) {
                cnt[root] = 1;
            } else {
                cnt[root]++;
            }
        }

        //foreach root with frequency > 1
        var prf_cnt = 0;
        var roots = Object.keys(cnt);
        roots.sort(function(a, b){
          return b.length - a.length; //DESC sort of roots based on their length
        });

        for (var i=0; i<roots.length; i++) {
            if ((cnt[ roots[i] ] > 1) || this.known_prefixes[roots[i]]) {
                //foreach match of this root
                var offset = 0;
                var idx = 0;

                while ( (idx = q.substr(offset).indexOf(roots[i])) >= 0) {
                    idx += offset;

                    //check that it is actually the prefix of the uri and not just a part
                    var skip = false;
                    var ent_close_pos = -1;
                    for (var c=idx + roots[i].length + 1; c<q.length ;c++) {
                        if (q[c] == '/') {
                            skip = true;
                            break;
                        }
                        else if (q[c] == '>') {
                            ent_close_pos = c;
                            break;
                        }
                    }

                    if (skip) { // not a prefix
                        offset++;
                        continue;
                    }

                    //find the prefix or add it to prefixes
                    var prf = this.find_in_prefixes('<' + roots[i] + '>');

                    if (prf == undefined) {
                        if (this.known_prefixes[roots[i]]) {
                            prf = this.known_prefixes[roots[i]];
                        } else {
                            prf_cnt++;
                            prf = 'prf' + prf_cnt;
                        }
                        this.prefixes[prf] = '<' + roots[i] + '>';
                    }

                    //replace the root uri with the prefix
                    q = q.substr(0, idx-1) + prf + ':' + q.substr(idx+roots[i].length, (ent_close_pos - idx - roots[i].length ))+ q.substr(ent_close_pos+1);
                    //update the point from which to start to search for root in the next iteration
                    offset = idx + prf.length + 1;
                }
            }
        }

        return q;
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

        return '\n    FILTER (' + result + ')\n';
    },

    //forges foreign key relationships
    create_foreign: function(w, i, p_name, p) {
        for (var j=0; j<arrows.connections.length; j++) {
             if ((arrows.connections[j].f == '#class_instance_' + i) && (arrows.connections[j].fp == p)) {
                var tn = arrows.connections[j].t.split('_')[2] //3rd part is the number #class_instance_1
                if (w.instances[tn].selected_properties[arrows.connections[j].tp].uri == 'URI') { //foreign key to other entity
                    this.instance_names[tn] = p_name;
                } else { //foreign key to other entity's property
                    if (this.property_names[tn] == undefined) {
                        this.property_names[tn] = [];
                    }
                    this.property_names[tn][arrows.connections[j].tp] = p_name;
                }
             }
        }
    },

    /*Adds an instance to the query*/
    /*Continues recursively*/
    add_instance: function(w, i) {
        var wh_c = '';

        var inst = w.instances[i];
        var i_name = this.instance_names[i];

        //check if resource comes from a remote endpoint
        var endpoint = total_endpoints[ w.instances[i].dt_name ];

        if (endpoint != this.endpoint) { //use SERVICE keyword
            wh_c += '\nSERVICE <' + endpoint + '> {\n';
        }

        //add class constraint -- local copy of total where clause
        wh_c += '  ?' + i_name + ' a <' + inst.uri + '>.';

        //add properties to select clause
        for (var j=0; j<inst.selected_properties.length; j++) {
            var p = inst.selected_properties[j];

            if ((this.property_names[i] != undefined) && (this.property_names[i][j] != undefined)) {
                var p_name = this.property_names[i][j];
            } else {
                var p_name = i_name + '_' + this.uri_to_constraint(p.uri); //e.g ?city_leaderName
            }

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
            if ((this.property_names[i] != undefined) && (this.property_names[i][j] != undefined)) {
                var p_name = this.property_names[i][j];
            } else {
                var p_name = i_name + '_' + this.uri_to_constraint(p.uri); //e.g ?city_leaderName
            }

            //connect property to class instances
            var constraint = '';
            if (p.uri != 'URI') {
                constraint = '    ?' + i_name + ' <' + p.uri + '> ?' + p_name + '.';
                this.create_foreign(w, i, p_name, j); //handle uri foreign keys
            } else {
                this.create_foreign(w, i, i_name, j); //handle property foreign keys
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
                constraint = 'OPTIONAL {\n' + constraint + '}\n';
            }

            wh_c += constraint + '\n';
        }

        wh_c += '\n';
        if (endpoint != this.endpoint) { //close SERVICE keyword
            wh_c += '}. \n';
        }

        return wh_c;
    },

    //create subquery X
    //ch = undefined for None subquery
    create_subquery: function(ch) {
        var w = builder_workbench;

        var result = '';
        for (var i=0; i<w.instances.length; i++) { //foreach instance
            if (w.instances[i] == undefined) continue;

            if (w.instances[i].subquery === ch) { //if it belongs in the same subquery
                this.cnt_objects++;
                if (this.endpoint == "") {
                    this.endpoint = total_endpoints[ w.instances[i].dt_name ];
                }

                result += this.add_instance(w, i);
            }
        }

        return result;
    },

    create: function() {
        var w = builder_workbench;
        var i_names = this.instance_names;

        this.error = "";
        this.select_vars = [];
        this.where_clause = "WHERE ";
        this.order_clause = "";
        this.endpoint = "";
        this.prefixes = [];

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

                if ((this.get_constraint_name(w.instances[j].uri, true) == label) && (w.instances[j].subquery === w.instances[i].subquery)) {
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

        this.cnt_objects = 0;
        //create the query string
        var pt = this.pattern;

        //none sub-queries instances
        this.where_clause = "WHERE {\n" + this.create_subquery(undefined);

        if (pt.length > 0) { //apply the pattern
            var pt = this.pattern;
            pt = pt.replace('(', '{');
            pt = pt.replace(')', '}');

            for (var pos=0; pos<pt.length; pos++) {
                if ((pt[pos] == '{') || (pt[pos] == '}')) {
                    this.where_clause += pt[pos];
                }
                else if (pt[pos] == '+') {
                    this.where_clause += 'UNION ';
                }
                else if (pt[pos] == '-') {
                    this.where_clause += 'MINUS ';
                }
                else {
                    this.where_clause += "{ # sub-graph " + pt[pos] +"\n" + this.create_subquery(pt[pos]) + "}\n";
                }
            }
        }

        this.where_clause += "}\n"

        //construct the select clause -- only keep unique values
        this.select_vars = $.unique(this.select_vars);
        var select_clause = "SELECT";
        for (var i=0; i<this.select_vars.length; i++) {
            select_clause += ' ' + this.select_vars[i];
        }

        //auto-detect prefixes
        this.where_clause = this.detect_prefixes(this.where_clause);

        if (this.cnt_objects == 0) { //empty query
            this.query = '';
        } else { //the result is the SELECT ... WHERE ...
            this.query = this.get_prefixes() + select_clause + '\n' + this.where_clause + this.order_clause;
        }

        return this.query;
    },

    reset: function() {
        this.pattern = $("#builder_pattern > input").val().toUpperCase();
        this.create();

        this.is_editing = true;
        editor.setValue(this.query);
        this.is_editing = false;

        $("#hdn_qb_dataset").val(this.endpoint);
        $("#sparql_results_container").hide();
    }
};

//ajax call to initialize prefixes from the vocabulary repository
$.ajax({  //make an ajax request to get property return type
    url: '/api/vocabularies/versions/',
    type: "GET",
    success: function(data, textStatus, jqXHR) {
        for (var i=0; i<data.length; i++) {
            builder.known_prefixes[data[i].uri] = data[i].prefix;
        }
    }
});