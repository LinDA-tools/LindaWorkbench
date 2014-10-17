var sparql_data_module = function() {

    function sparqlProxyQuery(endpoint, query) {
        console.log(query);

        var promise = Ember.$.getJSON('http://localhost:3002/sparql-proxy/' + endpoint + "/" + encodeURIComponent(query));
        return promise.then(function(result) {
            console.log("SPARQL RESULT:");
            console.dir(result);
            return result;
        });
    }

    function simplifyURI(uri) {
        var splits = uri.split(/[#/:]/);
        return splits[splits.length - 1];
    }

    function queryData(_location, _class, _properties) {
        if (_class) {
            return queryProperties(_location, _class, _properties);
        } else {
            return queryClasses(_location);
        }
    }

    function queryClasses(_location) {
        var graph = _location.graph;
        var endpoint = encodeURIComponent(_location.endpoint);
        var query = "";

        query += 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>';
        query += 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>';

        query += 'SELECT DISTINCT ?class ?classLabel ';
        query += 'WHERE ';
        query += '{';
        query += ' GRAPH <' + graph + '>';
        query += ' {';
        query += '  SELECT ?class ?classLabel COUNT(?x) as ?classSize';
        query += '  WHERE'
        query += '  {';
        query += '   ?x rdf:type ?class .';
        query += '   ?x ?property ?y .';
        query += '   OPTIONAL';
        query += '   {';
        query += '    ?class rdfs:label ?classLabel .';
        query += '   }';
        query += '  }';
        query += ' }';
        query += '}';
        query += 'ORDER BY DESC(?classSize)';

        return sparqlProxyQuery(endpoint, query).then(function(result) {
            var classes = [];
            for (var i = 0; i < result.length; i++) {
                var classURI = result[i].class.value;

                var classLabel = (result[i].classLabel || {}).value;
                if (!classLabel) {
                    classLabel = simplifyURI(classURI);
                }

                classes.push({
                    id: classURI,
                    label: classLabel
                });

            }
            return classes;
        });
    }

    function queryProperties(_location, _class, _properties) {
        var graph = _location.graph;
        var endpoint = encodeURIComponent(_location.endpoint);

        var query = "";

        query += 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ';
        query += 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> ';

        query += 'SELECT DISTINCT ?property ?propertyLabel ';
        query += 'WHERE ';
        query += '{';
        query += ' GRAPH <' + graph + '>';
        query += ' {';
        query += '  ?x0 rdf:type <' + _class + '> .';

        for (var i = 0; i < _properties.length; i++) {
            query += '  ?x' + i + ' <' + _properties[i] + '> ?x' + (i + 1) + ' .';
        }

        query += '  ?x' + _properties.length + ' ?property ?z .';
        query += '  OPTIONAL';
        query += '  {';
        query += '   ?property rdfs:label ?propertyLabel .';
        query += '  }';

        query += '  }';
        query += '}';

        return sparqlProxyQuery(endpoint, query).then(function(result) {
            var properties = [];
            for (var i = 0; i < result.length; i++) {

                if (!result[i].property) {
                    continue;
                }

                var propertyURI = result[i].property.value;
                var propertyLabel = (result[i].propertyLabel || {}).value;

                if (!propertyLabel) {
                    propertyLabel = simplifyURI(propertyURI);
                }

                properties.push({
                    id: propertyURI,
                    label: propertyLabel
                });
            }

            return properties;
        });
    }

    function queryInstances(_location, _class, propertyPaths) {
        var graph = _location.graph;
        var endpoint = encodeURIComponent(_location.endpoint);

        var query = "";

        query += 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ';
        query += 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> ';

        query += 'SELECT DISTINCT';

        for (var i = 0; i < propertyPaths.length; i++) {
            query += ' ?y' + i;
        }

        query += ' WHERE ';
        query += ' { ';
        query += '  GRAPH <' + graph + '> ';
        query += '  { ';
        query += '   ?x0 rdf:type <' + _class + '> . ';

        for (var j = 0; j < propertyPaths.length; j++) {
            var path = propertyPaths[j];
            query += ' { ';
            for (var i = 0; i < path.length; i++) {
                if (i < (path.length - 1)) {
                    query += '   ?x' + i + ' <' + path[i] + '> ?x' + (i + 1) + ' . ';
                } else {
                    query += '   ?x' + i + ' <' + path[i] + '> ?y' + j + ' . ';
                }
            }
            query += ' } ';

            if (j < (propertyPaths.length - 1)) {
                query += ' UNION ';
            }
        }

        query += '   } ';
        query += ' } ';

        return sparqlProxyQuery(endpoint, query);
    }

    function parse(location, selection) {
        var dimension = selection.dimension;
        var multidimension = selection.multidimension;
        var group = selection.group;
        var result = null;

        if (group.length > 0) {
            //CASE 1: dimension and grouped multidimension -> 1 dim; 1 mdim; just 1 group value;
            result = query_group(location, dimension, multidimension, group);

        } else {
            //CASES 2: dimension and/or multidimension -> 1 dim; 1..n mdim; 
            var dimension_ = dimension.concat(multidimension);
            result = query(location, dimension_);
        }


        return result;
    }

    function query_group(location, dimension, multidimension, group) {
       var graph = location.graph;
        var endpoint = encodeURIComponent(location.endpoint);
        var dimension = dimension[0];
        var multidimension = multidimension[0];
        var group = group[0];
        var class_ = multidimension.parent[0];
        var columnHeaders = [];
        var selectedVariablesArray = [];
        var optionals = "";
        var selectVariables = "";

        return group_by(endpoint, graph, group).then(function(groupInstances) {
            selectVariables += " ?d";
            selectedVariablesArray.push("d");
            columnHeaders.push(dimension.label);

            for (var i = 0; i < groupInstances.length; i++) {
                var groupInstance = groupInstances[i];
                selectVariables += " ?z" + i;
                columnHeaders.push(groupInstance.label);
                selectedVariablesArray.push("z" + i);

                optionals += '\nOPTIONAL {\n'
                optionals += ' ?x' + i + ' rdf:type <' + class_ + '> .\n';
                optionals += ' ?x' + i + ' <' + dimension.id + '> ?d.\n'
                optionals += ' ?x' + i + ' <' + multidimension.id + '> ?z' + i + '.\n'
                optionals += ' ?x' + i + ' <' + group.id + '> <' + groupInstance.id + '>.\n'
                optionals += '}\n';
            }

            var query = '\n\
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n\
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\
            SELECT DISTINCT ' + selectVariables + '\n\
            WHERE {\n\
                GRAPH <' + graph + '> {\n\
                    ' + optionals + '\n\
                }\n\
            }';
            return sparqlProxyQuery(endpoint, query);
        }).then(function(queryResult) {
            return convert(queryResult, columnHeaders, selectedVariablesArray);
        });

    }

    function query(location, dimensions) {
        var graph = location.graph;
        var endpoint = encodeURIComponent(location.endpoint);
        var columnHeaders = [];
        var optionals = "";
        var selectVariables = "";
        var selectedVariablesArray = [];
        var class_ = dimensions[0].parent[0];

        for (var i = 0; i < dimensions.length; i++) {
            var dimension = dimensions[i]

            selectVariables += " ?z" + i;
            columnHeaders.push(dimension.label);
            selectedVariablesArray.push("z" + i);


            optionals += '\n\
                    ?x' + ' <' + dimension.id + '> ?z' + i + '.\n';
        }

        var query = '\n\
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n\
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\
            SELECT DISTINCT ' + selectVariables + '\n\
            WHERE {\n\
                GRAPH <' + graph + '> {\n\
                     ?x' + ' rdf:type <' + class_ + '>.\n\
                     ' + optionals + '\n\
                }\n\
            }';

        return sparqlProxyQuery(endpoint, query).then(function(queryResult) {
            return convert(queryResult, columnHeaders, selectedVariablesArray);
        });
    }

    function group_by(endpoint, graph, groupProperty) {
        var class_ = groupProperty.parent[0];

        var groupValuesQuery = '\n\
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n\
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\
            SELECT DISTINCT ?instance WHERE {\n\
             GRAPH <' + graph + '> {\n\
              ?x rdf:type <' + class_ + '> .\n\
              ?x <' + groupProperty.id + '> ?instance .\n\
              { \n\
               SELECT ?label WHERE { \n\
                ?instance rdfs:label ?label \n\
               } LIMIT 1 \n\
              }\n\
             }\n\
            } ORDER BY ASC(?instance)';

        return sparqlProxyQuery(endpoint, groupValuesQuery).then(function(result) {
            var groupInstances = [];

            for (var i = 0; i < result.length; i++) {
                var instance = result[i].instance.value;
                var label = (result[i].label || {}).value || simplifyURI(instance);

                groupInstances.push({
                    id: instance,
                    label: label,
                    parent: [class_, groupProperty.id]
                });
            }
            return groupInstances;
        })
    }


    function convert(queryResults, columnHeaders, selectedVariablesArray) {
        var result = [];
        result.push(columnHeaders);
        for (var i = 0; i < queryResults.length; i++) {
            var queryResult = queryResults[i];
            var record = [];
            for (var j = 0; j < selectedVariablesArray.length; j++) {
                var p = selectedVariablesArray[j];
                var val = (queryResult[p] || {}).value;
                if (_.isUndefined(val)) {
                    record.push(null);
                    continue;
                }
                var value = simplifyURI(val);
                var parsedValue = parseFloat(value.replace(',', ''));
                if (_.isNaN(parsedValue) || _.isUndefined(parsedValue)) {
                    parsedValue = value;
                }
                record.push(parsedValue);
            }
            result.push(record);
       }
        return result;
    }

    return {
        queryData: queryData,
        queryInstances: queryInstances,
        parse: parse
    };
}(); 