var GraphStoreClient = require('graph-store-client');
var _ = require('lodash');
var Q = require('q');
Q.longStackSupport = true;

function query(config_id, config_graph, config_endpoint) {
    console.log("QUERY VISUALIZATION CONFIGURATION WITH ID " + config_id);

    var client = new GraphStoreClient(config_endpoint, null);

    var datasource = {id: Math.floor(Math.random() * 1000000000).toString()};
    var dataselection = {id: Math.floor(Math.random() * 1000000000).toString(), datasource: datasource, propertyInfos: []};
    var configuration = {id: config_id, structureOptions: {}, layoutOptions: {}, dataselection: dataselection.id, valid: true};

    return client.query(datasourceQuery(config_id, config_graph)).then(function (results, err) {

        console.log("SPARQL RESULT VIS DETAILS");
        console.dir(results);

        if (results.length === 0) {
            console.log("NO CONFIGURATIONS FOUND!")
            return [];
        }

        configuration['visualizationName'] = results[0]['visualizationName']['value'];
        configuration['configurationName'] = results[0]['configurationName']['value'];

        datasource['name'] = results[0]['datasourceName']['value'];
        datasource['location'] = results[0]['datasourceLocation']['value'];
        datasource['graph'] = (results[0]['datasourceGraph'] || {})['value'];
        datasource['format'] = results[0]['datasourceFormat']['value'];

        return client.query(structureOptionsQuery(config_id, config_graph)).then(function (results, err) {

            console.log("SPARQL RESULT STRUCTURE OPTIONS");
            console.dir(results);

            for (var i = 0; i < results.length; i++) {
                var option = results[i];
                var value_count = 1;
                var parent = [];

                while (option['value' + value_count]) {
                    var parentURI = option['value' + value_count]['value']
                    parent.push({id: parentURI, label: simplifyURI(parentURI)});
                    value_count++;
                }

                var id = option['structureOptionId']['value'];

                if (option['propertyName']) {
                    var propertyInfo = {
                        label: option['propertyName']['value'],
                        key: option['propertyId']['value'],
                        parent: parent
                    };
                    dataselection.propertyInfos.push(propertyInfo);
                    if (configuration['structureOptions'][id]) {
                        configuration['structureOptions'][id]['value'].push(propertyInfo);
                    } else {
                        configuration['structureOptions'][id] = {
                            optionName: option['structureOptionId']['value'],
                            type: 'dimension',
                            metadata: [],
                            minCardinality: parseInt((option['minCardinality'] || {})['value']),
                            maxCardinality: parseInt((option['maxCardinality'] || {})['value']),
                            value: [propertyInfo]
                        };
                    }
                } else {
                    configuration['structureOptions'][id] = {
                        optionName: option['structureOptionId']['value'],
                        type: 'dimension',
                        metadata: [],
                        minCardinality: parseInt((option['minCardinality'] || {})['value']),
                        maxCardinality: parseInt((option['maxCardinality'] || {})['value']),
                        value: []
                    };
                }

                if (option["scaleOfMeasurement"]) {
                    var scaleOfMeasurement = option["scaleOfMeasurement"]["value"];
                    configuration['structureOptions'][id]['scaleOfMeasurement'] = scaleOfMeasurement;

                    if (!_.contains(configuration['structureOptions'][id]['metadata'], scaleOfMeasurement)) {
                        configuration['structureOptions'][id]['metadata'].push(scaleOfMeasurement);
                    }
                }
            }
            return client.query(layoutOptionsQuery(config_id, config_graph)).then(function (results, err) {

                console.log("SPARQL RESULT LAYOUT OPTIONS");
                console.dir(results);

                for (var i = 0; i < results.length; i++) {
                    var option = results[i];
                    var id = option['layoutOptionId']['value'];
                    configuration['layoutOptions'][id] = {
                        optionName: id,
                        type: simplifyURI(option['layoutOptionType']['value']),
                        value: option['layoutOptionValue']['value']
                    };
                }

                console.log("VISUALIZATION CONFIGURATION");
                console.dir(JSON.stringify(configuration));

                return {
                    visualization: configuration,
                    dataselection: dataselection,
                    datasource: datasource
                };
            });
        });
    });


}

function datasourceQuery(config_id, config_graph) {
    var query = "";

    query += 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n';
    query += 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \n';
    query += 'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> \n';
    query += 'PREFIX vis: <http://linda-project.eu/linda-visualization#> \n';
    query += 'PREFIX visconf: <http://linda-project.eu/visualization-configuration#> \n';

    query += "SELECT  ";
    query += "?visualizationName ?configurationName ?visualizationThumbnail ?datasourceName ?datasourceFormat ?datasourceLocation ?datasourceGraph \n ";
    query += "WHERE \n";
    query += "{ \n";
    query += "GRAPH <" + config_graph + "> \n";
    query += "{ \n";
    query += "visconf:VISCONFIG-" + config_id + " vis:visualizationName ?visualizationName .\n ";
    query += "visconf:VISCONFIG-" + config_id + " vis:configurationName ?configurationName .\n ";
    query += "visconf:VISCONFIG-" + config_id + " vis:datasource ?datasource .\n ";
    query += "?datasource vis:datasourceName ?datasourceName .\n ";
    query += "?datasource vis:datasourceFormat ?datasourceFormat .\n ";
    query += "?datasource vis:datasourceLocation ?datasourceLocation .\n ";
    query += "OPTIONAL ";
    query += "{ \n";
    query += "?datasource vis:datasourceGraph ?datasourceGraph .\n ";
    query += "} \n";
    query += "} \n";
    query += "} \n";

    console.log("QUERY VISUALIZATION CONFIGURATION - QUERY DETAILS");
    console.log(query);

    return query;
}

function structureOptionsQuery(config_id, config_graph) {
    var query = "";

    query += 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n';
    query += 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \n';
    query += 'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> \n';
    query += 'PREFIX vis: <http://linda-project.eu/linda-visualization#> \n';
    query += 'PREFIX visconf: <http://linda-project.eu/visualization-configuration#> \n';

    query += "SELECT  ";
    query += "?structureOptionName ?structureOptionId ?propertyName ?propertyId ?minCardinality ?maxCardinality ?scaleOfMeasurement ?value1 ?value2 ?value3 ?value4 ?value5 ?value6 ?value7 ?value8 ?value9 ?value10 \n ";
    query += "WHERE \n";
    query += "{ \n";
    query += "GRAPH <" + config_graph + "> \n";
    query += "{ \n";

    query += "visconf:VISCONFIG-" + config_id + " vis:structureOption ?structureOption .\n ";
    query += "?structureOption vis:optionName ?structureOptionName .\n ";
    query += "?structureOption vis:optionId ?structureOptionId .\n ";

    query += "OPTIONAL {\n ";
    query += " ?structureOption vis:optionType ?structureOptionType .\n ";
    query += " OPTIONAL {?structureOptionType vis:minCardinality ?minCardinality} .\n ";
    query += " OPTIONAL {?structureOptionType vis:maxCardinality ?maxCardinality} .\n ";
    query += " OPTIONAL {\n ";
    query += "  ?structureOptionType vis:scaleOfMeasurement ?scale .\n ";
    query += "  ?scale rdfs:label ?scaleOfMeasurement .\n ";
    query += " } .\n ";
    query += "} .\n ";

    query += "OPTIONAL { \n ";
    query += " ?structureOption vis:optionValue ?structureOptionValue .\n ";
    query += " ?structureOptionValue vis:propertyName ?propertyName .\n ";
    query += " ?structureOptionValue vis:propertyId ?propertyId .\n ";
    // Should be good enough for now but is there no standard way to query a whole list with guaranteed order in a single query?
    query += " ?structureOptionValue vis:contents/rdf:first ?value1 .\n ";
    query += " OPTIONAL ";
    query += " { \n";
    query += " ?structureOptionValue vis:contents/rdf:rest/rdf:first ?value2 .\n ";
    query += " OPTIONAL ";
    query += " { \n";
    query += " ?structureOptionValue vis:contents/rdf:rest/rdf:rest/rdf:first ?value3 .\n ";
    query += " OPTIONAL ";
    query += " { \n";
    query += " ?structureOptionValue vis:contents/rdf:rest/rdf:rest/rdf:rest/rdf:first ?value4 .\n ";
    query += " OPTIONAL ";
    query += " { \n";
    query += " ?structureOptionValue vis:contents/rdf:rest/rdf:rest/rdf:rest/rdf:rest/rdf:first ?value5 .\n ";
    query += " OPTIONAL ";
    query += " { \n";
    query += " ?structureOptionValue vis:contents/rdf:rest/rdf:rest/rdf:rest/rdf:rest/rdf:rest/rdf:first ?value6 .\n ";
    query += " OPTIONAL ";
    query += " { \n";
    query += " ?structureOptionValue vis:contents/rdf:rest/rdf:rest/rdf:rest/rdf:rest/rdf:rest/rdf:rest/rdf:first ?value7 .\n ";
    query += " OPTIONAL ";
    query += " { \n";
    query += " ?structureOptionValue vis:contents/rdf:rest/rdf:rest/rdf:rest/rdf:rest/rdf:rest/rdf:rest/rdf:rest/rdf:first ?value8 .\n ";
    query += " OPTIONAL ";
    query += " { \n";
    query += " ?structureOptionValue vis:contents/rdf:rest/rdf:rest/rdf:rest/rdf:rest/rdf:rest/rdf:rest/rdf:rest/rdf:rest/rdf:first ?value9 .\n ";
    query += " OPTIONAL ";
    query += " { \n";
    query += " ?structureOptionValue vis:contents/rdf:rest/rdf:rest/rdf:rest/rdf:rest/rdf:rest/rdf:rest/rdf:rest/rdf:rest/rdf:rest/rdf:first ?value10 .\n ";
    query += "} \n";
    query += "} \n";
    query += "} \n";
    query += "} \n";
    query += "} \n";
    query += "} \n";
    query += "} \n";
    query += "} \n";
    query += "} \n";
    query += "} \n";

    query += "} \n";
    query += "} \n";

    console.log("LOAD VISUALIZATION CONFIGURATION - QUERY STRUCTURE OPTIONS");
    console.log(query);

    return query;
}

function layoutOptionsQuery(config_id, config_graph) {
    var query = "";

    query += 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n';
    query += 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \n';
    query += 'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> \n';
    query += 'PREFIX vis: <http://linda-project.eu/linda-visualization#> \n';
    query += 'PREFIX visconf: <http://linda-project.eu/visualization-configuration#> \n';

    query += "SELECT  ";
    query += "?layoutOptionName ?layoutOptionType ?layoutOptionValue ?layoutOptionId \n ";
    query += "WHERE \n";
    query += "{ \n";
    query += "GRAPH <" + config_graph + "> \n";
    query += "{ \n";

    query += "visconf:VISCONFIG-" + config_id + " vis:layoutOption ?layoutOption .\n ";
    query += "?layoutOption vis:optionName ?layoutOptionName .\n ";
    query += "?layoutOption vis:optionId ?layoutOptionId .\n ";
    query += "?layoutOption vis:optionType ?layoutOptionType .\n ";
    query += "?layoutOption vis:optionValue ?layoutOptionValue .\n ";

    query += "} \n";
    query += "} \n";

    console.log("QUERY VISUALIZATION CONFIGURATION - QUERY LAYOUT OPTIONS");
    console.log(query);

    return query;
}

function queryAll(config_graph, config_endpoint) {
    console.log("QUERY ALL VISUALIZATION CONFIGURATIONS");

    var client = new GraphStoreClient(config_endpoint, null);

    return queryIDs(config_graph, config_endpoint).then(function (config_ids, err) {
        var promises = [];

        for (var i = 0; i < config_ids.length; i++) {
            var config_id = config_ids[i];
            var promise = query(config_id, config_graph, config_endpoint);
            promises.push(promise);
        }

        return Q.all(promises);
    });
}

function queryIDs(config_graph, config_endpoint) {
    console.log("QUERY VISUALIZATION CONFIGURATION IDS");

    var query = "";

    query += 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n';
    query += 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \n';
    query += 'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> \n';
    query += 'PREFIX vis: <http://linda-project.eu/linda-visualization#> \n';
    query += 'PREFIX visconf: <http://linda-project.eu/visualization-configuration#> \n';

    query += "SELECT DISTINCT ?configurationID ?configurationName \n ";
    query += "WHERE \n";
    query += "{ \n";
    query += "GRAPH <" + config_graph + "> \n";
    query += "{ \n";
    query += "?configuration a vis:VisualizationConfiguration ; \n";
    query += "  vis:configurationID ?configurationID ;\n ";
    query += "  vis:configurationName ?configurationName .\n ";
    query += "} \n";
    query += "} \n";

    var client = new GraphStoreClient(config_endpoint, null);

    return client.query(query).then(function (results, err) {


        var configurations = [];
        for (var i = 0; i < results.length; i++) {
            var option = results[i];
            var id = option['configurationID']['value'];
            var name = option['configurationName']['value'];

            configurations.push({
                id: id,
                configurationName: name
            });
        }
        console.log("ID RESULT");
        console.dir(configurations);

        return configurations;

    });
}

function simplifyURI(uri) {
    var splits = uri.split(/[#/:]/);
    return splits[splits.length - 1];
}

exports.query = query;
exports.queryIDs = queryIDs;
exports.queryAll = queryAll;
