var GraphStoreClient = require('graph-store-client');
var _ = require('lodash');

function query(graph, endpoint) {
    console.log("QUERY VISUALIZATIONS LIST");

    var client = new GraphStoreClient(endpoint, null);

    var visualizations = {};

    return client.query(visualizationQuery(graph)).then(function (results, err) {

        // console.log("SPARQL RESULT VISUALIZATION TYPE");
        // console.dir(results);

        for (var i = 0; i < results.length; i++) {
            var option = results[i];
            var visualizationName_ = option['visualizationName']['value'];

            if (visualizations[visualizationName_]) {
                visualizations[visualizationName_]['visualizationType'].push(option['visualizationType']['value']);
            } else {
                visualizations[visualizationName_] = {
                    id: Math.floor(100000000 + Math.random() * 900000000),
                    visualizationName: option['visualizationName']['value'],
                    visualizationType: [option['visualizationType']['value']],
                    structureOptions: {},
                    layoutOptions: {}
                };
            }
        }

        return client.query(structureOptionsQuery(graph)).then(function (results, err) {

            //console.log("SPARQL RESULT VISUALIZATIONS STRUCTURE OPTIONS");
            //console.dir(results);

            for (var i = 0; i < results.length; i++) {
                var option = results[i];
                var visualizationName_ = option['visualizationName']['value'];
                var structureOptionName_ = option['structureOptionName']['value'];

                if (visualizations[visualizationName_]['structureOptions'][structureOptionName_]) {
                    visualizations[visualizationName_]['structureOptions'][structureOptionName_]['metadata'].push(option['scaleOfMeasurement']['value']);
                } else {
                    visualizations[visualizationName_]['structureOptions'][structureOptionName_] = {
                        optionName: structureOptionName_,
                        type: 'dimension',
                        scaleOfMeasurement: option['scaleOfMeasurement']['value'],
                        metadata: [option['scaleOfMeasurement']['value']],
                        minCardinality: parseInt((option['minCardinality'] || {})['value']),
                        maxCardinality: parseInt((option['maxCardinality'] || {})['value']),
                        value: []
                    };
                }

            }

            return client.query(layoutOptionsQuery(graph)).then(function (results, err) {

                //console.log("SPARQL RESULT VISUALIZATIONS LAYOUT OPTIONS");
                //console.dir(results);

                for (var i = 0; i < results.length; i++) {
                    var option = results[i];
                    var visualizationName_ = option['visualizationName']['value'];
                    var layoutOptionName_ = option['layoutOptionName']['value'];

                    visualizations[visualizationName_]['layoutOptions'][layoutOptionName_] = {
                        optionName: layoutOptionName_,
                        type: simplifyURI(option['layoutOptionType']['value']),
                        value: option['layoutOptionValue']['value']
                    };
                }

                // console.log("VISUALIZATIONS LIST ");
                // console.dir(JSON.stringify(visualizations));
                return visualizations;
            });
        });
    });
}

function visualizationQuery(graph) {
    var query = "";

    query += 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n';
    query += 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \n';
    query += 'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> \n';
    query += 'PREFIX vis: <http://linda-project.eu/linda-visualization#> \n';
    query += 'PREFIX visconf: <http://linda-project.eu/visualization-configuration#> \n';

    query += "SELECT  ";
    query += "?visualizationName ?visualizationType  \n ";
    query += "WHERE \n";
    query += "{ \n";
    query += "GRAPH <" + graph + "> \n";
    query += "{ \n";
    query += "?visualization a vis:Visualization .\n ";
    query += "?visualization vis:visualizationName ?visualizationName .\n ";
    query += "?visualization vis:visualizationType ?type .\n ";
    query += "?type rdfs:label ?visualizationType .\n ";
    //query += "?visualization vis:visualizationThumbnail ?visualizationThumbnail .\n ";

    query += "} \n";
    query += "} \n";

    // console.log("QUERY VISUALIZATION DETAILS");
    //console.log(query);

    return query;
}

function structureOptionsQuery(graph) {
    var query = "";

    query += 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n';
    query += 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \n';
    query += 'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> \n';
    query += 'PREFIX vis: <http://linda-project.eu/linda-visualization#> \n';
    query += 'PREFIX visconf: <http://linda-project.eu/visualization-configuration#> \n';

    query += "SELECT  ";
    query += "?visualizationName ?structureOptionName ?minCardinality ?maxCardinality ?scaleOfMeasurement \n ";
    query += "WHERE \n";
    query += "{ \n";
    query += "GRAPH <" + graph + "> \n";
    query += "{ \n";
    query += "?visualization a vis:Visualization .\n ";
    query += "?visualization vis:visualizationName ?visualizationName .\n ";
    query += "?visualization vis:structureOption ?structureOption .\n ";
    query += "?structureOption vis:optionName ?structureOptionName .\n ";
    query += "?structureOption vis:optionType ?structureOptionType .\n ";
    query += "OPTIONAL {?structureOptionType vis:minCardinality ?minCardinality} .\n ";
    query += "OPTIONAL {?structureOptionType vis:maxCardinality ?maxCardinality} .\n ";
    query += "?structureOptionType vis:scaleOfMeasurement ?scale .\n ";
    query += "?scale rdfs:label ?scaleOfMeasurement .\n ";

    query += "} \n";
    query += "} \n";

    // console.log("QUERY VISUALIZATIONS - STRUCTURE OPTIONS");
    //console.log(query);

    return query;
}

function layoutOptionsQuery(graph) {
    var query = "";

    query += 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n';
    query += 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \n';
    query += 'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> \n';
    query += 'PREFIX vis: <http://linda-project.eu/linda-visualization#> \n';
    query += 'PREFIX visconf: <http://linda-project.eu/visualization-configuration#> \n';

    query += "SELECT  ";
    query += "?visualizationName ?layoutOptionName ?layoutOptionType ?layoutOptionValue \n ";
    query += "WHERE \n";
    query += "{ \n";
    query += "GRAPH <" + graph + "> \n";
    query += "{ \n";

    query += "?visualization a vis:Visualization .\n ";
    query += "?visualization vis:visualizationName ?visualizationName .\n ";
    query += "?visualization vis:layoutOption ?layoutOption .\n ";
    query += "?layoutOption vis:optionName ?layoutOptionName .\n ";
    query += "?layoutOption vis:optionType ?layoutOptionType .\n ";
    query += "?layoutOption vis:optionValue ?layoutOptionValue .\n ";

    query += "} \n";
    query += "} \n";

    // console.log("QUERY VISUALIZATIONS - LAYOUT OPTIONS");
    // console.log(query);

    return query;
}

function simplifyURI(uri) {
    var splits = uri.split(/[#/:]/);
    return splits[splits.length - 1];
}

exports.query = query;