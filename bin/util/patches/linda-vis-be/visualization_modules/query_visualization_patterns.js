var GraphStoreClient = require('graph-store-client');
var _ = require('lodash');

function query(ontology_graph, ontology_endpoint) {
    console.log("QUERY VISUALIZATION PATTERNS");

    var client = new GraphStoreClient(ontology_endpoint, null);

    var query = "";

    query += 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n';
    query += 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \n';
    query += 'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> \n';
    query += 'PREFIX vis: <http://linda-project.eu/linda-visualization#> \n';
    query += 'PREFIX visconf: <http://linda-project.eu/visualization-configuration#> \n';

    query += "SELECT  ";
    query += "?visualizationName ?optionName ?minCardinality ?maxCardinality ?scaleOfMeasurement ?dimensionRole ?associatedProperty \n ";
    query += "WHERE \n";
    query += "{ \n";
    query += "GRAPH <" + ontology_graph + "> \n";
    query += "{ \n";
    query += "?visualization a vis:Visualization .\n ";
    query += "?visualization vis:visualizationName ?visualizationName  .\n ";
    query += "?visualization vis:structureOption ?structureOption .\n ";
    query += "?structureOption vis:optionName ?optionName .\n ";
    query += "?structureOption vis:optionType ?optionType .\n ";
    query += "OPTIONAL { ?optionType vis:minCardinality ?minCardinality .}\n ";
    query += "OPTIONAL { ?optionType vis:maxCardinality ?maxCardinality .}\n ";
    query += "?optionType vis:scaleOfMeasurement ?scale .\n ";
    query += "?scale rdfs:label ?scaleOfMeasurement .\n ";
    query += "OPTIONAL {\n";
    query += " ?optionType vis:dimensionRole ?dimensionRole . \n"
    query += "} \n ";
    query += "OPTIONAL { ?optionType vis:associatedProperty ?associatedProperty . } \n ";
    query += "} \n";
    query += "} \n";

    // console.log("QUERY VISUALIZATIONS PATTERNS");
    // console.log(query);

    var patterns = {};

    return client.query(query).then(function (results, err) {

        // console.log("SPARQL RESULT VISUALIZATION PATTERNS");
        // console.dir(results);

        for (var i = 0; i < results.length; i++) {
            var option = results[i];

            var visualizationName_ = option['visualizationName']['value'];
            var optionName_ = option['optionName']['value'];

            if (patterns[visualizationName_]) {
                if (patterns[visualizationName_][optionName_]) {
                    patterns[visualizationName_][optionName_]['scalesOfMeasurement'].push(option['scaleOfMeasurement']['value']);
                } else {
                    patterns[visualizationName_][optionName_] = {
                        optionName: option['optionName']['value'],
                        scalesOfMeasurement: [option['scaleOfMeasurement']['value']],
                        dimensionRole: (option['dimensionRole'] || {})['value'],
                        associatedProperty: (option['associatedProperty'] || {})['value'],
                        minCardinality: parseInt(option['minCardinality'] || {})['value'],
                        maxCardinality: parseInt(option['maxCardinality'] || {})['value']
                    };
                }
            } else {
                patterns[visualizationName_] = {};
                patterns[visualizationName_][optionName_] = {
                    optionName: option['optionName']['value'],
                    scalesOfMeasurement: [option['scaleOfMeasurement']['value']],
                    dimensionRole: (option['dimensionRole'] || {})['value'],
                    associatedProperty: (option['associatedProperty'] || {})['value'],
                    minCardinality: parseInt(option['minCardinality'] || {})['value'],
                    maxCardinality: parseInt(option['maxCardinality'] || {})['value']
                };
            }
        }

        // console.log("VISUALIZATION PATTERNS ");
        // console.dir(JSON.stringify(patterns));
        return patterns;
    });
}

exports.query = query;