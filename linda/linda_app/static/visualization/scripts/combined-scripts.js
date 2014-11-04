(function() {

App = Ember.Application.create({
    LOG_TRANSITIONS: true, 
    LOG_TRANSITIONS_INTERNAL: true
});


})();

(function() {

App.SelectDataController = Ember.ArrayController.extend({
    itemController: 'datasource',
    treeContent: function() {
        var dataInfo = this.get('model'); // data sources

        if (!dataInfo || dataInfo.length === 0)
            return{};

        console.log("dataInfo");
        console.dir(dataInfo);

        return tree_data.create(dataInfo);
    }.property('model'),
    tableContent: [],
    dataSelection: [],
    actions: {
        visualize: function(selection) {
        }
    }
});

App.DatasourceController = Ember.ObjectController.extend({});


})();

(function() {

// TODO: UNDER CONSTRUCTION

App.VisualizeDataController = Ember.ArrayController.extend({
    needs: ["application"],
    applicationController: Ember.computed.alias("controllers.application"),
    dataInfo: {},
    dataSubset: null,
    dimensions: function() {
        var dataSubset = this.get('dataSubset');
        if (!dataSubset) {
            return [];
        }

        var properties = _.values(dataSubset.properties);
        return properties;
    }.property('dataSubset'),
    visualisationWidget: null,
    visualisationContainer: "visualisation",
    visualisationConfiguration: {},
    createOptionViews: function(options, visualisationConfiguration, observer, container) {

        for (var optionName in options) {
            var option = options[optionName];
            var view;

            if (!visualisationConfiguration[optionName]) {
                visualisationConfiguration[optionName] = this.getOptionDefaultValue(option);
            }

            if (option.suboptions) {
                view = Ember.View.create({
                    tagName: "li",
                    templateName: "vistemplates/" + option.template,
                    name: optionName,
                    parent: container,
                    childrenConfig: visualisationConfiguration[optionName],
                    label: option.label,
                    optionvalue: option,
                    classNames: "optionContainer",
                    childrenViews: [],
                    pushObject: function(child) {
                        this.childrenViews.push(child);
                    }
                });
                this.createOptionViews(option.suboptions, visualisationConfiguration[optionName], observer, view);
            } else {
                var view = Ember.View.extend({
                    tagName: "li",
                    templateName: "vistemplates/" + option.template,
                    name: optionName,
                    values: option.values,
                    label: option.label,
                    optionvalue: option,
                    parent: container,
                    content: visualisationConfiguration[optionName], // initial value; later user input
                    contentObserver: observer.observes('content')
                }).create();
            }
            container.pushObject(view);
        }
    },
    getOptionDefaultValue: function(option) {
        switch (option.template) {
            case 'treeView':
            case 'box':
                return {};
            case 'area':
                return [];
            case 'selectField':
                return option.values[0];
            default:
                return "";
        }
    },
    getWidget: function(widgetName) {
        switch (widgetName) {
            case 'Bar Chart':
                return barchart;
            case 'Column Chart':
                return columnchart;
            case 'Line Chart':
                return linechart;
            case 'Area Chart':
                return areachart;
            case 'Pie Chart':
                return piechart;
            case 'Bubble Chart':
                return bubblechart;
            case 'Scatter Chart':
                return scatterchart;
            case 'Map Chart':
                return mapchart;
            case 'Map':
                return map;
        }
        return null;
    },
    getDataModule: function(datasource) {
        var format = datasource.get('format');
        switch (format) {
            case 'csv':
                return csv_data_module;
            case 'rdf':
                return sparql_data_module;
        }
        console.error("Unknown data format '" + format + "'");
        return null;
    },
    treeContent: {},
    scrollTo: function(id) {
        Ember.$('html,body').animate({
            scrollTop: $("#" + id).offset().top
        });
    },
    actions: {
        selectDS: function(ds) {
            this.set('selectedDatasource', ds);
            var controller = this;
            Ember.$.getJSON('http://localhost:8000/visualizations/visual/api/suggest/' + ds.get('id')).then(function(tools) {
                controller.set('suggestedTools', tools);
            });
        },
        configure: function(selection) {

            Ember.View.views['tuningOptionsView'].clear();
            Ember.View.views['structureOptionsView'].clear();
            Ember.$('#visualisation').empty();

            var controller = this;
            var visualisationConfiguration = {};
            this.set('visualisationConfiguration', visualisationConfiguration)

            var dataset = this.get('selectedDatasource');
            var visualisationWidget = this.getWidget(selection.name);

            this.set('visualisationWidget', visualisationWidget);

            var module = this.getDataModule(dataset);

            var structureOptions = selection.structureOptions || visualisationWidget.structureOptions;

            // retrieve pre-configuration from backend
            var dataset_id = dataset.id;
            var visualization_id = selection._id;

            var promise = Ember.$.getJSON('http://localhost:8000/visualizations/visual/api/preconfigure/' + dataset_id + "/" + visualization_id);

            return promise.then(function(preconfig) {
                controller.set('visualisationConfiguration', preconfig);
                preconfig.dataModule = module;

                // read data from backend and create a data tree
                module.read(dataset.get("location")).then(function(datasourceInfo) {
                    var dataInfo = datasourceInfo.dataInfo;
                    controller.set('treeContent', tree_data.create(dataInfo));

                    preconfig.datasourceInfo = datasourceInfo; // TODO: vielleicht reicht ja das data module
                });

                var observer = function() {
                    var parent = this.get('parent');
                    var childrenConfig = parent.childrenConfig;
                    childrenConfig[this.get('name')] = this.get('content');
                };

                var optionsContainer = Ember.View.views['structureOptionsView'];
                optionsContainer.clear();
                optionsContainer.childrenConfig = preconfig;

                // create preconfigured option view
                controller.createOptionViews(structureOptions, preconfig, observer, optionsContainer);
            });
        },
        draw: function() {
            var visualisationWidget = this.get('visualisationWidget');
            var visualisationConfiguration = this.get('visualisationConfiguration');
            var visualisationContainer = this.get('visualisationContainer');

            visualisationConfiguration.selectedSubset = this.get('dataSubset');
            visualisationWidget.draw(visualisationConfiguration, visualisationContainer);

            var options = visualisationWidget.tuningOptions;

            var observer = function() {
                var parent = this.get('parent');
                var childrenConfig = parent.childrenConfig;
                childrenConfig[this.get('name')] = this.get('content');
                visualisationWidget.tune(visualisationConfiguration);
            };

            var container = Ember.View.views['tuningOptionsView'];
            container.clear();
            container.childrenConfig = visualisationConfiguration;
            this.createOptionViews(options, visualisationConfiguration, observer, container);
        }
    }
});

})();

(function() {

App.Store = DS.Store.extend({
    revision: 13,
    adapter: DS.RESTAdapter.extend({
        host: 'http://localhost:8000' + '/visualizations/visual/api'
    })
});



})();

(function() {

App.Datasource = DS.Model.extend({
    title: DS.attr("string"),
    location: DS.attr(),
    format: DS.attr("string"),
});


})();

(function() {

//create a route
App.ApplicationRoute = Ember.Route.extend({
});



})();

(function() {

App.IndexRoute = Ember.Route.extend({
    renderTemplate: function() {
        this._super(this, arguments);
        this.render('selectData', {
            outlet: 'selectData',
            into: 'index',
            controller: 'selectData'
        });
        this.render('visualizeData', {
            outlet: 'visualizeData',
            into: 'index',
            controller: 'visualizeData'
        });
    },
    setupController: function(controller, model) {   
     var self = this;
       this.store.find('datasource').then(function(response) {
            self.controllerFor('selectData').set('model', response.toArray());
        });       
        // this.controllerFor('visualizeData').set('model', selection);
    }

});


})();

(function() {

App.ContainerView = Ember.ContainerView.extend({});



})();

(function() {

// DRAG AND DROP 
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
        for (var i = 0; i < inArea.length; i++) {
            if (inArea[i].id === droppable.id) {
                return;
            }
        }
        this.get('inArea').pushObject(droppable);
    }
});

// ITEMS COMPONENT 
App.PropertyItemComponent = Ember.Component.extend({
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

App.DataTableComponent = Ember.Component.extend({
    tagName: 'table',
    content: [],
    columns: [],
    table: null,
    setContent: function() {
        var self = this;
        var list = this.get('list');

        if (list.length > 0) {
            var columns = table_data.getColumns(list);

            table_data.getContent(list).then(function(content) {
                var table = self.get('table');

                if (table) {
                    table.api().clear().destroy();
                    $(self.get('element')).empty();
                }

                var table = $(self.get('element')).dataTable({
                    "data": content,
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

    }.observes('list.[]')
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
        var selection = this.get('node.selected');
        this.toggleProperty('isExpanded');
    },
    refreshSelection: function() {
        var sel = this.get('node.selected');
        var list = this.get('selection');
        var node = this.get('node');
        if (sel) {
            list.pushObject(node);
        } else {
            list.removeObject(node);
        }
    }.observes('selected').on('init'),
    expand: function() {
        var expanded = this.get('isExpanded');
        var list = this.get('expansion');
        var node = this.get('node');
        var children = node.children;

        if (expanded) {
            list.setObjects(children);
        } 

    }.observes('node.children').on('init'),
    
    collapse: function() {
        var expanded = this.get('isExpanded');

        if (!expanded) {
            this.set('expansion', []);
        }

    }.observes('isExpanded'),
    dragStart: function(event) {
        if (!this.get('draggable')) {
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
    this.route("upload");
});

})();
