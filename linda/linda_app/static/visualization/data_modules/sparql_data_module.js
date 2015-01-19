var sparql_data_module = function () {

    function sparqlProxyQuery(endpoint, query) {
        var promise = Ember.$.getJSON('http://' + window.location.hostname + ':3002/sparql-proxy/' + encodeURIComponent(endpoint) + "/" + encodeURIComponent(query));
        return promise.then(function (result) {
            console.log("SPARQL DATA MODULE - SPARQL QUERY RESULT");
            console.dir(result);
            return result;
        });
    }

    function simplifyURI(uri) {
        var splits = uri.split(/[#/:]/);
        return splits[splits.length - 1];
    }

    function queryClasses(endpoint, graph) {
        var query = "";

        query += 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>';
        query += 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>';

        query += 'SELECT DISTINCT ?class ?classLabel ';
        query += 'WHERE ';
        query += '{';
        query += ' GRAPH <' + graph + '>';
        query += ' {';
        query += '  SELECT ?class ?classLabel COUNT(?x) as ?classSize';
        query += '  WHERE';
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

        console.log("SPARQL DATA MODULE - CLASSES QUERY");
        console.dir(query);

        return sparqlProxyQuery(endpoint, query).then(function (result) {
            var classes = [];
            for (var i = 0; i < result.length; i++) {
                var classURI = result[i].class.value;

                var classLabel = (result[i].classLabel || {}).value;
                if (!classLabel) {
                    classLabel = simplifyURI(classURI);
                }

                var dataInfo = {
                    id: classURI,
                    label: classLabel,
                    type: "Class",
                    grandchildren: true
                };

                classes.push(dataInfo);

            }
            return classes;
        });
    }

    function predictRDFDatatypeSOM(datatype) {
        switch (datatype) {
            case "http://www.w3.org/2001/XMLSchema#float":
            case "http://www.w3.org/2001/XMLSchema#double":
            case "http://www.w3.org/2001/XMLSchema#decimal":
            case "http://www.w3.org/2001/XMLSchema#integer":
            case "http://www.w3.org/2001/XMLSchema#nonPositiveInteger":
            case "http://www.w3.org/2001/XMLSchema#negativeInteger":
            case "http://www.w3.org/2001/XMLSchema#long":
            case "http://www.w3.org/2001/XMLSchema#int":
            case "http://www.w3.org/2001/XMLSchema#short":
            case "http://www.w3.org/2001/XMLSchema#byte":
            case "http://www.w3.org/2001/XMLSchema#nonNegativeInteger":
            case "http://www.w3.org/2001/XMLSchema#unsignedLong":
            case "http://www.w3.org/2001/XMLSchema#unsignedInt":
            case "http://www.w3.org/2001/XMLSchema#unsignedShort":
            case "http://www.w3.org/2001/XMLSchema#unsignedByte":
            case "http://www.w3.org/2001/XMLSchema#positiveInteger":
                return "Quantitative";
            case "http://www.w3.org/2001/XMLSchema#dateTime":
            case "http://www.w3.org/2001/XMLSchema#date":
            case "http://www.w3.org/2001/XMLSchema#gYear":
            case "http://www.w3.org/2001/XMLSchema#gYearMonth":
                return "Interval";
            case "http://www.w3.org/2001/XMLSchema#string":
                return "Nominal";
            default:
                return "Categorical";
        }
    }

    function predictRDFPropertyRole(propertyURI, propertyTypes) {
        switch (propertyURI) {
            // TODO: Are there properties that always have the role of a domain or a range?
        }
        for (var i = 0; i < propertyTypes.length; i++) {
            var propertyType = propertyTypes[i];
            switch (propertyType) {
                case "http://purl.org/linked-data/cube#DimensionProperty":
                    return "Domain";
                case "http://purl.org/linked-data/cube#MeasureProperty":
                    return "Range";
            }
        }
        // undefined
        return;
    }

    function queryProperties(endpoint, graph, _class, _properties) {
        var query = "";

        query += 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n';
        query += 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n';

        query += 'SELECT DISTINCT ?property ';
        query += ' SAMPLE(?propertyLabel_) as ?propertyLabel ';
        query += ' GROUP_CONCAT(STR(?propertyType) ; separator=" ") as ?propertyTypes ';
        query += ' SAMPLE(?propertyValue) as ?sampleValue ';
        query += ' COUNT(?grandchildProperty) as ?numChildren\n';
        query += 'WHERE\n';
        query += '{\n';
        query += ' GRAPH <' + graph + '>\n';
        query += ' {\n';
        query += '  ?x0 rdf:type <' + _class.id + '> .\n';

        for (var i = 0; i < _properties.length; i++) {
            query += '  ?x' + i + ' <' + _properties[i].id + '> ?x' + (i + 1) + ' .\n';
        }

        query += '  ?x' + _properties.length + ' ?property ?propertyValue .\n';
        query += '  OPTIONAL\n';
        query += '  {\n';
        query += '   ?property rdfs:label ?propertyLabel_ .\n';
        query += '  }\n';
        query += '  OPTIONAL\n';
        query += '  {\n';
        query += '   ?property a ?propertyType .\n';
        query += '  }\n';
        query += '  OPTIONAL\n';
        query += '  {\n';
        query += '   ?propertyValue ?grandchildProperty ?grandchildValue.\n';
        query += '  }\n';
        query += ' }\n';
        query += '} GROUP BY ?property';

        console.log("SPARQL DATA MODULE - PROPERTIES QUERY: ");
        console.dir(query);

        return sparqlProxyQuery(endpoint, query).then(function (results) {
            var properties = [];

            for (var i = 0; i < results.length; i++) {
                var result = results[i];
                var propertyURI = result.property.value;
                var propertyLabel = (result.propertyLabel || {}).value;
                var propertyTypesString = (result.propertyTypes || {}).value;
                var propertyTypes;
                if (propertyTypesString) {
                    propertyTypes = propertyTypesString.split(' ');
                } else {
                    propertyTypes = [];
                }
                var grandchildren = (result.numChildren || {}).value;
                var sampleValueType = (result.sampleValue || {}).type;
                var sampleValue = (result.sampleValue || {}).value;

                if (!propertyLabel) {
                    propertyLabel = simplifyURI(propertyURI);
                }

                var scaleOfMeasurement;
                switch (sampleValueType) {
                    case "literal":
                    case "typed-literal":
                        var datatype = result.sampleValue.datatype;
                        if (datatype) {
                            scaleOfMeasurement = predictRDFDatatypeSOM(datatype);
                        } else {
                            var parsedSampleValue = toScalar(sampleValue);
                            scaleOfMeasurement = predictValueSOM(parsedSampleValue);
                        }
                        break;
                    case "uri":
                    case "bnode":
                        scaleOfMeasurement = "Resource";
                        break;
                    default:
                        scaleOfMeasurement = "Nothing";
                        break;
                }

                var dataInfo = {
                    id: propertyURI,
                    label: propertyLabel,
                    grandchildren: parseInt(grandchildren) > 0 ? true : false,
                    role: predictRDFPropertyRole(propertyURI, propertyTypes),
                    type: scaleOfMeasurement
                };
                console.log('PROPERTY:');
                console.dir(dataInfo);
                console.log(propertyTypes);

                properties.push(dataInfo);
            }

            return properties;
        });
    }

    function predictRDFDatatypeSOM(datatype) {
        switch (datatype) {
            case "http://www.w3.org/2001/XMLSchema#float":
            case "http://www.w3.org/2001/XMLSchema#double":
            case "http://www.w3.org/2001/XMLSchema#decimal":
            case "http://www.w3.org/2001/XMLSchema#integer":
            case "http://www.w3.org/2001/XMLSchema#nonPositiveInteger":
            case "http://www.w3.org/2001/XMLSchema#negativeInteger":
            case "http://www.w3.org/2001/XMLSchema#long":
            case "http://www.w3.org/2001/XMLSchema#int":
            case "http://www.w3.org/2001/XMLSchema#short":
            case "http://www.w3.org/2001/XMLSchema#byte":
            case "http://www.w3.org/2001/XMLSchema#nonNegativeInteger":
            case "http://www.w3.org/2001/XMLSchema#unsignedLong":
            case "http://www.w3.org/2001/XMLSchema#unsignedInt":
            case "http://www.w3.org/2001/XMLSchema#unsignedShort":
            case "http://www.w3.org/2001/XMLSchema#unsignedByte":
            case "http://www.w3.org/2001/XMLSchema#positiveInteger":
                return "Quantitative";
            case "http://www.w3.org/2001/XMLSchema#dateTime":
            case "http://www.w3.org/2001/XMLSchema#date":
            case "http://www.w3.org/2001/XMLSchema#gYear":
            case "http://www.w3.org/2001/XMLSchema#gYearMonth":
                return "Interval";
            case "http://www.w3.org/2001/XMLSchema#string":
                return "Nominal";
            default:
                return "Categorical";
        }
    }

    function parse(endpoint, graph, selection) {
        var dimension = selection.dimension;
        var multidimension = selection.multidimension;
        var group = selection.group;
        var result = null;

        if (group.length > 0) {
            //CASE 1: dimension and grouped multidimension -> 1 dim; 1 mdim; just 1 group value;
            result = query_group(endpoint, graph, dimension, multidimension, group);

        } else {
            //CASES 2: dimension and/or multidimension -> 1 dim; 1..n mdim;
            var dimension_ = dimension.concat(multidimension);
            result = queryInstances(endpoint, graph, dimension_);
        }

        return result;
    }

    function query_group(endpoint, graph, dimension, multidimension, group) {
        var dimension = dimension[0];
        var multidimension = multidimension[0];
        var group = group[0];
        var class_ = multidimension.parent[0].id;
        var columnHeaders = [];
        var selectedVariablesArray = [];
        var optionals = "";
        var selectVariables = "";

        return group_by(endpoint, graph, group).then(function (groupInstances) {
            selectVariables += " ?d";
            selectedVariablesArray.push("d");
            columnHeaders.push(dimension.label);

            for (var i = 0; i < groupInstances.length; i++) {
                var groupInstance = groupInstances[i];
                selectVariables += " ?z" + i;
                columnHeaders.push(groupInstance.label);
                selectedVariablesArray.push("z" + i);

                optionals += '\nOPTIONAL {\n';
                optionals += ' ?x' + i + ' rdf:type <' + class_ + '> .\n';
                optionals += ' ?x' + i + ' <' + dimension.id + '> ?d.\n';
                optionals += ' ?x' + i + ' <' + multidimension.id + '> ?z' + i + '.\n';
                optionals += ' ?x' + i + ' <' + group.id + '> <' + groupInstance.id + '>.\n';
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

            console.log('SPARQL DATA MODULE - QUERY FOR GROUPES');
            console.dir(query);

            return sparqlProxyQuery(endpoint, query);
        }).then(function (queryResult) {
            return convert(queryResult, columnHeaders, selectedVariablesArray);
        });

    }

    function group_by(endpoint, graph, groupProperty) {
        var class_ = groupProperty.parent[0].id;

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

        return sparqlProxyQuery(endpoint, groupValuesQuery).then(function (result) {
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
        });
    }

    function queryInstances(endpoint, graph, properties) {
        var columnHeaders = [];
        var optionals = "";
        var selectVariables = "";
        var selectedVariablesArray = [];
        var class_ = properties[0].parent[0].id;
        var path = [];

        var nameExists = {};

        for (var i = 0; i < properties.length; i++) {
            var property = properties[i];
            path = property.parent;

            selectVariables += " ?z" + i;
            var header;
            if (!nameExists[property.label]) {
                header = property.label;
            } else {
                header = property.label + " " + i;
            }
            nameExists[header] = true;
            columnHeaders.push(header);
            selectedVariablesArray.push("z" + i);

            optionals += ' OPTIONAL ';
            optionals += ' { ';
            for (var j = 1; j < path.length; j++) {
                var variable_s = simplifyURI(path[j - 1].id) + (j - 1);
                if (j < path.length - 1) {
                    var variable_t = simplifyURI(path[j].id) + j;
                    optionals += '\n\
                    ?' + variable_s + ' <' + path[j].id + '> ?' + variable_t + '.\n';
                } else {
                    optionals += '\n\
                    ?' + variable_s + ' <' + path[j].id + '> ?z' + i + '.\n';
                }
            }
            optionals += ' } ';
        }

        var variable_s = simplifyURI(path[0].id) + '0';

        var query = '\n\
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n\
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\
            SELECT DISTINCT ' + selectVariables + '\n\
            WHERE {\n\
                GRAPH <' + graph + '> {\n\
                     ?' + variable_s + ' rdf:type <' + class_ + '>.\n\
                     ' + optionals + '\n\
                }\n\
            }';

        console.log('SPARQL DATA MODULE - DATA QUERY FOR VISUALIZATION CONFIGURATION');
        console.dir(query);

        return sparqlProxyQuery(endpoint, query).then(function (queryResult) {
            return convert(queryResult, columnHeaders, selectedVariablesArray);
        });
    }

    function convert(queryResults, columnHeaders, selectedVariablesArray) {
        var result = [];
        result.push(columnHeaders);
        for (var i = 0; i < queryResults.length; i++) {
            var queryResult = queryResults[i];
            var record = [];
            for (var j = 0; j < selectedVariablesArray.length; j++) {
                var p = selectedVariablesArray[j];
                var binding = queryResult[p];
                var val = resultToScalar(binding)
                if (_.isUndefined(val)) {
                    record.push(null);
                } else {
                    record.push(val);
                }
            }
            result.push(record);
        }

        console.log("SPARQL DATA MODULE - CONVERSION RESULT");
        console.dir(result);
        return result;
    }

    /*
     * Takes a variable binding from a json sparql result and converts it to a scalar
     */
    function resultToScalar(binding) {
        var value = binding.value;
        var type = binding.type;
        switch (type) {
            case "literal":
            case "typed-literal":
                var datatype = binding.datatype;
                if (datatype) {
                    return typedLiteralToScalar(value, datatype);
                } else {
                    // if no datatype is given, try same parsing algorithm as for CSV
                    return toScalar(value);
                }
                break;
            case "uri":
            case "bnode":
                return simplifyURI(value);
            default:
                return value;
        }
    }

    function typedLiteralToScalar(value, datatype) {
        switch (datatype) {
            case "http://www.w3.org/2001/XMLSchema#float":
            case "http://www.w3.org/2001/XMLSchema#double":
            case "http://www.w3.org/2001/XMLSchema#decimal":
                return parseFloat(value);
            case "http://www.w3.org/2001/XMLSchema#integer":
            case "http://www.w3.org/2001/XMLSchema#nonPositiveInteger":
            case "http://www.w3.org/2001/XMLSchema#negativeInteger":
            case "http://www.w3.org/2001/XMLSchema#long":
            case "http://www.w3.org/2001/XMLSchema#int":
            case "http://www.w3.org/2001/XMLSchema#short":
            case "http://www.w3.org/2001/XMLSchema#byte":
            case "http://www.w3.org/2001/XMLSchema#nonNegativeInteger":
            case "http://www.w3.org/2001/XMLSchema#unsignedLong":
            case "http://www.w3.org/2001/XMLSchema#unsignedInt":
            case "http://www.w3.org/2001/XMLSchema#unsignedShort":
            case "http://www.w3.org/2001/XMLSchema#unsignedByte":
            case "http://www.w3.org/2001/XMLSchema#positiveInteger":
                return parseInt(value);
            case "http://www.w3.org/2001/XMLSchema#dateTime":
            case "http://www.w3.org/2001/XMLSchema#date":
            case "http://www.w3.org/2001/XMLSchema#gYear":
            case "http://www.w3.org/2001/XMLSchema#gYearMonth":
                // TODO: Does Date.parse understand the xsd date etc. types?
                return Date.parse(value);
            case "http://www.w3.org/2001/XMLSchema#string":
                // Can plain literals be returned as xsd:string in newer 
                // versions of RDF/SPARQL? If so, uses toScalar here to handle
                // datasets with missing types
                return value;
            default:
                return value;
        }
    }

    return {
        queryClasses: queryClasses,
        queryProperties: queryProperties,
        queryInstances: queryInstances,
        parse: parse
    };
}();


