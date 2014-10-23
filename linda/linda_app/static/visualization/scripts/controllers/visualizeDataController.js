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
            Ember.$.getJSON('http://localhost:3002/suggest/' + ds.get('id')).then(function(tools) {
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

            var promise = Ember.$.getJSON('http://localhost:3002/preconfigure/' + dataset_id + "/" + visualization_id);

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