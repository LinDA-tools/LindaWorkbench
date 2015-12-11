var GraphStoreClient = require('graph-store-client');
var request = require('request');
var _ = require('lodash');

function store(vis_config, dataselection, config_id, config_name, config_graph, config_endpoint) {
    console.log("STORE VISUALIZATION CONFIGURATION");
    console.dir(JSON.stringify(vis_config));
    var datasource = dataselection['datasource'];
    console.dir(datasource);

    var query = "";

    query += 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n';
    query += 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \n';
    query += 'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> \n';
    query += 'PREFIX vis: <http://linda-project.eu/linda-visualization#> \n';
    query += 'PREFIX visconf: <http://linda-project.eu/visualization-configuration#> \n';

    query += "INSERT \n";
    query += "{ \n";

    query += "GRAPH <" + config_graph + "> \n";
    query += "{ \n";

    query += "visconf:VISCONFIG-" + config_id + " a vis:VisualizationConfiguration ; \n";
    query += " vis:configurationID '" + config_id + "'^^xsd:nonNegativeInteger ; \n";
    query += " vis:configurationName '" + config_name + "' ; \n";
    query += " vis:visualizationName '" + vis_config['visualizationName'] + "' ; \n";
    query += " vis:datasource ";

    query += ' [ \n';
    query += "  vis:datasourceName '" + datasource['name'] + "' ; \n";
    query += "  vis:datasourceLocation '" + datasource['location'] + "' ; \n";
    query += "  vis:datasourceGraph '" + datasource['graph'] + "' ; \n";
    query += "  vis:datasourceFormat '" + datasource['format'] + "' ; \n";
    query += ' ] ; \n';
    query += " vis:structureOption ";

    var structure_options = vis_config['structureOptions'];
    var option_count = 0;

    for (var option in structure_options) {
        option_count++;

        var minCardinality = structure_options[option]['minCardinality'];
        var maxCardinality = structure_options[option]['maxCardinality'];
        var scaleOfMeasurement = structure_options[option]['scaleOfMeasurement'];
        console.log('STORE scaleOfMeasurement:' + scaleOfMeasurement)

        query += " [ \n";
        query += "  a vis:Option ; \n";
        query += "  vis:optionName '" + structure_options[option]['optionName'] + "' ; \n";
        query += "  vis:optionId '" + option + "' ; \n";

        query += "  vis:optionType [\n ";
        if (minCardinality) {
            query += "   vis:minCardinality " + minCardinality + ";\n ";
        }
        if (maxCardinality) {
            query += "   vis:maxCardinality " + maxCardinality + ";\n ";
        }
        if (scaleOfMeasurement) {
            query += "   vis:scaleOfMeasurement [\n ";
            query += "    rdfs:label '" + scaleOfMeasurement + "'\n ";
            query += "   ];"
        }
        query += "];"


        var option_values = structure_options[option]['value'];

        if (option_values.length > 0) {
            query += "  vis:optionValue  ";
            for (var v = 0; v < option_values.length; v++) {

                var option_value_path = structure_options[option]['value'][v]['parent'];
                var property_name = structure_options[option]['value'][v]['label'];

                query += "[ \n";
                query += "   vis:propertyName '" + property_name + "' ; \n";
                query += "   vis:propertyId '" + structure_options[option]['value'][v]['key'] + "' ; \n";
                query += "   vis:contents ";
                query += "( ";

                for (var p = 0; p < option_value_path.length; p++) {
                    query += "'" + option_value_path[p]['id'] + "' ";
                }

                query += ") \n";

                if (v === option_values.length - 1) {
                    query += "  ] ; \n";
                } else {
                    query += "  ] , \n";
                }
            }
        }

        if (option_count === _.size(structure_options)) {
            query += " ] . \n";
        } else {
            query += " ] , \n";
        }
    }


    var layout_options = vis_config['layoutOptions'];
    var option_count = 0;

    if (Object.keys(layout_options).length > 0) {
        query += "visconf:VISCONFIG-" + config_id + " vis:layoutOption ";
    }
    for (var option in layout_options) {
        option_count++;

        query += "[ \n";
        query += "  a vis:Option ; \n";
        query += "  vis:optionName '" + layout_options[option]['optionName'] + "' ; \n";
        query += "  vis:optionId '" + option + "' ; \n";
        query += "  vis:optionType '" + layout_options[option]['type'] + "' ; \n";
        query += "  vis:optionValue '" + layout_options[option]['value'] + "' ; \n";

        if (option_count === _.size(layout_options)) {
            query += " ] . \n";
        } else {
            query += " ] , \n";
        }
    }

    query += "} \n";
    query += "} WHERE {} \n";

    console.log("STORE VISUALIZATION CONFIGURATION - INSERT QUERY");
    console.log(query);
	console.log('Endpoint: ' + config_endpoint);
	request.post(
		config_endpoint,
		{ form: { 'update': query } },
		function(error, response, body) {
		  console.log(body);
		});

    /*var client = new GraphStoreClient(config_endpoint, null);
    return client.query(query).then(function (result, err) {
        if (err) {
            console.log('visualization_backend: Could not execute insert query: ' + err);
            return;
        }
        console.log("SPARQL_RESULT");
        console.dir(result);
        return result;
    });*/
}

function remove(config_id, config_graph, config_endpoint) {
    console.log("REMOVE VISUALIZATION CONFIGURATION");

    var query = "";

    query += 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n';
    query += 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \n';
    query += 'PREFIX xsd: <removehttp://www.w3.org/2001/XMLSchema#> \n';
    query += 'PREFIX vis: <http://linda-project.eu/linda-visualization#> \n';
    query += 'PREFIX visconf: <http://linda-project.eu/visualization-configuration#> \n';

    query += "DELETE \n";
    query += "{ \n";
    query += "GRAPH <" + config_graph + "> \n";
    query += "{ \n";
    query += " ?configuration a vis:VisualizationConfiguration . \n";
    query += " ?configuration vis:configurationID '" + config_id + "'^^xsd:nonNegativeInteger . \n";
    query += " ?configuration vis:configurationName ?configurationName . \n";
    query += " ?configuration vis:visualizationName ?visualizationName . \n";
    query += " ?configuration vis:datasource ?datasource. \n";
    query += " ?configuration vis:structureOption ?structureOption. \n";
    query += " ?configuration vis:layoutOption ?layoutOption . \n";
    query += " ?datasource vis:datasourceName ?datasourceName . \n";
    query += " ?datasource vis:datasourceLocation ?datasourceLocation . \n";
    query += " ?datasource vis:datasourceGraph ?datasourceGraph . \n";
    query += " ?datasource vis:datasourceFormat ?datasourceFormat . \n";
    query += " ?structureOption a vis:Option . \n";
    query += " ?structureOption vis:optionName ?optionName . \n";
    query += " ?structureOption vis:optionValue ?optionValue . \n";
    query += " ?optionValue vis:propertyName ?propertyName . \n";
    query += " ?optionValue vis:propertyId ?propertyId . \n";
    query += " ?optionValue vis:contents ?c1 . \n";
    query += " ?c1  rdf:first  ?v1 . \n";
    query += " ?c1  rdf:rest   ?c2 . \n";
    query += " ?c2  rdf:first  ?v2 . \n";
    query += " ?c2  rdf:rest   ?c3 . \n";
    query += " ?c3  rdf:first  ?v3 . \n";
    query += " ?c3  rdf:rest   ?c4 . \n";
    query += " ?c4  rdf:first  ?v4 . \n";
    query += " ?c4  rdf:rest   ?c5 . \n";
    query += " ?c5  rdf:first  ?v5 . \n";
    query += " ?c5  rdf:rest   ?c6 . \n";
    query += " ?c6  rdf:first  ?v6 . \n";
    query += " ?c6  rdf:rest   ?c7 . \n";
    query += " ?c7  rdf:first  ?v7 . \n";
    query += " ?c7  rdf:rest   ?c8 . \n";
    query += " ?c8  rdf:first  ?v8 . \n";
    query += " ?c8  rdf:rest   ?c9 . \n";
    query += " ?c9  rdf:first  ?v9 . \n";
    query += " ?c9  rdf:rest  ?c10 . \n";
    query += " ?c10 rdf:first ?v10 . \n";
    query += " ?layoutOption a vis:Option . \n";
    query += " ?layoutOption vis:optionName ?optionName . \n";
    query += " ?layoutOption vis:optionValue ?optionValue . \n";
    query += "} \n";
    query += "} \n";
    query += "WHERE \n";
    query += "{ \n";
    query += "GRAPH <" + config_graph + "> \n";
    query += "{ \n";
    query += " OPTIONAL { ?configuration a vis:VisualizationConfiguration  } . \n";
    query += " OPTIONAL { ?configuration vis:configurationID '" + config_id + "'^^xsd:nonNegativeInteger  } . \n";
    query += " OPTIONAL { ?configuration vis:configurationName ?configurationName  } . \n";
    query += " OPTIONAL { ?configuration vis:visualizationName ?visualizationName  } . \n";
    query += " OPTIONAL { ?configuration vis:datasource ?datasource  } . \n";
    query += " OPTIONAL { ?configuration vis:structureOption ?structureOption  } . \n";
    query += " OPTIONAL { ?configuration vis:layoutOption ?layoutOption  } . \n";
    query += " OPTIONAL { ?datasource vis:datasourceName ?datasourceName  } . \n";
    query += " OPTIONAL { ?datasource vis:datasourceLocation ?datasourceLocation  } . \n";
    query += " OPTIONAL { ?datasource vis:datasourceGraph ?datasourceGraph  } . \n";
    query += " OPTIONAL { ?datasource vis:datasourceFormat ?datasourceFormat  } . \n";
    query += " OPTIONAL { ?structureOption a vis:Option  } . \n";
    query += " OPTIONAL { ?structureOption vis:optionName ?optionName  } . \n";
    query += " OPTIONAL { ?structureOption vis:optionValue ?optionValue  } . \n";
    query += " OPTIONAL { ?optionValue vis:propertyName ?propertyName  } . \n";
    query += " OPTIONAL { ?optionValue vis:propertyId ?propertyId  } . \n";
    query += " OPTIONAL { ?optionValue vis:contents ?c1  } . \n";
    query += " OPTIONAL { ?c1  rdf:first  ?v1  } . \n";
    query += " OPTIONAL { ?c1  rdf:rest   ?c2  } . \n";
    query += " OPTIONAL { ?c2  rdf:first  ?v2  } . \n";
    query += " OPTIONAL { ?c2  rdf:rest   ?c3  } . \n";
    query += " OPTIONAL { ?c3  rdf:first  ?v3  } . \n";
    query += " OPTIONAL { ?c3  rdf:rest   ?c4  } . \n";
    query += " OPTIONAL { ?c4  rdf:first  ?v4  } . \n";
    query += " OPTIONAL { ?c4  rdf:rest   ?c5  } . \n";
    query += " OPTIONAL { ?c5  rdf:first  ?v5  } . \n";
    query += " OPTIONAL { ?c5  rdf:rest   ?c6  } . \n";
    query += " OPTIONAL { ?c6  rdf:first  ?v6  } . \n";
    query += " OPTIONAL { ?c6  rdf:rest   ?c7  } . \n";
    query += " OPTIONAL { ?c7  rdf:first  ?v7  } . \n";
    query += " OPTIONAL { ?c7  rdf:rest   ?c8  } . \n";
    query += " OPTIONAL { ?c8  rdf:first  ?v8  } . \n";
    query += " OPTIONAL { ?c8  rdf:rest   ?c9  } . \n";
    query += " OPTIONAL { ?c9  rdf:first  ?v9  } . \n";
    query += " OPTIONAL { ?c9  rdf:rest  ?c10  } . \n";
    query += " OPTIONAL { ?c10 rdf:first ?v10  } . \n";
    query += " OPTIONAL { ?layoutOption a vis:Option  } . \n";
    query += " OPTIONAL { ?layoutOption vis:optionName ?optionName  } . \n";
    query += " OPTIONAL { ?layoutOption vis:optionValue ?optionValue  } . \n";
    query += "} \n";
    query += "} \n";

    console.log("REMOVE VISUALIZATION CONFIGURATION - DELETE QUERY");
    console.log(query);

    var client = new GraphStoreClient(config_endpoint, null);
    return client.query(query).then(function (result, err) {
        if (err) {
            console.log('visualization_backend: Could not execute DELETE query: ' + err);
            return;
        }
        console.log("SPARQL_RESULT");
        console.dir(result);
        return result;
    });
}

exports.store = store;
exports.remove = remove;
