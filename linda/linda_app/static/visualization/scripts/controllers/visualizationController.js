App.VisualizationController = Ember.ArrayController.extend({
    layoutOptions: {},
    structureOptions: {},
    datasource: Ember.computed.alias("selectedVisualization.datasource"),
    visualizationConfiguration: [{}],
    visualizationSVG: '',
    recommendations: Ember.computed.alias("model"), // each recommendation is an instance of the visualization model
    createVisualization: function() {
        var selectedVisualization = this.get('selectedVisualization');
        console.log("Creating visualization: ");
        console.dir(selectedVisualization);

        var mapping = {
            structureOptions: {},
            layoutOptions: {}
        };

        var customMapping = templateMapping(selectedVisualization);

        mapping.structureOptions = customMapping.structureOptions;
        mapping.layoutOptions = customMapping.layoutOptions;
        console.log('mapping.structureOptions');
        console.dir(mapping.structureOptions);

        console.log('mapping.layoutOptions');
        console.dir(mapping.layoutOptions);

        this.set('structureOptions', mapping.structureOptions);
        this.set('layoutOptions', mapping.layoutOptions);
    }.observes('selectedVisualization'),
    drawVisualization: function() {
        var config = this.get('visualizationConfiguration')[0];
        console.log("Configuration changed");
        console.dir(config);

        var selectedVisualization = this.get('selectedVisualization');
        console.log("selectedVisualization");
        console.dir(selectedVisualization);

        var datasource = selectedVisualization.get('datasource');
        console.log("datasource");
        console.dir(datasource);

        var format = datasource.format;
        config.datasourceLocation = datasource.location;

        switch (format) {
            case 'rdf':
                config.dataModule = sparql_data_module;
                break;
            case 'csv':
                config.dataModule = csv_data_module;
                break;
            default:
                console.error("Unknown DS format: " + format);
                return;
        }
        var name = selectedVisualization.get("name");
        var visualization = visualizationRegistry.getVisualization(name);
        console.log("Visualization " + name);
        console.dir(visualization);
        console.dir(config);
        var self = this;

        visualization.draw(config, "visualization").then(function() {
            var svg = visualization.get_SVG();
            self.set('visualizationSVG', svg);

        });
    }.observes('visualizationConfiguration.@each'),
    setSuggestedVisualization: function() {
        var topSuggestion = this.get('firstObject');
        console.log("Setting top suggestion");
        console.dir(topSuggestion);
        this.set('selectedVisualization', topSuggestion);
    }.observes('model'),
    actions: {
        exportPNG: function() {
            var visualization = visualizationRegistry.getVisualization(this.get('selectedVisualization').get("name"));
            visualization.export_as_PNG().then(function(pngURL) {
                window.open(pngURL);
            });
        },
        exportSVG: function() {
            var visualization = visualizationRegistry.getVisualization(this.get('selectedVisualization').get("name"));
            var svgURL = visualization.export_as_SVG();
            window.open(svgURL);
        },
        save: function() {
        },
        chooseVisualization: function(visualization) {
            this.set('selectedVisualization', visualization);
        }
    }
});