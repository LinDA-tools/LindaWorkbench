(function() {

App = Ember.Application.create({
    LOG_TRANSITIONS: true, 
    LOG_TRANSITIONS_INTERNAL: true
});


})();

(function() {

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

})();

(function() {

App.Store = DS.Store.extend({
    revision: 13,
    adapter: DS.RESTAdapter.extend({
        host: 'http://localhost:3002'
    })
});



})();

(function() {

/*The visualization model represents the  initial visualization configuration retrieved from the backend. 
 *And describes the format used for storing the current visualization configuration in the backend.*/
App.Visualization = DS.Model.extend({
    name: DS.attr('string'),
    structureOptions: DS.attr(),
    layoutOptions: DS.attr(),
    datasource: DS.attr(),
    thumbnail: DS.attr('string')
});


})();

(function() {

/*Main route.*/
App.ApplicationRoute = Ember.Route.extend({
});



})();

(function() {

App.VisualizationRoute = Ember.Route.extend({
    // "params" contains the parameters for the visualization route.  
    // The parameters are specified in the router.js.
    // The backend needs the datasource id only for the suggestion algorithm.
    model: function(params) { 
        console.log("Requesting visualization model and recommendations from the backend for the data source " + params.name);
        return this.store.find('visualization', {name: params.name, location: params.location, graph: params.graph, format:params.format}).then(function(recommendations) {
            console.log("Recommendations:");
            console.dir(recommendations);
            return recommendations;
        });
    }
});

})();

(function() {

App.ConfigureVisualizationView = Ember.View.extend({
    strOptionsConfVis: null, 
    confVis: null,
    dsConfVis: null,
    templateName:'configureVisualization',
    createTreeContent: function() {
        console.log('configure visualization view');
        var datasource = this.get('dsConfVis'); 

        if (!datasource)
            return {};

        console.log("datasource");
        console.dir(datasource);

        var treedata = tree_data.create(datasource);
        console.log("treedata: ");
        console.dir(treedata);
        return treedata;
    }.property('datasource')
});




})();

(function() {

App.SlideShowView = Ember.View.extend({
    slides: null,
    templateName:'slideShow',
    classNames:['slider'],
    didInsertElement: function() {
        this._super();
        $('.slider').slick({
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 1
        });   
    }
});




})();

(function() {

App.VisualizationOptionsView = Ember.ContainerView.extend({
    options: null, // structure or layout options
    config: null, // visualization configuration
    tagName: "ul",
    children: function() {
        this.clear();

        var options = this.get('options');
        var config = this.get('config');

        if ((config === null) || (options === null)) {
            return;
        }
        
        console.log("Creating visualization configuration view...");
        console.log('Structure options: ');
        console.dir(options);
        console.log('Visualization configuration: ');

        var optionNames = Object.getOwnPropertyNames(options);
        for (var i = 0; i < optionNames.length; i++) {
            
            var optionName = optionNames[i];          
            console.log('Option name: ');
            console.dir(optionName);
            
            var optionTemplate = options[optionName];
            console.log('Option template: ');
            console.dir(optionTemplate);
            console.dir(optionTemplate.value);
            
            var view = Ember.View.extend({
                tagName: "li",
                templateName: "vistemplates/" +
                        optionTemplate.template,
                name: optionName,
                label: optionTemplate.label,
                content: optionTemplate.value,
                metadata: optionTemplate.metadata.types,
                contentObserver: function() {
                    var content = this.get('content');                  
                    var name = this.get('name');
                    console.log("Changed option " + name + ":");
                    console.dir(content);

                    var configMap = config[0];
                    configMap[name] = content;
                    config.setObjects([configMap]);
                }.observes('content.@each').on('init')
            }).create();
            this.pushObject(view);
        }
    }.observes('options').on('init')
});

})();

(function() {

App.DimensionAreaComponent = Ember.Component.extend({
    tagName: "li"
});


})();

(function() {

App.DroppableAreaComponent = Ember.Component.extend({
    dragOver: function(event) {
        event.stopPropagation();
        event.preventDefault();
    },
    drop: function(event) {
        event.stopPropagation();
        event.preventDefault();
        var droppableJSON = event.dataTransfer.getData('text/plain');
        console.log('DROPPABLE');
        console.dir(JSON.parse(droppableJSON));
        var droppable = JSON.parse(droppableJSON);
        var inArea = this.get('inArea');
        console.log('inArea');
        console.dir(inArea);
        
        for (var i = 0; i < inArea.length; i++) {
            if (inArea[i].id === droppable.id) {
                return;
            }
        }
        this.get('inArea').pushObject(droppable);
    }
});

App.PropertyItemComponent = Ember.Component.extend({
    classNames: ['area-item'],
    remove: function() {
        console.log('REMOVE');
        var collection = this.get('collection'); //collection = inArea
        var item = this.get('item');

        console.dir(collection);
        console.dir(item);

        collection.removeObject(item);

    }
});


})();

(function() {

// TREE VIEW
App.TreeBranchComponent = Ember.Component.extend({
    tagName: 'ul',
    classNames: ['tree-branch'],
    children: function() {
        var node = this.get('node');

        if (node.getChildren) {
            return node.getChildren(node);
        } else {
            return [];
        }
    }.property('node')
});

App.TreeNodeComponent = Ember.Component.extend({
    tagName: 'li',
    classNames: ['tree-node'],
    init: function() {
        this._super();
        this.set('isExpanded', this.get('node.expanded') || false);
    },
    toggle: function() {
        this.toggleProperty('isExpanded');
    },
    dragStart: function(event) {
        console.log("DRAG START")
        if (!this.get('node.draggable')) {
            return;
        }

        event.stopPropagation();
        var data = this.get('node.data');
        
        event.dataTransfer.setData('text/plain', JSON.stringify(data));
        event.dataTransfer.effectAllowed = "copy";
    }
});

})();

(function() {

// router
App.Router.map(function() {   
    this.route("visualization", {
        path: '/visualization/:name/:location/:graph/:format'
    });
});

})();