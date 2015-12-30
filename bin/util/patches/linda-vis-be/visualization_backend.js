var http = require('http');
var GraphStoreClient = require('graph-store-client');
var express = require('express');
var store_visualization = require('./visualization_modules/store_visualization_config.js');
var query_visualization = require('./visualization_modules/query_visualization_config.js');
var visualization_recommendation = require('./visualization_recommendation.js');
var config = require('./config.js');
var _ = require('lodash');
var Q = require('q');
Q.longStackSupport = true;

var printError = function (error) {
    console.error("ERROR: " + error.stack);
    //res.status(500).send({error: 'Internal error'});
};

//CORS middleware
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
};

// Web Server
var app = express();

app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(allowCrossDomain);
    app.use('/thumbnails', express.static(__dirname + '/thumbnails'));
    app.use('/testsets', express.static(__dirname + '/testsets'));
});

var datasources = {};
app.post('/datasources', function (req, res) {
    var datasource = req.body.datasource;
    var id = Math.floor(Math.random() * 1000000000).toString();
    datasource.id = id;
    datasources[id] = datasource;

    // console.dir(datasource);

    res.send({datasource: datasource});
});

var dataselections = {};
app.post('/dataselections', function (req, res) {
    console.log("POST DATASELECTION");

    var dataselection = req.body.dataselection;
    // console.dir(JSON.stringify(dataselection));
    // console.log("POSTED DATASELECTION");
    var datasource = dataselection.datasource;
    var id = Math.floor(Math.random() * 1000000000).toString();
    var dataselection = {
        id: id,
        datasource: datasource,
        propertyInfos: dataselection.propertyInfos
    };

    dataselections[id] = dataselection;
    //console.log("RETURNED DATASELECTION");
    //console.dir(JSON.stringify(dataselection));

    res.send({
        dataselection: dataselection
    });
});

app.get('/dataselections/:id', function (req, res) {
    var selectionID = req.param("id");
    var dataselection = dataselections[selectionID];
    var datasourceID = dataselection.datasource.id;
    var datasource = datasources[datasourceID];

    dataselection['datasource'] = datasource;

    console.log("GET DATASELECTION");
    console.dir(JSON.stringify(dataselection));

    res.send({
        dataselection: dataselection
    });
});

app.get('/datasources/:id', function (req, res) {
    var datasourceID = req.param("id");
    var datasource = datasources[datasourceID];

    console.log("GET DATASOURCE");
    console.dir(JSON.stringify(datasource));

    res.send({
        datasource: datasource
    });
});

app.get('/sparql-proxy/:endpoint/:query', function (req, res) {
    var query = req.param("query");
    var endpoint = req.param("endpoint");
    var client = new GraphStoreClient(endpoint, null);

    client.query(query).then(function (result, err) {
        if (err) {
            console.log('visualization_backend: Could not execute query: ' + err);
            return;
        }
        // console.log("SPARQL_RESULT");


        res.send(result);
    }, printError);
});





var recommendationsByDataselectionID = {};
var visualizationConfigurations = {};



//visualization configuration
app.get('/visualizations', function (req, res) {
    var source_type = req.param("source_type");
    var id = req.param("id");

    switch (source_type) {
        case "dataselection":
            var recommendationByDataselectionID = recommendationsByDataselectionID[id];
            if (recommendationByDataselectionID) {
                res.send({
                    visualization: recommendationByDataselectionID
                });
            } else {
                var dataselection = dataselections[id];
                

                //console.log(JSON.stringify(dataselection));
                visualization_recommendation.recommendForDataselection(dataselection, config.ONTOLOGY_ENDPOINT, config.ONTOLOGY_GRAPH).then(function (visualizations) {

                    recommendationsByDataselectionID[id] = visualizations;
                    res.send({
                        visualization: visualizations
                    });
                }, printError);
            }
            break;
        case "visualizationConfiguration":
            if (!id) {
                // Load list of all stored visualizations
                query_visualization.queryIDs(config.CONFIGURATION_GRAPH, config.CONFIGURATION_ENDPOINT).then(function (visualizations) {
                    console.log("SENDING VISUALIZATION CONFIGURATIONS");
                    console.dir(JSON.stringify(visualizations));
                    res.send({
                        visualization: visualizations
                    });
                }, printError);
            } else {
                // Load specified visualization in a recommendation array
                query_visualization.query(id, config.CONFIGURATION_GRAPH, config.CONFIGURATION_ENDPOINT).then(function (load_result) {

                    var loaded_visualization = load_result.visualization;

                    datasources[load_result.datasource.id] = load_result.datasource;
                    dataselections[load_result.dataselection.id] = load_result.dataselection;
                    visualizationConfigurations[loaded_visualization.id] = loaded_visualization;



                    return visualization_recommendation.recommendForDataselection(load_result.dataselection, config.ONTOLOGY_ENDPOINT, config.ONTOLOGY_GRAPH).then(function (recommended_visualizations) {
                        var visualizations = [loaded_visualization];

                        for (var i = 0; i < recommended_visualizations.length; i++) {
                            var recommended_visualization = recommended_visualizations[i];
                            if (recommended_visualization.visualizationName !== loaded_visualization.visualizationName) {
                                visualizations.push(recommended_visualization);
                            }
                        }
                        recommendationsByDataselectionID[load_result.dataselection.id] = visualizations;

                        console.log("Sending visualizations:");
                        console.log(JSON.stringify(visualizations));

                        res.send({
                            visualization: visualizations,
                            dataselection: [load_result.dataselection],
                            datasource: [load_result.datasource]
                        });
                    }, printError);

                }, printError);
            }
            break;
    }
});

app.put('/visualizations/:id', function (req, res) {
    var vis_configuration = req.body['visualization'];
    var vis_configurationID = req.param('id');
    var vis_configurationName = vis_configuration['configurationName'];
    var dataselection = dataselections[vis_configuration['dataselection']];

    if (!isNaN(parseInt(vis_configurationID))) {
        return store_visualization.store(vis_configuration, dataselection, vis_configurationID, vis_configurationName, config.CONFIGURATION_GRAPH, config.CONFIGURATION_ENDPOINT_UPDATE).then(function (result) {

            res.status(200).send();
        }, printError);



    }
});

http.createServer(app).listen(3002, function () {
    console.log("visualisation_backend: Express server listening on port 3002");
});

process.on('uncaughtException', printError);