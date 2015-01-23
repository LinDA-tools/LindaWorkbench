(function() {

App = Ember.Application.create({
    LOG_TRANSITIONS: true, 
    LOG_TRANSITIONS_INTERNAL: true,
    onerror: function(error) {
        console.dir(error);
    },
    rootElement: '#visualizer'
});
Ember.RSVP.on('error', function(error) {
  Ember.Logger.assert(false, error);
});
Ember.run.backburner.DEBUG = true;


})();

(function() {

App.DatasourceController = Ember.ObjectController.extend({
    treeContent: function () {
        console.log('DATASOURCE CONTROLLER');
        // console.log(this.get('model'));

        var dataInfo = this.get('model'); // data sources

        if (!dataInfo)
            return{};

        this.set('selectedDatasource', dataInfo);
        // console.log('DATASOURCE');
        // console.dir(dataInfo);

        var previousSelection = this.get('previousSelection');
        //this.set('dataSelection', []);

        if (previousSelection.length === 0) {
            return treeselection_data.initialize(dataInfo);
        } else {
            return treeselection_data.restore(dataInfo, previousSelection);
        }
    }.property('model', 'previousSelection'),
    previousSelection: [],
    dataSelection: [],
    selectedDatasource: null,
    resetSelection: function () {
        this.get('dataSelection').length = 0;
    }.observes('model'),
    actions: {
        visualize: function () {
            var self = this;
            var selection = this.get('dataSelection');
            var datasource = this.get('selectedDatasource');
            var selected = treeselection_data.getDataSelection(selection, datasource);
            var dataselection = this.store.createRecord('dataselection', selected);

            dataselection.save().then(function (responseDataselection) {
                console.log("SAVED DATA SELECTION. TRANSITION TO VISUALIZATION ROUTE .....");
                console.dir(responseDataselection);
                self.transitionToRoute('visualization', 'dataselection', responseDataselection.id);
            });
        }
    }
});


})();

(function() {

App.VisualizationConfigController = Ember.ArrayController.extend({
   
});


})();

(function() {

App.VisualizationController = Ember.ArrayController.extend({
    layoutOptions: {},
    structureOptions: {},
    slideShowContainer: Ember.ContainerView.create(),
    datasource: Ember.computed.alias("selectedVisualization.datasource"),
    visualizationConfiguration: [{}],
    visualizationSVG: '',
    exportFormats: ['SVG', 'PNG'],
    selectedFormat: 'PNG',
    configName: "",
    categorizedProperties: function () {
        var categorizedProperties = {};
        var selectedVisualization = this.get('selectedVisualization');
        var dataselection = selectedVisualization.get('dataselection');
        var propertyInfos = dataselection.get('propertyInfos');

        for (var i = 0; i < propertyInfos.length; i++) {
            var propertyInfo = propertyInfos[i];
            var category = propertyInfo.type;

            if (!categorizedProperties[category]) {
                categorizedProperties[category] = {
                    name: category,
                    items: []
                };
            }
            categorizedProperties[category].items.push(propertyInfo);
        }

        return _.values(categorizedProperties);
    }.property('selectedVisualization'),
    initializeVisualization: function () {
        console.log("VISUALIZATION CONTROLLER - INITIALIZE VISUALIZATION ... ");
        this.set('drawnVisualization', null);

        var selectedVisualization = this.get('selectedVisualization');
        console.log('SELECTED VISUALIZATION');
        console.dir(selectedVisualization);

        // Reset configuration map
        var configArray = [{}];
        this.set('visualizationConfiguration', configArray);

        if (!selectedVisualization) {
            return;
        }

        var mapping = {
            structureOptions: {},
            layoutOptions: {}
        };

        var customMapping = templateMapping(selectedVisualization);

        mapping.structureOptions = customMapping.structureOptions;
        mapping.layoutOptions = customMapping.layoutOptions;

        console.log('MAPPING - STRUCTURE OPTIONS');
        console.dir(mapping.structureOptions);

        console.log('MAPPING - LAYOUT OPTIONS');
        console.dir(mapping.layoutOptions);

        this.set('structureOptions', mapping.structureOptions);
        this.set('layoutOptions', mapping.layoutOptions);

        // Ensures that bindings on drawnVisualizations are triggered only now
        this.set('drawnVisualization', selectedVisualization);
    }.observes('selectedVisualization'),
    setSuggestedVisualization: function () {
        var topSuggestion = this.get('firstObject');
        this.set('selectedVisualization', topSuggestion);
    }.observes('model.[]'),
    actions: {
        exportPNG: function () {
            var visualization = visualizationRegistry.getVisualization(this.get('selectedVisualization').get("name"));
            visualization.export_as_PNG().then(function (pngURL) {
                window.open(pngURL);
            });
        },
        exportSVG: function () {
            var visualization = visualizationRegistry.getVisualization(this.get('selectedVisualization').get("name"));
            var svgURL = visualization.export_as_SVG();
            window.open(svgURL);
        },
        export: function () {
            var visualization = visualizationRegistry.getVisualization(this.get('selectedVisualization').get("visualizationName"));
            if (this.get('selectedFormat') === 'PNG') {
                visualization.export_as_PNG().then(function (pngURL) {
                    window.open(pngURL);
                });
            } else {
                var svgURL = visualization.export_as_SVG();
                window.open(svgURL);
            }
        },
        publish: function () {
            var visualization = visualizationRegistry.getVisualization(this.get('selectedVisualization').get("visualizationName"));
            this.set('visualizationSVG', visualization.get_SVG());
        },
        save: function() {
            console.log("SAVE VISUALIZATION");
            // send actual visualization model to backend
            var selectedVisualization = this.get('selectedVisualization');
            console.dir(selectedVisualization);

            var configurationName = this.get('configName');

            // send current visualization configuration to backend
            console.log("The value is " + selectedVisualization.get('configurationName'));
            selectedVisualization.set('configurationName', configurationName);

            selectedVisualization.save().then(function () {
                console.log("SAVED SUCCESSFULLY");
            }, function (errorText) {
                console.log("ERROR DURING SAVING");
                console.log(errorText);
            });
        },
        chooseVisualization: function (visualization) {
            this.set('selectedVisualization', visualization);
        },
        select: function () {
            console.log("CHANGE DATASELECTION");
            var selectedVisualization = this.get('selectedVisualization');
            var dataselectionID = selectedVisualization.get('dataselection').id;
            var datasourceID = selectedVisualization.get('dataselection.datasource').id;

            this.transitionToRoute('dataselection', dataselectionID, datasourceID);
        }
    }
});

})();

(function() {

App.Store = DS.Store.extend({
    revision: 13,
    adapter: DS.RESTAdapter.extend({
        host: 'http://' + window.location.hostname + ':3002'
    })
});



})();

(function() {

App.Dataselection = DS.Model.extend({
    datasource: DS.attr(),//DS.belongsTo('datasource'),
    propertyInfos: DS.attr()
});


})();

(function() {

App.Datasource = DS.Model.extend({
    name: DS.attr("string"),
    location: DS.attr("string"),
    graph: DS.attr("string"),
    format: DS.attr("string")
});


})();

(function() {

/*The visualization model represents the  initial visualization configuration retrieved from the backend. 
 *And describes the format used for storing the current visualization configuration in the backend.*/
App.Visualization = DS.Model.extend({
    visualizationName: DS.attr('string'),
    configurationName: DS.attr('string'), //SAVE function
    structureOptions: DS.attr(),
    layoutOptions: DS.attr(),
    visualizationThumbnail: DS.attr('string'),
    valid: DS.attr('boolean'),
    dataselection: DS.belongsTo('dataselection')
});


})();

(function() {

/*Main route.*/
App.ApplicationRoute = Ember.Route.extend({
});



})();

(function() {

App.DataselectionRoute = Ember.Route.extend({
    model: function(params) {
        console.log('DATASELECTION ROUTE', params.selection);
        return Ember.$.getJSON('http://' + window.location.hostname + ':3002/dataselections/' + params.selection);      
    }, 
    controllerName: 'datasource',
    setupController: function(controller, model) {
        console.log('DATASELECTION ROUTE - SETTING UP THE DATASOURCE CONTROLLER');      
        console.log('MODEL');
        console.dir(model);

        controller.set('model', model.dataselection.datasource);
  
        var dataSelection = controller.get('dataSelection'); 
        var selection = _.flatten(dataSelection.pushObject(model.dataselection.propertyInfos)); 
              
        controller.set('dataSelection', selection);   
        controller.set('previousSelection', selection);         

    },
    renderTemplate: function() {
        this.render('datasource');
    }
});

})();

(function() {

App.DatasourceRoute = Ember.Route.extend({
    model: function(params) {
        var ds = this.store.createRecord('datasource', {
            name: decodeURIComponent(params.name),
            location: decodeURIComponent(params.location),
            graph: decodeURIComponent(params.graph),
            format: decodeURIComponent(params.format)
        });
        return ds.save().then(function(data) {            
            return data._data;
        });
    }
});

})();

(function() {

App.VisualizationConfigRoute = Ember.Route.extend({
    // "params" contains the parameters for the visualization route.  
    // The parameters are specified in the router.js.
    // The backend needs the datasource id only for the suggestion algorithm.
    model: function (params) {
         console.log("LOAD VISUALIZATION VISUALIZATIONS");
         console.dir(params);
        return this.store.find('visualization', {source_type: "visualizationConfiguration"}).then(function (visualizations) {
            console.log("STORED VISUALIZATIONS");
            console.dir(visualizations);
            return visualizations;
        });
    }
});

})();

(function() {

App.VisualizationRoute = Ember.Route.extend({
    // "params" contains the parameters for the visualization route.  
    // The parameters are specified in the router.js.
    // The backend needs the datasource id only for the suggestion algorithm.
    model: function (params) {
        console.log("Requesting visualization model and recommendations from the backend for {" + params.source_type + ", " + params.id + "}");
        console.dir(params);
        return this.store.find('visualization', {source_type: params.source_type, id: params.id}).then(function (visualizations) {
            console.log("Visualizations:");
            console.dir(visualizations);
            return visualizations;
        });
    }
});

})();

(function() {

App.DrawVisualizationView = Ember.View.extend({
    
    willAnimateIn: function() {
        this.$().css("opacity",0);
    },
    animateIn: function (done) {
        this.$().fadeTo(500,1,done);
    },
    animateOut: function(done){
        this.$().fadeTo(500,0,done);
    },
    parentViewDidChange: function(){
        this.$().hide();
        this.$().fadeIn(500);
    },
    eventManager: Ember.Object.create({
        input: function(event,view){
            this.triggerAction({
                action: "willAnimateIn",
                target: this
            });
        }
    }),
    drawVisualization: function () {
        var visualization = this.get('visualization');
        console.log("DRAW VISUALIZATION VIEW - DRAW ...");
        console.dir(visualization);

        if (!visualization) {
            return;
        }

        var config = this.get('configurationArray')[0];
        
        console.log("VISUALIZATION CONFIGURATION");
        console.dir(JSON.stringify(config));

        if (!config) {
            return;
        }

        var dataselection = visualization.get('dataselection');              
        var datasource = dataselection.get('datasource');        
        var format = datasource.format;
        config.datasourceLocation = datasource.location;
        config.datasourceGraph = datasource.graph;

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
        
        var name = visualization.get("visualizationName");
        var visualization = visualizationRegistry.getVisualization(name);       
        var self = this;

        var element = this.get('element');

        try {
            visualization.draw(config, element.id).then(function () {
                var svg = visualization.get_SVG();
                self.set('visualizationSVG', svg);
            });
        } catch (ex) {
            console.error("Error drawing visualization: ");
            console.error(ex);
        }
    }.observes('configurationArray.@each').on('didInsertElement')
});




})();

(function() {

App.PropertiesListView = Ember.View.extend({
    templateName: "propertiesList",
    tagName: 'ul',
    classNames: ['properties-list']
});


})();

(function() {

App.SlideShowView = Ember.View.extend({
    slides: null,
    templateName:'slideShow',
    classNames:['slider'],
    didInsertElement: function() {
        this._super();
        
        console.log("Inserted slideshow: ");
        console.dir(this.get('slides'));
        
        this.$().slick({
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 1
        });   
    },
    refreshView: function() {
        this.rerender();
    }.observes('slides.[]'),
    willDestroyElement: function() {
        console.log("Removing slideshow");
        this.$().unslick(); 
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
        var configArray = this.get('config');

        if ((configArray === null) || (options === null)) {
            return;
        }

        console.log("VISUALIZATION OPTIONS VIEW - CREATING CONFIGURATION VIEWS ...");

        // Ensures that config changes are only propagated when endPropertyChanges is called, i.e. after the for loop
        configArray.beginPropertyChanges();

        try {
            var optionNames = Object.getOwnPropertyNames(options);
            for (var i = 0; i < optionNames.length; i++) {

                var optionName = optionNames[i];
                var optionTemplate = options[optionName];

                var view = Ember.View.extend({
                    tagName: "li",
                    templateName: "vistemplates/" +
                            optionTemplate.template,
                    name: optionName,
                    label: optionTemplate.label,
                    content: optionTemplate.value,
                    metadata: optionTemplate.metadata ? optionTemplate.metadata.types : "",
                    maxCardinality: optionTemplate.maxCardinality,
                    contentObserver: function() {
                        var content = this.get('content');
                        var name = this.get('name');
                        var configMap = configArray[0];
                        configMap[name] = content;
                        configArray.setObjects([configMap]);
                        optionTemplate.value = content;
                    }.observes('content.@each').on('init')
                }).create();

                this.pushObject(view);
            }
        } finally {
            console.log('VISUALIZATION OPTIONS VIEW - CREATED CONFIGURATION ARRAY');
            console.dir(configArray);
            
            // Inside finally block to make sure that this is executed even if the for loop crashes
            configArray.endPropertyChanges();
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

App.DraggableItemComponent = Ember.Component.extend({
    tagName: 'span',
    classNames: ['draggable-item'],
    attributeBindings: ['draggable'],
    draggable: 'true',
    dragStart: function (event) {
        event.stopPropagation();
        var data = this.get('data');
        var jsonData = JSON.stringify(data);
        event.dataTransfer.setData('text/plain', jsonData);
        event.dataTransfer.effectAllowed = "copy";
    },
});

App.DroppableAreaComponent = Ember.Component.extend({
    dragOver: function (event) {
        event.stopPropagation();
        event.preventDefault();
    },
    drop: function (event, ui) {
        event.stopPropagation();
        event.preventDefault();
        var droppableJSON = event.dataTransfer.getData('text/plain');
        console.log('DROPPED: ' + droppableJSON);

        var droppable;
        try {
            droppable = JSON.parse(droppableJSON);
        } catch (error) {
            console.log(error);
            return;
        }

        var inArea = this.get('inArea');

        if (this.isFull()) {
            return;
        }

        for (var i = 0; i < inArea.length; i++) {
            var existingJSON = JSON.stringify(inArea[i]);
            if (existingJSON === droppableJSON) {
                return;
            }
        }
        inArea.pushObject(droppable);
    },
    classNames: ['droppable-area'],
    classNameBindings: ['full', 'active'],
    active: false,
    isFull: function () {
        // var maxNumItems = this.get('maxNumItems')
        // var inArea = this.get('inArea');
        // if (typeof maxNumItems !== 'undefined' && inArea.length >= maxNumItems) {
        //     return true;
        // }
        return false;
    },
    full: function () {
        return this.isFull();
    }.property('maxNumItems', 'inArea.@each'),
    dragEnter: function (event) {
        console.log(event.type);
        this.set('active', true);
    },
    deactivate: function (event) {
        console.log(event.type);
        this.set('active', false);
    }.on('dragLeave', 'dragStop', 'drop')
});

App.PropertyItemComponent = Ember.Component.extend({
    classNames: ['area-item', 'row'],
    remove: function () {
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

App.DataTableComponent = Ember.Component.extend({
    tagName: 'table',
    list: [],
    columns: [],
    classNames: ['no-wrap'],
    table: null,
    setContent: function() {
        console.log("TABLE COMPONENT - GENERATING PREVIEW");

        var self = this;
        var selection = this.get('preview');
        var datasource = this.get('datasource');

        if (selection.length > 0) {
            var columns = table_data.getColumns(selection, datasource);

            table_data.getContent(selection, datasource).then(function(content) {

                var table = self.get('table');
                if (table) {
                    table.api().clear().destroy();
                    $(self.get('element')).empty();
                }

                var table = $(self.get('element')).dataTable({
                    responsive: {
                        details: {
                            type: 'inline'
                        }
                    },                 
                    "data": content.slice(1),
                    "columns": columns
                });
                self.set('table', table);
            });

        } else {
            var table = self.get('table');
            if (table) {
                table.api().clear().destroy();
                $(self.get('element')).empty();
            }
        }
    }.observes('preview.[]').on('didInsertElement')
});

})();

(function() {

App.TreeSelectionComponent = Ember.Component.extend({
    tagName: 'div',
    tree: null,
    setContent: function() {
        console.log("TREE SELECTION COMPONENT - CREATING SELECTION TREE");
        var content = this.get('treedata');
        var selection = this.get('selection');
        console.dir(JSON.stringify(selection));

        //selection = []; todo needs to be reset
        this.set('selection', selection);

        var self = this;

        $(this.get('element')).fancytree({
            extensions: ["filter"],
            source: content,
            checkbox: true,
            selectMode: 3,
            filter: {
                mode: "dimm",
                autoApply: true
            },
            lazyLoad: function(event, data) {
                console.log("TREE SELECTION COMPONENT - LOADING CHILDREN");
                console.log("DATA");
                console.dir(data);
                var node = data.node;
                var node_path = self.getNodePath(node);

                data.result = data.node.data._children.loadChildren(node_path.slice().reverse());
            },
            select: function(event, data) {
                console.log("TREE SELECTION COMPONENT - GENERATING PREVIEWS");
                var tree = data.tree;
                var node = data.node;
                var branch_root = self.getBranchRoot(node);
                var branch_root_title = branch_root.title;

                console.log('NODE');
                console.dir(node);
//
                var selected = tree.getSelectedNodes();

                console.log('SELECTED NODES');
                console.dir(selected);
//
                if (node.selected) {
                    tree.filterBranches(function(node) {
                        if (node.title === branch_root_title) {
                            return true;
                        } else {
                            node.hideCheckbox = true;
                            node.render(true);
                        }
                    });

                    var selected = tree.getSelectedNodes();

                    console.log('SELECTED NODES');
                    console.dir(selected);

                    for (var i = 0; i < selected.length; i++) {
                        var node_ = selected[i];
                        var node_path = self.getNodePath(node_).slice().reverse();
                        var path_labels = self.getNodePath(node_).slice().reverse();
                        var node_label = node_.title;
                        var node_key = node_.key;
                        var node_type = node_.data.type;
                        var node_role = node_.data.role;

                        var already_selected = _.some(selection, function(value) {
                            return _.isEqual(value.parent, node_path);
                        });

                        if (!already_selected
                                && (node_.hideCheckbox === false)
                                && (node_type !== 'Class')) {

                            selection.pushObject(
                                    {
                                        label: node_label,
                                        key: node_key,
                                        type: node_type,
                                        role: node_role,
                                        parent: path_labels
                                    }
                            );
                        }
                    }
                } else {
                    var selected = tree.getSelectedNodes();
                    
                    console.log('SELECTED NODES - ELSE');
                    console.dir(selected);
                    
                    console.log('SELECTION');
                    console.dir(selection);
                    
                    selection = _.filter(selection, function(item) {

                        var is_selected = false;

                        for (var i = 0; i < selected.length; i++) {
                            var node_ = selected[i];
                            var node_path = self.getNodePath(node_).slice().reverse();

                            if (!is_selected) {
                                is_selected = _.isEqual(item.parent, node_path);
                            }
                        }

                        return is_selected;
                    });

                    if (selected.length === 0) {
                        tree.clearFilter();
                        tree.visit(function(node) {
                            var type = node.data.type;
                            node.hideCheckbox = self.hideCheckbox(type);
                            node.render(true);
                        });
                    }
                }

                //console.log('DATA SELECTION');
                //console.dir(selection);

                self.set('selection', selection);
            }
        });
    }.observes('treedata').on('didInsertElement'),
    getNodePath: function(node) {
        var node_path_with_labels = [];
        node_path_with_labels.push({id: node.key, label: node.title});

        while (node.parent !== null) {
            node_path_with_labels.push({id: node.parent.key, label: node.parent.title});
            node = node.parent;
        }

        node_path_with_labels.pop(); // root id is not relevant

        return  node_path_with_labels;
    },
    getBranchRoot: function(node) {
        while (node.parent.title !== "root") {
            node = node.parent;
        }
        return node;
    },
    hideCheckbox: function(type) {
        switch (type) {
            case "Quantitative":
            case "Interval":
            case "Categorical":
            case "Nominal":
            case "Class":
                return false;
            case "Resource":
            case "Nothing":
                return true;
        }
        return null;
    }
});  

})();

(function() {

// router
App.Router.map(function() {
    this.route("visualization", {
        path: '/visualization/:source_type/:id'
    });
    this.route("datasource", {
        path: '/datasource/:name/:location/:graph/:format'
    });
    this.route("dataselection", {
        path: '/dataselection/:selection/:datasource'
    });
    this.route("visualizationConfig");
    this.route("configure");
});

})();