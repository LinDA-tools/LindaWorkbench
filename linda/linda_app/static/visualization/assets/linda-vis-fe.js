/* jshint ignore:start */

/* jshint ignore:end */

define('linda-vis-fe/adapters/application', ['exports', 'ember-data'], function (exports, DS) {

        'use strict';

        var Adapter = DS['default'].RESTAdapter.extend({
                host: "http://" + window.location.hostname + "/visualizations/visual/api"
        });

        exports['default'] = Adapter;

});
define('linda-vis-fe/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'linda-vis-fe/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  var App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default'],
	rootElement: '#visualizer'
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;
});
define('linda-vis-fe/components/data-table', ['exports', 'ember', 'linda-vis-fe/utils/table-data-module'], function (exports, Ember, table_data_module) {

    'use strict';

    exports['default'] = Ember['default'].Component.extend({
        tagName: "table",
        list: [],
        columns: [],
        classNames: ["no-wrap"],
        table: null,
        setContent: (function () {
            console.log("TABLE COMPONENT - GENERATING PREVIEW");

            var self = this;
            var selection = this.get("preview");
            var datasource = this.get("datasource");

            if (selection.length > 0) {
                var columns = table_data_module['default'].getColumns(selection, datasource);

                table_data_module['default'].getContent(selection, datasource).then(function (content) {

                    if (self.get("table")) {
                        self.get("table").api().clear().destroy();
                        self.$().empty();
                    }

                    var table = self.$().dataTable({
                        responsive: {
                            details: {
                                type: "inline"
                            }
                        },
                        "data": content.slice(1),
                        "columns": columns
                    });
                    self.set("table", table);
                });
            } else {
                if (self.get("table")) {
                    self.get("table").api().clear().destroy();
                    self.$().empty();
                }
            }
        }).observes("preview.[]").on("didInsertElement")
    });

});
define('linda-vis-fe/components/draggable-item', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Component.extend({
        tagName: 'span',
        classNames: ['draggable-item'],
        attributeBindings: ['draggable'],
        draggable: 'true',
        dragStart: function dragStart(event) {
            event.stopPropagation();
            var data = this.get('data');
            var jsonData = JSON.stringify(data);
            event.dataTransfer.setData('text/plain', jsonData);
            event.dataTransfer.effectAllowed = 'copy';

        }
    });

});
define('linda-vis-fe/components/droppable-area', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Component.extend({
        dragOver: function dragOver(event) {
            event.stopPropagation();
            event.preventDefault();
        },
        drop: function drop(event) {
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
        isFull: function isFull() {
            return false;
        },
        full: (function () {
            return this.isFull();
        }).property('maxNumItems', 'inArea.@each'),
        dragEnter: function dragEnter(event) {
            console.log(event.type);
            this.set('active', true);
        },
        deactivate: (function (event) {
            console.log(event.type);
            this.set('active', false);
        }).on('dragLeave', 'dragStop', 'drop')
    });

});
define('linda-vis-fe/components/property-item', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    actions: {
      remove: function remove() {
        var collection = this.get('collection');
        var item = this.get('item');
        collection.removeObject(item);
      }
    }
  });

});
define('linda-vis-fe/components/tree-selection', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Component.extend({
        tagName: "div",
        tree: null,
        setContent: (function () {
            console.log("TREE SELECTION COMPONENT - CREATING SELECTION TREE");
            var content = this.get("treedata");
            var selection = this.get("selection");
            console.dir(JSON.stringify(selection));

            //selection = []; todo needs to be reset
            this.set("selection", selection);

            var self = this;

            this.$(this.get("element")).fancytree({
                extensions: ["filter", "glyph", "edit", "wide"],
                source: content,
                checkbox: true,
                icons: false,
                selectMode: 3,
                glyph: {
                    map: {
                        checkbox: "glyphicon glyphicon-unchecked",
                        checkboxSelected: "glyphicon glyphicon-check",
                        checkboxUnknown: "glyphicon glyphicon-share",
                        error: "glyphicon glyphicon-warning-sign",
                        expanderClosed: "glyphicon glyphicon-plus-sign",
                        expanderLazy: "glyphicon glyphicon-plus-sign",
                        expanderOpen: "glyphicon glyphicon-minus-sign",
                        loading: "glyphicon glyphicon-refresh"
                    }
                },
                wide: {
                    iconWidth: "0.3em",
                    iconSpacing: "0.5em",
                    levelOfs: "1.5em"
                },
                filter: {
                    mode: "dimm",
                    autoApply: true
                },
                lazyLoad: function lazyLoad(event, data) {
                    console.log("TREE SELECTION COMPONENT - LOADING CHILDREN");
                    console.log("DATA");
                    console.dir(data);
                    var node = data.node;
                    var node_path = self.getNodePath(node);

                    data.result = data.node.data._children.loadChildren(node_path.slice().reverse());
                },
                select: function select(event, data) {
                    console.log("TREE SELECTION COMPONENT - GENERATING PREVIEWS");
                    var tree = data.tree;
                    var node = data.node;
                    var branch_root = self.getBranchRoot(node);
                    var branch_root_title = branch_root.title;
                    var selected = tree.getSelectedNodes();

                    if (node.selected) {
                        tree.filterBranches(function (node) {
                            if (node.title === branch_root_title) {
                                return true;
                            } else {
                                node.hideCheckbox = true;
                                node.render(true);
                            }
                        });

                        for (var i = 0; i < selected.length; i++) {
                            var node_ = selected[i];
                            var node_path = self.getNodePath(node_).slice().reverse();
                            var path_labels = self.getNodePath(node_).slice().reverse();
                            var node_label = node_.title;
                            var node_key = node_.key;
                            var node_type = node_.data.type;
                            var node_role = node_.data.role;
                            var node_datatype = node_.data.datatype;

                            var already_selected = _.some(selection, function (value) {
                                return _.isEqual(value.parent, node_path);
                            });

                            if (!already_selected && node_.hideCheckbox === false && node_type !== "Class") {

                                selection.pushObject({
                                    label: node_label,
                                    key: node_key,
                                    type: node_type,
                                    role: node_role,
                                    parent: path_labels,
                                    datatype: node_datatype
                                });
                            }
                        }
                    } else {

                        selection = _.filter(selection, function (item) {

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
                            tree.visit(function (node) {
                                var type = node.data.type;
                                node.hideCheckbox = self.hideCheckbox(type);
                                node.render(true);
                            });
                        }
                    }

                    self.set("selection", selection);
                }
            });
        }).observes("treedata").on("didInsertElement"),
        getNodePath: function getNodePath(node) {
            var node_path_with_labels = [];
            node_path_with_labels.push({ id: node.key, label: node.title });

            while (node.parent !== null) {
                node_path_with_labels.push({ id: node.parent.key, label: node.parent.title });
                node = node.parent;
            }

            node_path_with_labels.pop();

            return node_path_with_labels;
        },
        getBranchRoot: function getBranchRoot(node) {
            while (node.parent.title !== "root") {
                node = node.parent;
            }
            return node;
        },
        hideCheckbox: function hideCheckbox(type) {
            switch (type) {

                case "Ratio":
                case "Interval":

                case "Nominal":
                case "Angular":
                case "Geographic Latitude":
                case "Geographic Longitude":
                case "Class":
                    return false;
                case "Resource":
                case "Nothing":
                    return true;
            }
            console.error("Unknown category: '" + type + "'");
            return null;
        }
    });

});
define('linda-vis-fe/controllers/datasource', ['exports', 'ember', 'linda-vis-fe/utils/tree-selection-data-module'], function (exports, Ember, treeselection_data) {

    'use strict';

    exports['default'] = Ember['default'].Controller.extend({
        isToggled: true,
        treeContent: (function () {
            console.log("DATASOURCE CONTROLLER");
            var dataInfo = this.get("model"); // data sources
            if (!dataInfo) {
                return {};
            }

            this.set("selectedDatasource", dataInfo);

            var previousSelection = this.get("previousSelection");
            if (previousSelection.length === 0) {
                return treeselection_data['default'].initialize(dataInfo);
            } else {
                return treeselection_data['default'].restore(dataInfo, previousSelection);
            }
        }).property("model", "previousSelection"),
        previousSelection: [],
        dataSelection: [],
        selectedDatasource: null,
        resetSelection: (function () {
            this.get("dataSelection").length = 0;
        }).observes("model"),
        actions: {
            visualize: function visualize() {
                var self = this;
                var selection = this.get("dataSelection");
                var datasource = this.get("selectedDatasource");
                var selected = treeselection_data['default'].getDataSelection(selection, datasource);
                var dataselection = this.store.createRecord("dataselection", selected);
                console.log("VISUALIZE");
                dataselection.save().then(function (responseDataselection) {
                    console.log("SAVED DATA SELECTION. TRANSITION TO VISUALIZATION ROUTE .....");
                    console.dir(responseDataselection);
                    self.transitionToRoute("visualization", "dataselection", responseDataselection.id);
                });
            },
            toggle: function toggle() {
                var toggled = this.get("isToggled");
                if (toggled) {
                    this.set("isToggled", false);
                } else {
                    this.set("isToggled", true);
                }
            }
        }
    });

});
define('linda-vis-fe/controllers/index', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].ObjectController.extend({
        needs: ['application'],
        datasetsEndpointURI: (function () {
            return encodeURIComponent(this.get('controllers.application.datasetsEndpoint'));
        }).property()
    });

});
define('linda-vis-fe/controllers/visconfiguration', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].ArrayController.extend({});

});
define('linda-vis-fe/controllers/visualization', ['exports', 'ember', 'linda-vis-fe/utils/template-mapping', 'linda-vis-fe/utils/visualization-registry'], function (exports, Ember, template_mapping, vis_registry) {

    'use strict';

    exports['default'] = Ember['default'].ArrayController.extend({
        isToggled: true,
        layoutOptions: {},
        structureOptions: {},
        slideShowContainer: Ember['default'].ContainerView.create(),
        datasource: Ember['default'].computed.alias("selectedVisualization.datasource"),
        visualizationConfiguration: [{}],
        visualizationSVG: "",
        exportFormats: ["SVG", "PNG"],
        selectedFormat: "PNG",
        configName: "",
        categorizedProperties: (function () {
            var categorizedProperties = {};
            var selectedVisualization = this.get("selectedVisualization");
            var dataselection = selectedVisualization.get("dataselection");
            var propertyInfos = dataselection.get("propertyInfos");

            for (var i = 0; i < propertyInfos.length; i++) {
                var propertyInfo = propertyInfos[i];
                var category = propertyInfo.type;
                var datatype = propertyInfo.datatype;

                if (!categorizedProperties[category]) {
                    categorizedProperties[category] = {
                        name: category,
                        datatype: datatype,
                        items: []
                    };
                }
                categorizedProperties[category].items.push(propertyInfo);
            }

            console.log("CATEGORIZED PROPERTIES");
            console.dir(_.values(categorizedProperties));

            return _.values(categorizedProperties);
        }).property("selectedVisualization"),
        initializeVisualization: (function () {
            console.log("VISUALIZATION CONTROLLER - INITIALIZE VISUALIZATION ... ");
            this.set("drawnVisualization", null);
			this.set("isToggled", true);

            var selectedVisualization = this.get("selectedVisualization");
            console.log("SELECTED VISUALIZATION");
            console.dir(selectedVisualization);

            // Reset configuration map
            var configArray = [{}];
            this.set("visualizationConfiguration", configArray);

            if (!selectedVisualization) {
                return;
            }

            var mapping = {
                structureOptions: {},
                layoutOptions: {}
            };

            var customMapping = template_mapping['default'].templateMapping(selectedVisualization);

            mapping.structureOptions = customMapping.structureOptions;
            mapping.layoutOptions = customMapping.layoutOptions;

            console.log("MAPPING - STRUCTURE OPTIONS");
            console.dir(mapping.structureOptions);

            console.log("MAPPING - LAYOUT OPTIONS");
            console.dir(mapping.layoutOptions);

            this.set("structureOptions", mapping.structureOptions);
            this.set("layoutOptions", mapping.layoutOptions);

            // Ensures that bindings on drawnVisualizations are triggered only now
            this.set("drawnVisualization", selectedVisualization);
        }).observes("selectedVisualization"),
        setSuggestedVisualization: (function () {
            var topSuggestion = this.get("firstObject");
            this.set("selectedVisualization", topSuggestion);
        }).observes("model.[]"),
        actions: {
            exportPNG: function exportPNG() {
                var visualization = vis_registry['default'].getVisualization(this.get("selectedVisualization").get("name"));
                visualization.export_as_PNG().then(function (pngURL) {
                    window.open(pngURL);
                });
            },
            exportSVG: function exportSVG() {
                var visualization = vis_registry['default'].getVisualization(this.get("selectedVisualization").get("name"));
                var svgURL = visualization.export_as_SVG();
                window.open(svgURL);
            },
            "export": function _export() {
                var visualization = vis_registry['default'].getVisualization(this.get("selectedVisualization").get("visualizationName"));
                if (this.get("selectedFormat") === "PNG") {
                    visualization.export_as_PNG().then(function (pngURL) {
                        window.open(pngURL);
                    });
                } else {
                    var svgURL = visualization.export_as_SVG();
                    window.open(svgURL);
                }
            },
            publish: function publish() {
                var visualization = vis_registry['default'].getVisualization(this.get("selectedVisualization").get("visualizationName"));
                this.set("visualizationSVG", visualization.get_SVG());
            },
            save: function save() {
                console.log("SAVE VISUALIZATION");
                // send actual visualization model to backend
                var selectedVisualization = this.get("selectedVisualization");
                console.dir(selectedVisualization);

                var configurationName = this.get("configName");

                // send current visualization configuration to backend
                console.log("The value is " + selectedVisualization.get("configurationName"));
                selectedVisualization.set("configurationName", configurationName);

                selectedVisualization.save().then(function () {
                    console.log("SAVED SUCCESSFULLY");
                }, function (response) {
                    if (response && response.status === 200) {
                        console.log("SAVED SUCCESSFULLY (but Ember didn't understand)");
                    } else {
                        console.log("ERROR DURING SAVING");
                        console.log(response);
                    }
                });
            },
            chooseVisualization: function chooseVisualization(visualization) {
                this.set("selectedVisualization", visualization);
            },
            select: function select() {
                console.log("CHANGE DATASELECTION");
                var selectedVisualization = this.get("selectedVisualization");
                var dataselectionID = selectedVisualization.get("dataselection").id;
                var datasourceID = selectedVisualization.get("dataselection.datasource").id;

                this.transitionToRoute("dataselection", dataselectionID, datasourceID);
            },
            toggle: function toggle() {
                var toggled = this.get("isToggled");
				var controller = this;
                Ember['default'].run(function () {
                    if (toggled) {
                        controller.set("isToggled", false);

                    } else {
                        controller.set("isToggled", true);

                    }
                });
            }
        }
    });

});
define('linda-vis-fe/initializers/app-version', ['exports', 'linda-vis-fe/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;
  var registered = false;

  exports['default'] = {
    name: "App Version",
    initialize: function initialize(container, application) {
      if (!registered) {
        var appName = classify(application.toString());
        Ember['default'].libraries.register(appName, config['default'].APP.version);
        registered = true;
      }
    }
  };

});
define('linda-vis-fe/initializers/export-application-global', ['exports', 'ember', 'linda-vis-fe/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    var classifiedName = Ember['default'].String.classify(config['default'].modulePrefix);

    if (config['default'].exportApplicationGlobal && !window[classifiedName]) {
      window[classifiedName] = application;
    }
  }

  ;

  exports['default'] = {
    name: "export-application-global",

    initialize: initialize
  };

});
define('linda-vis-fe/models/dataselection', ['exports', 'ember-data'], function (exports, DS) {

    'use strict';

    exports['default'] = DS['default'].Model.extend({
        datasource: DS['default'].attr(),
        propertyInfos: DS['default'].attr()
    });

});
define('linda-vis-fe/models/datasource', ['exports', 'ember-data'], function (exports, DS) {

    'use strict';

    exports['default'] = DS['default'].Model.extend({
        name: DS['default'].attr("string"),
        location: DS['default'].attr("string"),
        graph: DS['default'].attr("string"),
        format: DS['default'].attr("string")
    });

});
define('linda-vis-fe/models/visualization', ['exports', 'ember-data'], function (exports, DS) {

    'use strict';

    /*The visualization model represents the  initial visualization configuration retrieved from the backend. 
     *And describes the format used for storing the current visualization configuration in the backend.*/
    exports['default'] = DS['default'].Model.extend({
        visualizationName: DS['default'].attr('string'),
        configurationName: DS['default'].attr('string'),
        structureOptions: DS['default'].attr(),
        layoutOptions: DS['default'].attr(),
        visualizationThumbnail: DS['default'].attr('string'),
        valid: DS['default'].attr('boolean'),
        dataselection: DS['default'].belongsTo('dataselection')
    });

});
define('linda-vis-fe/router', ['exports', 'ember', 'linda-vis-fe/config/environment'], function (exports, Ember, config) {

    'use strict';

    var Router = Ember['default'].Router.extend({
        location: config['default'].locationType
    });

    Router.map(function () {
        this.route("visualization", {
            path: "/visualization/:source_type/:id"
        });
        this.route("datasource", {
            path: "/datasource/:name/:location/:graph/:format"
        });
        this.route("dataselection", {
            path: "/dataselection/:selection/:datasource"
        });
        this.route("saved-visualizations");
        this.route("configure");
    });

    exports['default'] = Router;

});
define('linda-vis-fe/routes/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function model() {
      return $.getJSON("/static/visualization/config.json");
    }
  });

});
define('linda-vis-fe/routes/dataselection', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var DataselectionRoute = Ember['default'].Route.extend({
        model: function model(params) {
            console.log("DATASELECTION ROUTE", params.selection);
            return Ember['default'].$.getJSON("http://" + window.location.hostname + "/visualizations/visual/api/dataselections/" + params.selection);
        },
        controllerName: "datasource",
        setupController: function setupController(controller, model) {
            console.log("DATASELECTION ROUTE - SETTING UP THE DATASOURCE CONTROLLER");
            console.log("MODEL");
            console.dir(model);

            controller.set("model", model.dataselection.datasource);

            var dataSelection = controller.get("dataSelection");
            var selection = _.flatten(dataSelection.pushObject(model.dataselection.propertyInfos));

            controller.set("dataSelection", selection);
            controller.set("previousSelection", selection);
        },
        renderTemplate: function renderTemplate() {
            this.render("datasource");
        }
    });

    exports['default'] = DataselectionRoute;

});
define('linda-vis-fe/routes/datasource', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var DatasourceRoute = Ember['default'].Route.extend({
        model: function model(params) {
            var ds = this.store.createRecord("datasource", {
                name: decodeURIComponent(params.name),
                location: decodeURIComponent(params.location),
                graph: decodeURIComponent(params.graph),
                format: decodeURIComponent(params.format)
            });
            return ds.save().then(function (data) {
                return data._data;
            });
        }
    });

    exports['default'] = DatasourceRoute;

});
define('linda-vis-fe/routes/saved-visualizations', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var SavedvisualizationsRoute = Ember['default'].Route.extend({
        // "params" contains the parameters for the visualization route. 
        // The parameters are specified in the router.js.
        // The backend needs the datasource id only for the suggestion algorithm.
        model: function model(params) {
            console.log("LOAD VISUALIZATION VISUALIZATIONS");
            console.dir(params);
            return this.store.find("visualization", { source_type: "visualizationConfiguration" }).then(function (visualizations) {
                console.log("STORED VISUALIZATIONS");
                console.dir(visualizations);
                return visualizations;
            });
        }
    });

    exports['default'] = SavedvisualizationsRoute;

});
define('linda-vis-fe/routes/visualization', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var VisualizationRoute = Ember['default'].Route.extend({
        // "params" contains the parameters for the visualization route. 
        // The parameters are specified in the router.js.
        // The backend needs the datasource id only for the suggestion algorithm.
        model: function model(params) {
            console.log("Requesting visualization model and recommendations from the backend for {" + params.source_type + ", " + params.id + "}");
            console.dir(params);
            return this.store.find("visualization", { source_type: params.source_type, id: params.id }).then(function (visualizations) {
                console.log("Visualizations:");
                console.dir(visualizations);
                return visualizations;
            });
        }
    });

    exports['default'] = VisualizationRoute;

});
define('linda-vis-fe/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.3",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("a");
          dom.setAttribute(el1,"class","navbar-brand");
          dom.setAttribute(el1,"href","#");
          var el2 = dom.createTextNode("\n                        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("img");
          dom.setAttribute(el2,"src","/static/visualization/images/logo.png");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          var el3 = dom.createTextNode(" LinDaViz");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.3",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"type","button");
          dom.setAttribute(el1,"class","btn btn-default navbar-btn");
          var el2 = dom.createTextNode("\n                            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          dom.setAttribute(el2,"class","glyphicon glyphicon-open-file");
          dom.setAttribute(el2,"aria-hidden","true");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.3",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","container");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"id","header");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("nav");
        dom.setAttribute(el3,"class","navbar navbar-default");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","container-fluid");
        var el5 = dom.createTextNode(" \n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","navbar-header");
        var el6 = dom.createTextNode("\n\n");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","collapse navbar-collapse");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","btn-group pull-right");
        dom.setAttribute(el6,"role","group");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("button");
        dom.setAttribute(el7,"type","button");
        dom.setAttribute(el7,"class","btn btn-default navbar-btn");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("span");
        dom.setAttribute(el8,"class","glyphicon glyphicon-cog");
        dom.setAttribute(el8,"aria-hidden","true");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("               \n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, block = hooks.block, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1, 1, 1]);
        var morph0 = dom.createMorphAt(dom.childAt(element1, [1]),1,1);
        var morph1 = dom.createMorphAt(dom.childAt(element1, [3, 1]),3,3);
        var morph2 = dom.createMorphAt(dom.childAt(element0, [3]),1,1);
        block(env, morph0, context, "link-to", ["index"], {"animations": "main:fade"}, child0, null);
        block(env, morph1, context, "link-to", ["saved-visualizations"], {}, child1, null);
        inline(env, morph2, context, "outlet", [], {"animationSequence": "async"});
        return fragment;
      }
    };
  }()));

});
define('linda-vis-fe/templates/components/draggable-item', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.3",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        content(env, morph0, context, "yield");
        return fragment;
      }
    };
  }()));

});
define('linda-vis-fe/templates/components/droppable-area', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.3",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, null);
        dom.insertBoundary(fragment, 0);
        content(env, morph0, context, "yield");
        return fragment;
      }
    };
  }()));

});
define('linda-vis-fe/templates/components/property-item', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.3",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","area-item-label");
        var el2 = dom.createTextNode("\n     ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        var el3 = dom.createTextNode("      \n       ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode(" ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("a");
        dom.setAttribute(el3,"class","area-item-remove");
        var el4 = dom.createTextNode(" X ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode(" \n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, element = hooks.element, content = hooks.content, get = hooks.get;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0, 1]);
        var element1 = dom.childAt(element0, [3]);
        var morph0 = dom.createMorphAt(element0,1,1);
        element(env, element0, context, "bind-attr", [], {"class": "item.datatype"});
        content(env, morph0, context, "item.label");
        element(env, element1, context, "action", ["remove", get(env, context, "item")], {});
        return fragment;
      }
    };
  }()));

});
define('linda-vis-fe/templates/configure', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.3",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","row box");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","large-12 medium-12 columns");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","inner_box dsdefault");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","inner_title_box");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h7");
        var el6 = dom.createTextNode("Configuration");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        var el5 = dom.createTextNode("\n                Here you will be able to change user settings\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("                                                            \n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("                                         \n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("  ");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        return fragment;
      }
    };
  }()));

});
define('linda-vis-fe/templates/datasource', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.3",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          dom.setAttribute(el1,"class","glyphicon glyphicon-resize-full");
          dom.setAttribute(el1,"aria-hidden","true");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode(" \n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.3",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          dom.setAttribute(el1,"class","glyphicon glyphicon-resize-small");
          dom.setAttribute(el1,"aria-hidden","true");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode(" \n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.3",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","row");
        dom.setAttribute(el1,"id","ds_container");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment(" Data Selection ");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","panel panel-default");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","panel-heading");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h1");
        dom.setAttribute(el5,"class","panel-title pull-left");
        var el6 = dom.createTextNode("Explore and Select Data");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","panel-body");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("  \n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","panel-footer clearfix");
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("                                                      \n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("           \n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment(" Data Selection Preview ");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","panel panel-default");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","panel-heading");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h1");
        dom.setAttribute(el5,"class","panel-title pull-left");
        var el6 = dom.createTextNode("Preview Data Selection");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("button");
        dom.setAttribute(el5,"type","button");
        dom.setAttribute(el5,"class","btn btn-default btn-xs pull-right");
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","panel-body");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode(" \n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","panel-footer clearfix");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("button");
        dom.setAttribute(el5,"type","button");
        dom.setAttribute(el5,"class","btn btn-default pull-right");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        dom.setAttribute(el6,"class","glyphicon glyphicon-stats");
        dom.setAttribute(el6,"aria-hidden","true");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("   Visualize\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("     \n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, element = hooks.element, get = hooks.get, inline = hooks.inline, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element0, [3]);
        var element3 = dom.childAt(element2, [3]);
        var element4 = dom.childAt(element3, [1, 3]);
        var element5 = dom.childAt(element3, [5, 1]);
        var morph0 = dom.createMorphAt(dom.childAt(element1, [3, 3]),1,1);
        var morph1 = dom.createMorphAt(element4,1,1);
        var morph2 = dom.createMorphAt(dom.childAt(element3, [3]),1,1);
        element(env, element1, context, "bind-attr", [], {"class": "isToggled:col-md-5:col-md-0"});
        inline(env, morph0, context, "tree-selection", [], {"treedata": get(env, context, "controller.treeContent"), "selection": get(env, context, "controller.dataSelection")});
        element(env, element2, context, "bind-attr", [], {"class": "isToggled:col-md-7:col-md-12"});
        element(env, element4, context, "action", ["toggle"], {});
        block(env, morph1, context, "if", [get(env, context, "isToggled")], {}, child0, child1);
        inline(env, morph2, context, "data-table", [], {"preview": get(env, context, "controller.dataSelection"), "datasource": get(env, context, "controller.selectedDatasource")});
        element(env, element5, context, "action", ["visualize"], {});
        return fragment;
      }
    };
  }()));

});
define('linda-vis-fe/templates/dimension-area', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.3",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, content = hooks.content;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
            dom.insertBoundary(fragment, null);
            dom.insertBoundary(fragment, 0);
            content(env, morph0, context, "type");
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.3",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("any data ");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      var child2 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.3",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("                ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
            inline(env, morph0, context, "property-item", [], {"item": get(env, context, "areaItem"), "collection": get(env, context, "view.content")});
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.3",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","dim-name");
          var el2 = dom.createTextNode("\n           ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" \n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","dim-area-box");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","dim-metadata");
          var el3 = dom.createTextNode("\n           Drag ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("here\n        ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","dim-area-item");
          var el3 = dom.createTextNode("\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("        ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [3]);
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),1,1);
          var morph1 = dom.createMorphAt(dom.childAt(element0, [1]),1,1);
          var morph2 = dom.createMorphAt(dom.childAt(element0, [3]),1,1);
          content(env, morph0, context, "view.label");
          block(env, morph1, context, "each", [get(env, context, "view.metadata")], {"keyword": "type"}, child0, child1);
          block(env, morph2, context, "each", [get(env, context, "view.content")], {"keyword": "areaItem"}, child2, null);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.3",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","area-box");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),1,1);
        block(env, morph0, context, "droppable-area", [], {"inArea": get(env, context, "view.content"), "metadata": get(env, context, "view.metadata"), "label": get(env, context, "view.label"), "maxNumItems": get(env, context, "view.maxCardinality")}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('linda-vis-fe/templates/export-visualization', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.3",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","consumption-title");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        var el4 = dom.createTextNode(" Export as ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode(" \n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("button");
        dom.setAttribute(el3,"type","button");
        dom.setAttribute(el3,"class","btn btn-default btn-xs");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","glyphicon glyphicon-export");
        dom.setAttribute(el4,"aria-hidden","true");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("  Export\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("  \n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline, element = hooks.element;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0, 1]);
        var element1 = dom.childAt(element0, [5]);
        var morph0 = dom.createMorphAt(element0,3,3);
        inline(env, morph0, context, "view", ["Ember.Select"], {"content": get(env, context, "controller.exportFormats"), "value": get(env, context, "controller.selectedFormat"), "class": "btn btn-default dropdown-toggle"});
        element(env, element1, context, "action", ["export"], {});
        return fragment;
      }
    };
  }()));

});
define('linda-vis-fe/templates/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.3",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            17. Newspaper Articles Example (statistical dataset; RDF format)\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.3",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            14. GDP per Capita Example (temporal/statistical dataset; RDF (data cube) format)\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.3",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            1. DepartmentOfAgriculture-Quick Stats (RDF format)\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child3 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.3",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            2. DepartmentOfDefense-Marital Status (RDF format)\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child4 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.3",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            3. DepartmentofHealthandHumanServices-OMH Claims Listed by State (RDF format)\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child5 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.3",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            4. DepartmentOfTheInterior-Wildland Fires 1960-2008 (RDF format)\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child6 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.3",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            5. DepartmentOfState-Africa Conflicts Without Borders 2009 (RDF format)\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child7 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.3",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            6. DepartmentOfTheTreasury-Quarterly Report on Bank Derivatives Activities (RDF format)\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child8 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.3",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            7. DepartmentOfVeteransAffairs-Veterans Health Administration 2008 (RDF format)\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child9 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.3",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            8. GeneralServicesAdministration- Cash and Payments Management Data (RDF format)\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child10 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.3",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("\n            9. NationalScienceFoundation- NSF Research Grant Funding Rates (RDF format)\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child11 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.3",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            10. NationalTransportationSafetyBoardAviation- Fatal Accident Statistics 2008 (RDF format)\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child12 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.3",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            11. OfficeOfPersonnelManagement-Fiscal Year 2007 Employee Survivor Annuitants (RDF format)\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child13 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.3",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            12. SecurityAndExchangeCommission- Public Company Bankruptcy Cases 2009 (RDF format)\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child14 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.3",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            13. Sales Statistics (dimple dataset; CSV format)\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child15 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.3",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            15. Healthcare Example (geographical/statistical dataset; RDF (basic geo) format)\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child16 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.3",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            16. Water Quality Example (statistical dataset; RDF format)\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child17 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.3",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            20. TS1 (statistical dataset; RDF format)\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.3",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","box");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h4");
        var el3 = dom.createTextNode("Example Datasets:");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("ul");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode(" \n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("       \n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("        \n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n         ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n         ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0, 3]);
        var morph0 = dom.createMorphAt(dom.childAt(element0, [1]),1,1);
        var morph1 = dom.createMorphAt(dom.childAt(element0, [3]),1,1);
        var morph2 = dom.createMorphAt(dom.childAt(element0, [5]),1,1);
        var morph3 = dom.createMorphAt(dom.childAt(element0, [7]),1,1);
        var morph4 = dom.createMorphAt(dom.childAt(element0, [9]),1,1);
        var morph5 = dom.createMorphAt(dom.childAt(element0, [11]),1,1);
        var morph6 = dom.createMorphAt(dom.childAt(element0, [13]),1,1);
        var morph7 = dom.createMorphAt(dom.childAt(element0, [15]),1,1);
        var morph8 = dom.createMorphAt(dom.childAt(element0, [17]),1,1);
        var morph9 = dom.createMorphAt(dom.childAt(element0, [19]),1,1);
        var morph10 = dom.createMorphAt(dom.childAt(element0, [21]),1,1);
        var morph11 = dom.createMorphAt(dom.childAt(element0, [23]),1,1);
        var morph12 = dom.createMorphAt(dom.childAt(element0, [25]),1,1);
        var morph13 = dom.createMorphAt(dom.childAt(element0, [27]),1,1);
        var morph14 = dom.createMorphAt(dom.childAt(element0, [29]),1,1);
        var morph15 = dom.createMorphAt(dom.childAt(element0, [31]),1,1);
        var morph16 = dom.createMorphAt(dom.childAt(element0, [33]),1,1);
        var morph17 = dom.createMorphAt(dom.childAt(element0, [35]),1,1);
        block(env, morph2, context, "link-to", ["datasource", "DepartmentOfAgriculture-Quick%20Stats", get(env, context, "datasetsEndpointURI"), "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FDepartmentOfAgriculture-QuickStats.nt", "rdf"], {}, child2, null);
        block(env, morph3, context, "link-to", ["datasource", "DepartmentOfDefense-Marital%20Status", get(env, context, "datasetsEndpointURI"), "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FDepartmentOfDefense-MaritalStatus.nt", "rdf"], {}, child3, null);
        block(env, morph4, context, "link-to", ["datasource", "DepartmentofHealthandHumanServices-OMHClaims%20Listed%20by%20State", get(env, context, "datasetsEndpointURI"), "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FDepartmentofHealthandHumanServices-OMHClaimsListedbyState.nt", "rdf"], {}, child4, null);
        block(env, morph5, context, "link-to", ["datasource", "DepartmentOfTheInterior-Wildl%20and%20Fires%20and%201960-2008", get(env, context, "datasetsEndpointURI"), "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FDepartmentOfTheInterior-WildlandFiresand1960-2008.nt", "rdf"], {}, child5, null);
        block(env, morph6, context, "link-to", ["datasource", "DepartmentofState-Africa%20Conflicts%20Without%20Borders%202009", get(env, context, "datasetsEndpointURI"), "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FDepartmentofState-AfricaConflictsWithoutBorders2009.nt", "rdf"], {}, child6, null);
        block(env, morph7, context, "link-to", ["datasource", "DepartmentOfTheTreasury-Quarterly%20Report%20on%20Bank%20Derivatives%20Activities", get(env, context, "datasetsEndpointURI"), "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FDepartmentOfTheTreasury-QuarterlyReportonBankDerivativesActivities.nt", "rdf"], {}, child7, null);
        block(env, morph8, context, "link-to", ["datasource", "DepartmentOfVeteransAffairs-Veterans%20Health%20Administration%202008", get(env, context, "datasetsEndpointURI"), "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FDepartmentOfVeteransAffairs-VeteransHealthAdministration2008.nt", "rdf"], {}, child8, null);
        block(env, morph9, context, "link-to", ["datasource", "GeneralServicesAdministration-Cash%20and%20Payments%20Management%20Data", get(env, context, "datasetsEndpointURI"), "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FGeneralServicesAdministration-CashandPaymentsManagementData.nt", "rdf"], {}, child9, null);
        block(env, morph10, context, "link-to", ["datasource", "NationalScienceFoundation-NSF%20Research%20Grant%20Funding%20Rates", get(env, context, "datasetsEndpointURI"), "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FNationalScienceFoundation-NSFResearchGrantFundingRates.nt", "rdf"], {}, child10, null);
        block(env, morph11, context, "link-to", ["datasource", "NationalTransportationSafetyBoardAviation-Accident%20Statistics%202008", get(env, context, "datasetsEndpointURI"), "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FNationalTransportationSafetyBoardAviation-AccidentStatistics2008.nt", "rdf"], {}, child11, null);
        block(env, morph12, context, "link-to", ["datasource", "OfficeofPersonnelManagement-Fiscal%20Year%202007%20Employee%20Survivor%20Annuitants", get(env, context, "datasetsEndpointURI"), "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FOfficeofPersonnelManagement-FiscalYear2007EmployeeSurvivorAnnuitants.nt", "rdf"], {}, child12, null);
        block(env, morph13, context, "link-to", ["datasource", "SecurityAndExchangeCommission-Public%20Company%20Bankruptcy%20Cases%202009", get(env, context, "datasetsEndpointURI"), "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FSecurityAndExchangeCommission-PublicCompanyBankruptcyCases2009.nt", "rdf"], {}, child13, null);
        block(env, morph14, context, "link-to", ["datasource", "Sales%20Statistics", "http%3A%2F%2Flocalhost%3A3002%2Ftestsets%2FTS2_Sales_Statistics.csv", "-", "csv"], {}, child14, null);
        block(env, morph15, context, "link-to", ["datasource", "Healthcare%20Analysis", get(env, context, "datasetsEndpointURI"), "http%3A%2F%2Fwww.hospitals_reviewer.com%2F2014", "rdf"], {}, child15, null);
        block(env, morph16, context, "link-to", ["datasource", "Water%20Quality%20Analysis", get(env, context, "datasetsEndpointURI"), "http%3A%2F%2Fwater_quality_check.it%2Finfo", "rdf"], {}, child16, null);
        block(env, morph17, context, "link-to", ["datasource", "Bundestagswahlstatistik", get(env, context, "datasetsEndpointURI"), "http%3A%2F%2FBundestagswahlstatistik", "rdf"], {}, child17, null);
        block(env, morph18, context, "link-to", ["datasource", "Health Data.gov - Hospital Inpatient Discharges by Facility", get(env, context, "datasetsEndpointURI"), "http%3A%2F%2FHealthData.govHospitalInpatientDischargesbyFacility", "rdf"], {}, child18, null);
        block(env, morph19, context, "link-to", ["datasource", "TS1", get(env, context, "datasetsEndpointURI"), "http%3A//www.linda-project.org/TS1_LinearRegression_Result_Original", "rdf"], {}, child19, null);
        return fragment;
      }
    };
  }()));

});
define('linda-vis-fe/templates/properties-list', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        var child0 = (function() {
          var child0 = (function() {
            return {
              isHTMLBars: true,
              revision: "Ember@1.11.3",
              blockParams: 0,
              cachedFragment: null,
              hasRendered: false,
              build: function build(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createTextNode("                        ");
                dom.appendChild(el0, el1);
                var el1 = dom.createElement("span");
                dom.setAttribute(el1,"class","categorized-property-parent");
                var el2 = dom.createComment("");
                dom.appendChild(el1, el2);
                var el2 = dom.createTextNode(" »");
                dom.appendChild(el1, el2);
                dom.appendChild(el0, el1);
                var el1 = dom.createTextNode("\n");
                dom.appendChild(el0, el1);
                return el0;
              },
              render: function render(context, env, contextualElement) {
                var dom = env.dom;
                var hooks = env.hooks, content = hooks.content;
                dom.detectNamespace(contextualElement);
                var fragment;
                if (env.useFragmentCache && dom.canClone) {
                  if (this.cachedFragment === null) {
                    fragment = this.build(dom);
                    if (this.hasRendered) {
                      this.cachedFragment = fragment;
                    } else {
                      this.hasRendered = true;
                    }
                  }
                  if (this.cachedFragment) {
                    fragment = dom.cloneNode(this.cachedFragment, true);
                  }
                } else {
                  fragment = this.build(dom);
                }
                var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
                content(env, morph0, context, "p.label");
                return fragment;
              }
            };
          }());
          return {
            isHTMLBars: true,
            revision: "Ember@1.11.3",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("                   ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("div");
              var el2 = dom.createTextNode("\n                    ");
              dom.appendChild(el1, el2);
              var el2 = dom.createElement("div");
              dom.setAttribute(el2,"class","categorized-property-parents");
              var el3 = dom.createTextNode("\n");
              dom.appendChild(el2, el3);
              var el3 = dom.createComment("");
              dom.appendChild(el2, el3);
              var el3 = dom.createTextNode("                    ");
              dom.appendChild(el2, el3);
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode("\n                    ");
              dom.appendChild(el1, el2);
              var el2 = dom.createElement("div");
              dom.setAttribute(el2,"class","categorized-property-name");
              var el3 = dom.createTextNode("\n                        ");
              dom.appendChild(el2, el3);
              var el3 = dom.createComment("");
              dom.appendChild(el2, el3);
              var el3 = dom.createTextNode("\n                    ");
              dom.appendChild(el2, el3);
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode("\n                  ");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode(" \n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, element = hooks.element, get = hooks.get, block = hooks.block, content = hooks.content;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var element0 = dom.childAt(fragment, [1]);
              var morph0 = dom.createMorphAt(dom.childAt(element0, [1]),1,1);
              var morph1 = dom.createMorphAt(dom.childAt(element0, [3]),1,1);
              element(env, element0, context, "bind-attr", [], {"class": "item.datatype"});
              block(env, morph0, context, "each", [get(env, context, "item.parent")], {"keyword": "p"}, child0, null);
              content(env, morph1, context, "item.label");
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.3",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
            dom.insertBoundary(fragment, null);
            dom.insertBoundary(fragment, 0);
            block(env, morph0, context, "draggable-item", [], {"data": get(env, context, "item"), "tagName": "li"}, child0, null);
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.3",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("\n       ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          var el3 = dom.createTextNode(" ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(" ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("ul");
          dom.setAttribute(el2,"class","categorized-property");
          var el3 = dom.createTextNode("\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("        ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode(" \n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element, content = hooks.content, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element1 = dom.childAt(fragment, [1]);
          var element2 = dom.childAt(element1, [1]);
          var morph0 = dom.createMorphAt(element2,1,1);
          var morph1 = dom.createMorphAt(dom.childAt(element1, [3]),1,1);
          element(env, element2, context, "bind-attr", [], {"class": "category.name"});
          content(env, morph0, context, "category.datatype");
          block(env, morph1, context, "each", [get(env, context, "category.items")], {"keyword": "item"}, child0, null);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.3",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, null);
        dom.insertBoundary(fragment, 0);
        block(env, morph0, context, "each", [get(env, context, "view.categories")], {"keyword": "category"}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('linda-vis-fe/templates/publish-visualization', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.3",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","consumption");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","consumption-title");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("a");
        var el4 = dom.createElement("h7");
        var el5 = dom.createTextNode(" Embed Chart into Website ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, element = hooks.element, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1, 1]);
        var morph0 = dom.createMorphAt(element0,3,3);
        element(env, element1, context, "action", ["publish"], {});
        inline(env, morph0, context, "textarea", [], {"value": get(env, context, "controller.visualizationSVG"), "cols": "60", "rows": "1"});
        return fragment;
      }
    };
  }()));

});
define('linda-vis-fe/templates/save-visualization', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.3",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","consumption-title");
        var el3 = dom.createTextNode("    \n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("    \n         ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("button");
        dom.setAttribute(el3,"type","button");
        dom.setAttribute(el3,"class","btn btn-default btn-xs");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","glyphicon glyphicon-save");
        dom.setAttribute(el4,"aria-hidden","true");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("  Save\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("    \n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline, element = hooks.element;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0, 1]);
        var element1 = dom.childAt(element0, [3]);
        var morph0 = dom.createMorphAt(element0,1,1);
        inline(env, morph0, context, "input", [], {"value": get(env, context, "controller.configName"), "placeholder": "Save settings", "size": "15", "class": "form-control"});
        element(env, element1, context, "action", ["save"], {});
        return fragment;
      }
    };
  }()));

});
define('linda-vis-fe/templates/saved-visualizations', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.3",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("br");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, content = hooks.content;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
            dom.insertBoundary(fragment, 0);
            content(env, morph0, context, "visualization.configurationName");
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.3",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
          block(env, morph0, context, "link-to", ["visualization", "visualizationConfiguration", get(env, context, "visualization.id")], {}, child0, null);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.3",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","row box");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","large-12 medium-12 columns");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","inner_box dsdefault");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","inner_title_box");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h7");
        var el6 = dom.createTextNode("Load");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("                                                            \n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("                                         \n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("  ");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0, 1, 1, 3]),1,1);
        block(env, morph0, context, "each", [get(env, context, "controller")], {"keyword": "visualization"}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('linda-vis-fe/templates/select-field', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.3",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("span");
        dom.setAttribute(el1,"class","configurationOption");
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("  ");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),0,0);
        var morph1 = dom.createMorphAt(fragment,2,2,contextualElement);
        content(env, morph0, context, "view.label");
        inline(env, morph1, context, "view", [get(env, context, "Ember.Select")], {"viewName": "selectField", "content": get(env, context, "view.values"), "optionLabelPath": "content.label", "selection": get(env, context, "view.content")});
        return fragment;
      }
    };
  }()));

});
define('linda-vis-fe/templates/slide-show', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.3",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("div");
          var el2 = dom.createElement("a");
          var el3 = dom.createTextNode(" ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("span");
          var el4 = dom.createTextNode(" ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(" ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [0, 0]);
          var element1 = dom.childAt(element0, [1]);
          element(env, element0, context, "action", ["chooseVisualization", get(env, context, "visualization")], {});
          element(env, element1, context, "bind-attr", [], {"data-visualization-name": "visualization.visualizationName"});
          element(env, element1, context, "bind-attr", [], {"class": "visualization.valid:valid-suggestion:invalid-suggestion :visualization-thumbnail"});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.3",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, null);
        dom.insertBoundary(fragment, 0);
        block(env, morph0, context, "each", [get(env, context, "view.slides")], {"keyword": "visualization"}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('linda-vis-fe/templates/text-field', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.3",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("span");
        dom.setAttribute(el1,"class","configurationOption");
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode(" ");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),0,0);
        var morph1 = dom.createMorphAt(fragment,2,2,contextualElement);
        content(env, morph0, context, "view.label");
        inline(env, morph1, context, "input", [], {"type": "text", "value": get(env, context, "view.content"), "on": "enter", "class": "form-control"});
        return fragment;
      }
    };
  }()));

});
define('linda-vis-fe/templates/tuning-check', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.3",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("span");
        dom.setAttribute(el1,"class","configurationOption");
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("  ");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),0,0);
        var morph1 = dom.createMorphAt(fragment,2,2,contextualElement);
        content(env, morph0, context, "view.label");
        inline(env, morph1, context, "input", [], {"type": "checkbox", "checked": get(env, context, "view.content")});
        return fragment;
      }
    };
  }()));

});
define('linda-vis-fe/templates/tuning-input', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.3",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("span");
        dom.setAttribute(el1,"class","configurationOption");
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("  ");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),0,0);
        var morph1 = dom.createMorphAt(fragment,2,2,contextualElement);
        content(env, morph0, context, "view.label");
        inline(env, morph1, context, "input", [], {"type": "text", "value": get(env, context, "view.content"), "on": "key-press", "class": "form-control Number"});
        return fragment;
      }
    };
  }()));

});
define('linda-vis-fe/templates/tuning-numinput', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.3",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("span");
        dom.setAttribute(el1,"class","configurationOption");
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("  ");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),0,0);
        var morph1 = dom.createMorphAt(fragment,2,2,contextualElement);
        content(env, morph0, context, "view.label");
        inline(env, morph1, context, "input", [], {"type": "text", "value": get(env, context, "view.content"), "on": "key-press"});
        return fragment;
      }
    };
  }()));

});
define('linda-vis-fe/templates/visualization', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.3",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          dom.setAttribute(el1,"class","glyphicon glyphicon-resize-full");
          dom.setAttribute(el1,"aria-hidden","true");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.3",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          dom.setAttribute(el1,"class","glyphicon glyphicon-resize-small");
          dom.setAttribute(el1,"aria-hidden","true");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.3",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","row");
        dom.setAttribute(el1,"id","v_container");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment(" Visualization Selection ");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","panel panel-default");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","panel-heading");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h1");
        dom.setAttribute(el5,"class","panel-title pull-left");
        var el6 = dom.createTextNode("Select Visualization");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","panel-body");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","sliderWrapper");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment(" Visualization Configuration - Left: Tree with data source; Right: dimension mapping ");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","panel panel-default");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","panel-heading");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h1");
        dom.setAttribute(el5,"class","panel-title pull-left");
        var el6 = dom.createTextNode("Configure Visualization");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","panel-body");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","row");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","col-md-6");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","panel panel-default");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8,"class","panel-heading");
        var el9 = dom.createTextNode("\n                                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("h1");
        dom.setAttribute(el9,"class","panel-title pull-left");
        var el10 = dom.createTextNode("Selected Data");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                            ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8,"class","panel-body");
        var el9 = dom.createTextNode("\n                                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createComment("");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                            ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);

        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","col-md-6");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","panel panel-default");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8,"class","panel-heading");
        var el9 = dom.createTextNode("\n                                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("h1");
        dom.setAttribute(el9,"class","panel-title pull-left");
        var el10 = dom.createTextNode("Visualization Options");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                            ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8,"class","panel-body");
        var el9 = dom.createTextNode("\n                                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createComment("");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                            ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","panel-footer clearfix");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("button");
        dom.setAttribute(el5,"type","button");
        dom.setAttribute(el5,"class","btn btn-default pull-right");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        dom.setAttribute(el6,"class","glyphicon glyphicon-stats");
        dom.setAttribute(el6,"aria-hidden","true");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("   Select Data\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment(" Visualization ");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","panel panel-default");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","panel-heading");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h1");
        dom.setAttribute(el5,"class","panel-title pull-left");
        var el6 = dom.createTextNode("Configured Visualization");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("button");
        dom.setAttribute(el5,"type","button");
        dom.setAttribute(el5,"class","btn btn-default btn-xs pull-right");
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","panel-body");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","panel-footer clearfix");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","row");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","col-md-6");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","row");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","row");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","col-md-6");
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);

        var el6 = dom.createComment("<div class=\"col-md-6\"></div>");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n            ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, element = hooks.element, get = hooks.get, inline = hooks.inline, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element1, [7]);
        var element3 = dom.childAt(element2, [3, 1]);
        var element4 = dom.childAt(element2, [5, 1]);
        var element5 = dom.childAt(element0, [3]);
        var element6 = dom.childAt(element5, [3]);
        var element7 = dom.childAt(element6, [1, 3]);
        var element8 = dom.childAt(element6, [5, 1]);
        var element9 = dom.childAt(element8, [1]);
        var morph0 = dom.createMorphAt(dom.childAt(element1, [3, 3, 1]),1,1);
        var morph1 = dom.createMorphAt(dom.childAt(element3, [1, 1, 3]),1,1);
        var morph2 = dom.createMorphAt(dom.childAt(element3, [3, 1, 3]),1,1);
        var morph3 = dom.createMorphAt(element7,1,1);
        var morph4 = dom.createMorphAt(dom.childAt(element6, [3]),1,1);
        var morph5 = dom.createMorphAt(dom.childAt(element9, [1]),1,1);
        var morph6 = dom.createMorphAt(dom.childAt(element9, [3]),1,1);
        var morph7 = dom.createMorphAt(dom.childAt(element8, [3]),1,1);
        element(env, element1, context, "bind-attr", [], {"class": "isToggled:col-md-5:col-md-0"});
        inline(env, morph0, context, "view", ["slide-show"], {"slides": get(env, context, "controller.model")});
        inline(env, morph1, context, "view", ["properties-list"], {"categories": get(env, context, "controller.categorizedProperties")});
        inline(env, morph2, context, "view", ["visualization-options"], {"options": get(env, context, "controller.structureOptions"), "config": get(env, context, "controller.visualizationConfiguration")});
        element(env, element4, context, "action", ["select"], {});
        element(env, element5, context, "bind-attr", [], {"class": "isToggled:col-md-7:col-md-12"});
        element(env, element7, context, "action", ["toggle"], {});
        block(env, morph3, context, "if", [get(env, context, "isToggled")], {}, child0, child1);
        inline(env, morph4, context, "view", ["draw-visualization"], {"id": "visualization", "visualization": get(env, context, "controller.drawnVisualization"), "configurationArray": get(env, context, "controller.visualizationConfiguration"), "isToggled": get(env, context, "controller.isToggled")});
        inline(env, morph5, context, "partial", ["export-visualization"], {});
        inline(env, morph6, context, "partial", ["save-visualization"], {});
        inline(env, morph7, context, "view", ["visualization-options"], {"options": get(env, context, "controller.layoutOptions"), "config": get(env, context, "controller.visualizationConfiguration")});
        return fragment;
      }
    };
  }()));

});
define('linda-vis-fe/tests/adapters/application.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/application.js should pass jshint', function() { 
    ok(true, 'adapters/application.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/app.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('app.js should pass jshint', function() { 
    ok(true, 'app.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/components/data-table.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/data-table.js should pass jshint', function() { 
    ok(true, 'components/data-table.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/components/draggable-item.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/draggable-item.js should pass jshint', function() { 
    ok(true, 'components/draggable-item.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/components/droppable-area.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/droppable-area.js should pass jshint', function() { 
    ok(true, 'components/droppable-area.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/components/property-item.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/property-item.js should pass jshint', function() { 
    ok(true, 'components/property-item.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/components/tree-selection.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/tree-selection.js should pass jshint', function() { 
    ok(true, 'components/tree-selection.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/controllers/datasource.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/datasource.js should pass jshint', function() { 
    ok(true, 'controllers/datasource.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/controllers/index.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/index.js should pass jshint', function() { 
    ok(true, 'controllers/index.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/controllers/visconfiguration.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/visconfiguration.js should pass jshint', function() { 
    ok(true, 'controllers/visconfiguration.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/controllers/visualization.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/visualization.js should pass jshint', function() { 
    ok(true, 'controllers/visualization.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/helpers/resolver', ['exports', 'ember/resolver', 'linda-vis-fe/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('linda-vis-fe/tests/helpers/resolver.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/resolver.js should pass jshint', function() { 
    ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/helpers/start-app', ['exports', 'ember', 'linda-vis-fe/app', 'linda-vis-fe/router', 'linda-vis-fe/config/environment'], function (exports, Ember, Application, Router, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('linda-vis-fe/tests/helpers/start-app.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/start-app.js should pass jshint', function() { 
    ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/models/dataselection.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/dataselection.js should pass jshint', function() { 
    ok(true, 'models/dataselection.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/models/datasource.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/datasource.js should pass jshint', function() { 
    ok(true, 'models/datasource.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/models/visualization.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/visualization.js should pass jshint', function() { 
    ok(true, 'models/visualization.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/router.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('router.js should pass jshint', function() { 
    ok(true, 'router.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/routes/application.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/application.js should pass jshint', function() { 
    ok(true, 'routes/application.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/routes/dataselection.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/dataselection.js should pass jshint', function() { 
    ok(true, 'routes/dataselection.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/routes/datasource.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/datasource.js should pass jshint', function() { 
    ok(true, 'routes/datasource.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/routes/saved-visualizations.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/saved-visualizations.js should pass jshint', function() { 
    ok(true, 'routes/saved-visualizations.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/routes/visualization.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/visualization.js should pass jshint', function() { 
    ok(true, 'routes/visualization.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/test-helper', ['linda-vis-fe/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('linda-vis-fe/tests/test-helper.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('test-helper.js should pass jshint', function() { 
    ok(true, 'test-helper.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/utils/area-chart.jshint', function () {

  'use strict';

  module('JSHint - utils');
  test('utils/area-chart.js should pass jshint', function() { 
    ok(true, 'utils/area-chart.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/utils/bubble-chart.jshint', function () {

  'use strict';

  module('JSHint - utils');
  test('utils/bubble-chart.js should pass jshint', function() { 
    ok(true, 'utils/bubble-chart.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/utils/column-chart.jshint', function () {

  'use strict';

  module('JSHint - utils');
  test('utils/column-chart.js should pass jshint', function() { 
    ok(true, 'utils/column-chart.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/utils/csv-data-module.jshint', function () {

  'use strict';

  module('JSHint - utils');
  test('utils/csv-data-module.js should pass jshint', function() { 
    ok(true, 'utils/csv-data-module.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/utils/export-visualization.jshint', function () {

  'use strict';

  module('JSHint - utils');
  test('utils/export-visualization.js should pass jshint', function() { 
    ok(true, 'utils/export-visualization.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/utils/line-chart.jshint', function () {

  'use strict';

  module('JSHint - utils');
  test('utils/line-chart.js should pass jshint', function() { 
    ok(true, 'utils/line-chart.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/utils/map.jshint', function () {

  'use strict';

  module('JSHint - utils');
  test('utils/map.js should pass jshint', function() { 
    ok(true, 'utils/map.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/utils/pie-chart.jshint', function () {

  'use strict';

  module('JSHint - utils');
  test('utils/pie-chart.js should pass jshint', function() { 
    ok(true, 'utils/pie-chart.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/utils/scatter-chart.jshint', function () {

  'use strict';

  module('JSHint - utils');
  test('utils/scatter-chart.js should pass jshint', function() { 
    ok(true, 'utils/scatter-chart.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/utils/sparql-data-module.jshint', function () {

  'use strict';

  module('JSHint - utils');
  test('utils/sparql-data-module.js should pass jshint', function() { 
    ok(true, 'utils/sparql-data-module.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/utils/table-data-module.jshint', function () {

  'use strict';

  module('JSHint - utils');
  test('utils/table-data-module.js should pass jshint', function() { 
    ok(true, 'utils/table-data-module.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/utils/template-mapping.jshint', function () {

  'use strict';

  module('JSHint - utils');
  test('utils/template-mapping.js should pass jshint', function() { 
    ok(true, 'utils/template-mapping.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/utils/tree-selection-data-module.jshint', function () {

  'use strict';

  module('JSHint - utils');
  test('utils/tree-selection-data-module.js should pass jshint', function() { 
    ok(true, 'utils/tree-selection-data-module.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/utils/util.jshint', function () {

  'use strict';

  module('JSHint - utils');
  test('utils/util.js should pass jshint', function() { 
    ok(true, 'utils/util.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/utils/visualization-registry.jshint', function () {

  'use strict';

  module('JSHint - utils');
  test('utils/visualization-registry.js should pass jshint', function() { 
    ok(true, 'utils/visualization-registry.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/views/draw-visualization.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/draw-visualization.js should pass jshint', function() { 
    ok(true, 'views/draw-visualization.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/views/properties-list.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/properties-list.js should pass jshint', function() { 
    ok(true, 'views/properties-list.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/views/slide-show.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/slide-show.js should pass jshint', function() { 
    ok(true, 'views/slide-show.js should pass jshint.'); 
  });

});
define('linda-vis-fe/tests/views/visualization-options.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/visualization-options.js should pass jshint', function() { 
    ok(true, 'views/visualization-options.js should pass jshint.'); 
  });

});
define('linda-vis-fe/utils/area-chart', ['exports', 'linda-vis-fe/utils/util', 'linda-vis-fe/utils/export-visualization'], function (exports, util, exportVis) {

    'use strict';

    var areachart = (function () {

        function draw(configuration, visualisationContainerID) {
            console.log("### INITIALIZE VISUALISATION - AREA CHART");

            var container = $("#" + visualisationContainerID);
            container.empty();

            var xAxis = configuration["Horizontal Axis"];
            var yAxis = configuration["Vertical Axis"];
            var group = configuration.Series;

            if (!(configuration.dataModule && configuration.datasourceLocation && xAxis && yAxis && group)) {
                return $.Deferred().resolve().promise();
            }

            if (xAxis.length === 0 || yAxis.length === 0) {
                return $.Deferred().resolve().promise();
            }

            var dataModule = configuration.dataModule;
            var location = configuration.datasourceLocation;
            var graph = configuration.datasourceGraph;
            var gridlines = configuration.Gridlines;
            var tooltip = configuration.Tooltip;
            var hLabel = configuration["Horizontal Label"];
            var vLabel = configuration["Vertical Label"];

            var selection = {
                dimension: yAxis, // measure
                multidimension: xAxis.concat(group),
                gridlines: gridlines,
                tooltip: tooltip,
                hLabel: hLabel,
                vLabel: vLabel
            };

            console.log("VISUALISATION SELECTION FOR AREA CHART:");
            console.dir(selection);

            var svg = dimple.newSvg("#" + visualisationContainerID, container.width(), container.height());

            return dataModule.parse(location, graph, selection).then(function (inputData) {
                var columnsHeaders = inputData[0];
                var data = util['default'].createRows(inputData);
                console.log("GENERATE INPUT DATA FORMAT FOR AREA CHART");
                console.dir(data);

                var chart = new dimple.chart(svg, data);

                var x = chart.addCategoryAxis("x", columnsHeaders[1]); // x axis: ordinal values
                var y = chart.addMeasureAxis("y", columnsHeaders[0]); // y axis: one measure (scale) 

                var series = null;

                if (group.length > 0) {
                    series = columnsHeaders.slice(2);
                }

                chart.addSeries(series, dimple.plot.area);
                chart.addLegend("10%", "5%", "80%", 20, "right");

                //gridlines tuning
                //x.showGridlines = selection.gridlines;
                //y.showGridlines = selection.gridlines;
                //titles
                if (selection.hLabel === "" || selection.hLabel === "Label") {
                    selection.hLabel = columnsHeaders[1];
                }
                if (selection.vLabel === "" || selection.vLabel === "Label") {
                    selection.vLabel = columnsHeaders[0];
                }
                x.title = selection.hLabel;
                y.title = selection.vLabel;
                //ticks
                x.ticks = selection.gridlines;
                y.ticks = selection.gridlines;
                //tooltip
                if (selection.tooltip === false) {
                    chart.addSeries(series, dimple.plot.area).addEventHandler("mouseover", function () {});
                }

                chart.draw();
            });
        }

        function export_as_PNG() {
            return exportVis['default'].export_PNG();
        }

        function export_as_SVG() {
            return exportVis['default'].export_SVG();
        }

        function get_SVG() {
            return exportVis['default'].get_SVG();
        }

        return {
            export_as_PNG: export_as_PNG,
            export_as_SVG: export_as_SVG,
            get_SVG: get_SVG,
            draw: draw
        };
    })();

    exports['default'] = areachart;

});
define('linda-vis-fe/utils/bubble-chart', ['exports', 'linda-vis-fe/utils/util', 'linda-vis-fe/utils/export-visualization'], function (exports, util, exportVis) {

    'use strict';

    var bubblechart = (function () {
        var seriesHeaders = [];
        var data = [];

        function draw(configuration, visualisationContainerID) {
            console.log("### INITIALIZE VISUALISATION - BUBBLE CHART");

            var container = $("#" + visualisationContainerID);
            container.empty();

            var xAxis = configuration["Horizontal Axis"];
            var yAxis = configuration["Vertical Axis"];
            var size = configuration.Size;
            var label = configuration.Label;
            var group = configuration.Groups;

            if (!(configuration.dataModule && configuration.datasourceLocation && xAxis && yAxis && size && label && group)) {
                return $.Deferred().resolve().promise();
            }

            if (xAxis.length === 0 || yAxis.length === 0 || size.lenght === 0) {
                return $.Deferred().resolve().promise();
            }

            var dataModule = configuration.dataModule;
            var location = configuration.datasourceLocation;
            var graph = configuration.datasourceGraph;
            var gridlines = configuration.Gridlines;
            var tooltip = configuration.Tooltip;
            var hLabel = configuration["Horizontal Label"];
            var vLabel = configuration["Vertical Label"];

            var selection = {
                dimension: [],
                multidimension: label.concat(xAxis).concat(yAxis).concat(size).concat(group),
                gridlines: gridlines,
                tooltip: tooltip,
                hLabel: hLabel,
                vLabel: vLabel
            };

            console.log("VISUALIZATION SELECTION FOR BUBBLE CHART:");
            console.dir(selection);

            var svg = dimple.newSvg("#" + visualisationContainerID, container.width(), container.height());

            return dataModule.parse(location, graph, selection).then(function (inputData) {
                console.log("GENERATE INPUT DATA FORMAT FOR BUBBLE CHART - INPUT DATA");
                console.dir(inputData);
                seriesHeaders = inputData[0];
                data = util['default'].createRows(inputData);

                if (label.length === 0) {
                    seriesHeaders.splice(0, 0, "Number");
                    for (var i = 0; i < data.length; i++) {
                        var row = data[i];
                        row.Number = i;
                    }
                }

                console.log("GENERATE INPUT DATA FORMAT FOR BUBBLE CHART - OUTPUT DATA");
                console.dir(data);

                var chart = new dimple.chart(svg, data);

                var labelAxisName = seriesHeaders[0];
                var xAxisName = seriesHeaders[1];
                var yAxisName = seriesHeaders[2];

                var sizeAxisName;
                if (size.length > 0) {
                    sizeAxisName = seriesHeaders[3];
                }

                var groupAxisName;
                if (group.length > 0) {
                    groupAxisName = seriesHeaders[3 + size.length];
                }

                var x = chart.addMeasureAxis("x", xAxisName);
                var y = chart.addMeasureAxis("y", yAxisName);

                if (sizeAxisName) {
                    chart.addMeasureAxis("z", sizeAxisName);
                }

                var series = [labelAxisName];

                if (groupAxisName) {
                    series.push(groupAxisName);
                }

                console.log("SERIES:");
                console.dir(series);

                chart.addSeries(series, dimple.plot.bubble);
                chart.addLegend("50%", "10%", 500, 20, "right");

                //gridlines tuning
                //x.showGridlines = selection.gridlines;
                //y.showGridlines = selection.gridlines;
                //titles
                if (selection.hLabel === "" || selection.hLabel === "Label") {
                    selection.hLabel = seriesHeaders[1];
                }
                if (selection.vLabel === "" || selection.vLabel === "Label") {
                    selection.vLabel = seriesHeaders[2];
                }
                x.title = selection.hLabel;
                y.title = selection.vLabel;
                //ticks
                x.ticks = selection.gridlines;
                y.ticks = selection.gridlines;
                //tooltip
                if (selection.tooltip === false) {
                    chart.addSeries(series, dimple.plot.bubble).addEventHandler("mouseover", function () {});
                }

                chart.draw();
            });
        }

        function export_as_PNG() {
            return exportVis['default'].export_PNG();
        }

        function export_as_SVG() {
            return exportVis['default'].export_SVG();
        }

        function get_SVG() {
            return exportVis['default'].get_SVG();
        }

        return {
            export_as_PNG: export_as_PNG,
            export_as_SVG: export_as_SVG,
            get_SVG: get_SVG,
            draw: draw
        };
    })();

    exports['default'] = bubblechart;

});
define('linda-vis-fe/utils/column-chart', ['exports', 'linda-vis-fe/utils/util', 'linda-vis-fe/utils/export-visualization'], function (exports, util, exportVis) {

    'use strict';

    var columnchart = (function () {
        var seriesHeaders = [];
        var series = [];

        function draw(configuration, visualisationContainerID) {
            console.log("### INITIALIZE VISUALISATION - COLUMN CHART");

            var container = $("#" + visualisationContainerID);
            container.empty();

            var xAxis = configuration["Horizontal Axis"];
            var yAxis = configuration["Vertical Axis"];
            var group = configuration.Groups;

            if (!(configuration.dataModule && configuration.datasourceLocation && xAxis && yAxis && group)) {
                return $.Deferred().resolve().promise();
            }

            if (xAxis.length === 0 || yAxis.length === 0) {
                return $.Deferred().resolve().promise();
            }

            var dataModule = configuration.dataModule;
            var location = configuration.datasourceLocation;
            var graph = configuration.datasourceGraph;
            var gridlines = configuration.Gridlines;
            var tooltip = configuration.Tooltip;
            var hLabel = configuration["Horizontal Label"];
            var vLabel = configuration["Vertical Label"];

            var selection = {
                dimension: yAxis, // measure
                multidimension: xAxis.concat(group), // categories
                gridlines: gridlines,
                tooltip: tooltip,
                hLabel: hLabel,
                vLabel: vLabel
            };

            console.log("VISUALIZATION SELECTION FOR COLUMN CHART:");
            console.dir(selection);

            var svg = dimple.newSvg("#" + visualisationContainerID, container.width(), container.height());

            return dataModule.parse(location, graph, selection).then(function (inputData) {
                seriesHeaders = inputData[0];
                series = util['default'].createRows(inputData);
                console.log("GENERATE INPUT DATA FORMAT FOR COLUMN CHART");
                console.dir(series);

                var chart = new dimple.chart(svg, series);

                var categoryAxis;
                var measureAxis;
                if (configuration.horizontal) {
                    categoryAxis = "y";
                    measureAxis = "x";
                } else {
                    categoryAxis = "x";
                    measureAxis = "y";
                }

                var dim1 = chart.addCategoryAxis(categoryAxis, seriesHeaders.slice(1, 1 + xAxis.length + group.length)); // x axis: more categories       
                var dim2 = chart.addMeasureAxis(measureAxis, seriesHeaders[0]); // y axis: one measure (scale)                      

                if (group.length > 0) {
                    // simple column groups
                    chart.addSeries(seriesHeaders[seriesHeaders.length - 1], dimple.plot.bar);
                } else {
                    chart.addSeries(null, dimple.plot.bar);
                }
                chart.addLegend("10%", "5%", "80%", 20, "right");

                if (selection.hLabel === "" || selection.hLabel === "Label") {
                    selection.hLabel = seriesHeaders[1];
                }
                if (selection.vLabel === "" || selection.vLabel === "Label") {
                    selection.vLabel = seriesHeaders[0];
                }
                dim1.title = selection.hLabel;
                dim2.title = selection.vLabel;

                dim1.ticks = selection.gridlines;
                dim2.ticks = selection.gridlines;

                //tooltip
                if (selection.tooltip === false) {
                    chart.addSeries(series, dimple.plot.bar).addEventHandler("mouseover", function () {});
                }

                chart.draw();
            });
        }

        function export_as_PNG() {
            return exportVis['default'].export_PNG();
        }

        function export_as_SVG() {
            return exportVis['default'].export_SVG();
        }

        function get_SVG() {
            return exportVis['default'].get_SVG();
        }

        return {
            export_as_PNG: export_as_PNG,
            export_as_SVG: export_as_SVG,
            get_SVG: get_SVG,
            draw: draw
        };
    })();

    exports['default'] = columnchart;

});
define('linda-vis-fe/utils/csv-data-module', ['exports', 'linda-vis-fe/utils/util'], function (exports, util) {

    'use strict';

    var csv_data_module = (function () {
        var saved_location;
        var saved_data;

        function parse(location, graph, selection) {
            console.log("CSV DATA MODULE");
            var dimension = selection.dimension;
            var multidimension = selection.multidimension;

            return queryInstances(location, null, dimension.concat(multidimension));
        }

        function queryInstances(location, dummy, selection) {
            console.log("QUERY INSTANCES");

            var dataPromise;
            if (saved_location === location) {
                dataPromise = $.Deferred().resolve(saved_data).promise();
            } else {
                dataPromise = $.get(location);
            }

            return dataPromise.then(function (data) {
                saved_location = location;
                saved_data = data;
                return CSV.toArrays(data, { onParseValue: util['default'].toScalar });
            }).then(function (dataArray) {
                var columns = [];
                for (var i = 0; i < selection.length; i++) {
                    var column = _.rest(selection[i].parent);
                    columns.push(column[0]);
                }
                return convert(dataArray, columns);
            });
        }

        function queryClasses() {
            console.log("QUERY CLASSES");

            var dfd = new $.Deferred();
            var dataInfo = {
                id: "Columns",
                label: "Columns",
                type: "Class",
                grandchildren: true
            };
            dfd.resolve([dataInfo]);
            return dfd.promise();
        }

        function queryProperties(location, dummy1, dummy2, _properties) {
            console.log("QUERY PTOPERTIES");
			
            var dfd = new $.Deferred();

            if (_properties.length > 0) {
                dfd.resolve([]);
                return dfd.promise();
            } else {
                return $.get(location).then(function (data) {
					console.log(data);
                    return CSV.toArrays(data, { onParseValue: util['default'].toScalar, start: 0, end: 2 });
                }).then(function (dataArray) {
                    var names = dataArray[0];
                    var values = dataArray[1];
                    var columns = [];

                    for (var i = 0; i < names.length; i++) {
                        var dataInfo = {
                            id: i.toString(),
                            label: names[i],
                            grandchildren: false,
                            role: null,
                            special: false,
                            type: util['default'].predictValueSOM(values[i])
                        };
                        columns.push(dataInfo);
                    }
                    return columns;
                });
            }
        }

        function convert(arrayData, columnsOrder) {
            console.log("CONVERT");

            var result = [];
            var row = [];

            for (var i = 0; i < arrayData.length; i++) {
                var record = [];
                row = arrayData[i];
                for (var j = 0; j < columnsOrder.length; j++) {
                    var order = parseInt(columnsOrder[j].id);
                    record.push(row[order]);
                }
                result.push(record);
            }
            return result;
        }

        return {
            queryClasses: queryClasses,
            queryProperties: queryProperties,
            queryInstances: queryInstances,
            parse: parse
        };
    })();

    exports['default'] = csv_data_module;

});
define('linda-vis-fe/utils/export-visualization', ['exports'], function (exports) {

    'use strict';

    /* global $ */
    var exportVis = (function () {

        function export_PNG() {
            var svg = get_SVG();
            var image = $("<img />", { id: "chart", style: "display:none", src: "data:image/svg+xml," + encodeURIComponent(svg) });
            image.appendTo($("#visualization"));
            var dfd = new $().Deferred();

            $("#chart").one("load", function () {
                var canvas = $("<canvas/>", { id: "canvas" });
                canvas[0].width = 1050;
                canvas[0].height = 510;
                canvas.appendTo($("#visualization"));
                var context = canvas[0].getContext("2d");

                // Generate a PNG with canvg.
                context.drawSvg(svg, 0, 0, 1050, 510);

                var pngURL = canvas[0].toDataURL("image/png");
                var downloadURL = pngURL.replace(/^data:image\/png/, "data:application/octet-stream");

                dfd.resolve(downloadURL);

                canvas.remove();
                $(this).remove();
            }).each(function () {
                if (this.complete) {
                    $(this).load();
                }
            });

            var imgURL = dfd.promise();

            return imgURL;
        }

        function export_SVG() {
            var svg = get_SVG();
            var svgURL = "data:application/octet-stream," + encodeURIComponent(svg);

            return svgURL;
        }

        function get_SVG(cssFilename) {
            var svg = $("#visualization").find("svg");

            if (svg.length === 0) {
                return;
            }

            var serializer = new XMLSerializer();
            var svg_ = serializer.serializeToString(svg[0]);

            svg.find("defs").remove();

            svg.attr("version", "1.1");
            svg.attr("xmlns", "http://www.w3.org/2000/svg");
            svg.attr("xmlns:xlink", "http://www.w3.org/1999/xlink");

            if (cssFilename) {
                var css = "";

                // Take all the styles from your visualization library and make them inline.
                $().each(document.styleSheets, function (sheetIndex, sheet) {

                    if (sheet.href !== null && endsWith(sheet.href, cssFilename)) {
                        $().each(sheet.cssRules || sheet.rules, function (ruleIndex, rule) {

                            css += rule.cssText + "\n";
                        });
                    }
                });

                var style = $("<style />", { type: "text/css" });
                style.prependTo(svg);
                svg_ = svg_.replace("</style>", "<![CDATA[" + css + "]]></style>");
            }

            return svg_;
        }

        function endsWith(str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        }

        return {
            export_PNG: export_PNG,
            export_SVG: export_SVG,
            get_SVG: get_SVG
        };
    })();

    exports['default'] = exportVis;

});
define('linda-vis-fe/utils/line-chart', ['exports', 'linda-vis-fe/utils/util', 'linda-vis-fe/utils/export-visualization'], function (exports, util, exportVis) {

    'use strict';

    var linechart = (function () {

        function draw(configuration, visualisationContainerID) {
            console.log("### INITIALIZE VISUALISATION - LINE CHART");

            var container = $("#" + visualisationContainerID);
            container.empty();

            var xAxis = configuration["Horizontal Axis"];
            var yAxis = configuration["Vertical Axis"];
            var group = configuration.Series;

            if (!(configuration.dataModule && configuration.datasourceLocation && xAxis && yAxis && group)) {
                return $.Deferred().resolve().promise();
            }

            if (xAxis.length === 0 || yAxis.length === 0) {
                return $.Deferred().resolve().promise();
            }

            var dataModule = configuration.dataModule;
            var location = configuration.datasourceLocation;
            var graph = configuration.datasourceGraph;
            var gridlines = configuration.Gridlines;
            var tooltip = configuration.Tooltip;
            var hLabel = configuration["Horizontal Label"];
            var vLabel = configuration["Vertical Label"];

            var selection = {
                dimension: yAxis, // measure
                multidimension: xAxis.concat(group),
                gridlines: gridlines,
                tooltip: tooltip,
                hLabel: hLabel,
                vLabel: vLabel
            };

            console.log("VISUALISATION SELECTION FOR LINE CHART:");
            console.dir(selection);

            var svg = dimple.newSvg("#" + visualisationContainerID, container.width(), container.height());

            return dataModule.parse(location, graph, selection).then(function (inputData) {
                var columnsHeaders = inputData[0];
                var data = util['default'].createRows(inputData);
                console.log("GENERATE INPUT DATA FORMAT FOR LINE CHART");
                console.dir(data);

                var chart = new dimple.chart(svg, data);

                var x = chart.addCategoryAxis("x", columnsHeaders[1]); // x axis: ordinal values
                var y = chart.addMeasureAxis("y", columnsHeaders[0]); // y axis: one measure (scale) 

                var series = null;

                if (group.length > 0) {
                    series = columnsHeaders.slice(2);
                }

                chart.addSeries(series, dimple.plot.line);
                chart.addLegend("10%", "5%", "80%", 20, "right");

                //gridlines tuning
                //x.showGridlines = selection.gridlines;
                //y.showGridlines = selection.gridlines;
                //titles
                if (selection.hLabel === "" || selection.hLabel === "Label") {
                    selection.hLabel = columnsHeaders[1];
                }
                if (selection.vLabel === "" || selection.vLabel === "Label") {
                    selection.vLabel = columnsHeaders[0];
                }
                x.title = selection.hLabel;
                y.title = selection.vLabel;
                //ticks
                x.ticks = selection.gridlines;
                y.ticks = selection.gridlines;
                //tooltip
                if (selection.tooltip === false) {
                    chart.addSeries(series, dimple.plot.line).addEventHandler("mouseover", function () {});
                }

                chart.draw();
            });
        }

        function export_as_PNG() {
            return exportVis['default'].export_PNG();
        }

        function export_as_SVG() {
            return exportVis['default'].export_SVG();
        }

        function get_SVG() {
            return exportVis['default'].get_SVG();
        }

        return {
            export_as_PNG: export_as_PNG,
            export_as_SVG: export_as_SVG,
            get_SVG: get_SVG,
            draw: draw
        };
    })();

    exports['default'] = linechart;

});
define('linda-vis-fe/utils/map', ['exports', 'linda-vis-fe/utils/util'], function (exports, util) {

    'use strict';

    var map = (function () {
        // map/openstreetmap module (js module pattern)

        var map = null;
        function draw(configuration, visualisationContainer) {
            console.log("### INITIALIZE VISUALISATION - MAP");
            if (map) {
                map = map.remove();
                map = null;
            }

            $("#" + visualisationContainer).empty();
            var label = configuration.Label;
            var lat = configuration.Latitude;
            var long = configuration.Longitude;
            var indicator = configuration.Indicator;
            if (!(configuration.dataModule && configuration.datasourceLocation && label && lat && long && indicator)) {
                return $.Deferred().resolve().promise();
            }

            if (lat.length === 0 || long.length === 0) {
                return $.Deferred().resolve().promise();
            }

            map = new L.Map(visualisationContainer);
            L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "&copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>",
                zoom: 8
            }).addTo(map);
            var dataModule = configuration.dataModule;
            var latPropertyInfo = lat[0];
            var longPropertyInfo = long[0];
            var labelPropertyInfos = label;
            var indicatorPropertyInfos = indicator;
            var currColumn = 0;
            var latColumn = currColumn++;
            var longColumn = currColumn++;
            var labelColumns = _.range(currColumn, currColumn + labelPropertyInfos.length);
            currColumn += labelPropertyInfos.length;
            var indicatorColumns = _.range(currColumn, currColumn + indicatorPropertyInfos.length);
            currColumn += indicatorPropertyInfos.length;
            var dimensions = [];
            var labels = [];
            var indicators = [];
            var group = [];
            dimensions.push(latPropertyInfo);
            dimensions.push(longPropertyInfo);
            for (var i = 0; i < labelPropertyInfos.length; i++) {
                if (labelPropertyInfos[i].groupBy) {
                    group.push(labelPropertyInfos[i]);
                } else {
                    labels.push(labelPropertyInfos[i]);
                }
            }
            for (var j = 0; j < indicatorPropertyInfos.length; j++) {
                if (indicatorPropertyInfos[j].groupBy) {
                    group.push(indicatorPropertyInfos[j]);
                } else {
                    indicators.push(indicatorPropertyInfos[j]);
                }
            }

            var selection = {
                dimension: dimensions,
                multidimension: labels.concat(indicators),
                group: group
            };
            var location = configuration.datasourceLocation;
            var graph = configuration.datasourceGraph;
            return dataModule.parse(location, graph, selection).then(function (data) {
                console.log("CONVERTED INPUT DATA FOR MAP VISUALIZATION");
                console.dir(data);
                var minLat = 90;
                var maxLat = -90;
                var minLong = 180;
                var maxLong = -180;
                var minHue = 0;
                var maxHue = 120;
                var minIndicatorValues = [];
                var maxIndicatorValues = [];
                for (var j = 0; j < indicatorColumns.length; j++) {
                    var minIndicatorValue = Number.MAX_VALUE;
                    var maxIndicatorValue = Number.MIN_VALUE;
                    for (var i = 1; i < data.length; ++i) {
                        var row = data[i];
                        var indicatorColumn = indicatorColumns[j]; // spaltenindex
                        var indicatorValue = row[indicatorColumn];
                        if (minIndicatorValue > indicatorValue) {
                            minIndicatorValue = indicatorValue;
                        }
                        if (maxIndicatorValue < indicatorValue) {
                            maxIndicatorValue = indicatorValue;
                        }
                    }
                    minIndicatorValues.push(minIndicatorValue);
                    maxIndicatorValues.push(maxIndicatorValue);
                }

                for (var k = 1; k < data.length; ++k) {
                    var row_ = data[k];
                    var lat = parseFloat(row_[latColumn]);
                    var long = parseFloat(0 + row_[longColumn]);
                    if (!lat || !long) {
                        console.warn("No lat or long in row:");
                        console.dir(row_);
                        continue;
                    }
                    minLat = Math.min(minLat, lat);
                    maxLat = Math.max(maxLat, lat);
                    minLong = Math.min(minLong, long);
                    maxLong = Math.max(maxLong, long);
                }

                if (indicatorColumns.length === 1) {
                    var iColumn = indicatorColumns[0];

                    var columnsHeaders = data[0];
                    var dataLayerOptions = {
                        recordsField: "features",
                        latitudeField: columnsHeaders[0],
                        longitudeField: columnsHeaders[1],
                        locationMode: L.LocationModes.LATLNG,
                        displayOptions: {},
                        layerOptions: {
                            numberOfSides: 4,
                            radius: 10,
                            weight: 1,
                            color: "#000",
                            opacity: 0.2,
                            stroke: true,
                            fillOpacity: 0.7,
                            dropShadow: true,
                            gradient: true
                        },
                        tooltipOptions: {
                            iconSize: new L.Point(90, 76),
                            iconAnchor: new L.Point(-4, 76)
                        },
                        onEachRecord: function onEachRecord(layer, record) {
                            var $html = $(L.HTMLUtils.buildTable(record));
                            layer.bindPopup($html.wrap("<div/>").parent().html(), {
                                minWidth: 400,
                                maxWidth: 400
                            });
                        }
                    };

                    var minIValue = minIndicatorValues[0];
                    var maxIValue = maxIndicatorValues[0];
                    console.log("Min/max indicator value: " + minIValue + " -> " + maxIValue);

                    var indicatorColorFunction = new L.HSLHueFunction(new L.Point(minIValue, 50), new L.Point(maxIValue, -25), { outputSaturation: "100%", outputLuminosity: "25%" });
                    var indicatorFillColorFunction = new L.HSLHueFunction(new L.Point(minIValue, 50), new L.Point(maxIValue, -25), { outputSaturation: "100%", outputLuminosity: "50%" });

                    var columnName = columnsHeaders[iColumn];
                    dataLayerOptions.displayOptions[columnName] = {
                        displayName: columnName,
                        color: indicatorColorFunction,
                        fillColor: indicatorFillColorFunction,
                        radius: 5
                    };

                    var inputData = {
                        features: util['default'].createRows(data) };
                    var dataLayer = new L.DataLayer(inputData, dataLayerOptions);
                    console.log("Map input data: ");
                    console.dir(inputData);
                    map.addLayer(dataLayer);
                } else {
                    for (var l = 1; l < data.length; ++l) {
                        var row__ = data[l];
                        var lat_ = parseFloat(row__[latColumn]);
                        var long_ = parseFloat(0 + row__[longColumn]);
                        if (!lat_ || !long_) {
                            console.warn("No lat or long in row:");
                            console.dir(row__);
                            continue;
                        }
                        var label = labelColumns.length >= 0 ? row__[labelColumns[0]] : "";
                        console.log("LatLong: " + lat_ + ", " + long_);
                        var marker;
                        if (indicatorColumns.length > 0) {
                            var markeroptions = {
                                data: {},
                                chartOptions: {},
                                displayOptions: {},
                                weight: 1,
                                color: "#000000"
                            };
                            for (var t = 0; t < indicatorColumns.length; t++) {
                                var iColumn_ = indicatorColumns[t]; // spaltenindex
                                var iValue = row__[iColumn_];
                                var name = "datapoint" + t;
                                console.log("indicator [t]: " + iColumn_ + " name: " + name + " value: " + iValue);
                                markeroptions.data[name] = iValue;
                                markeroptions.chartOptions[name] = {
                                    color: "hsl(240,100%,55%)",
                                    fillColor: "hsl(240,80%,55%)",
                                    minValue: 0,
                                    maxValue: maxIndicatorValues[j],
                                    maxHeight: 20,
                                    title: label,
                                    displayText: function displayText(value) {
                                        return value.toFixed(2);
                                    }
                                };
                                markeroptions.displayOptions[name] = {
                                    color: new L.HSLHueFunction(new L.Point(0, minHue), new L.Point(100, maxHue), { outputSaturation: "100%", outputLuminosity: "25%" }),
                                    fillColor: new L.HSLHueFunction(new L.Point(0, minHue), new L.Point(100, maxHue), { outputSaturation: "100%", outputLuminosity: "50%" })
                                };
                            }
                            console.dir(markeroptions);
                            marker = new L.MapMarker(new L.LatLng(lat_, long_), markeroptions);
                        } else {
                            var moptions = {
                                title: label
                            };
                            marker = new L.Marker(new L.LatLng(lat_, long_), moptions);
                        }
                        marker.addTo(map);
                        console.log("Point: [" + lat_ + ", " + long_ + ", " + label + "]");
                    }
                }
                console.log("Bounds: [" + minLat + ", " + maxLat + "], [" + minLong + ", " + maxLong + "]");
                if (minLat !== null && minLong !== null && maxLat !== null && maxLong !== null) {
                    map.fitBounds([[minLat, minLong], [maxLat, maxLong]]);
                }
            });
        }

        function get_SVG() {
            return "";
        }

        function export_as_PNG() {
            var dfd = new $.Deferred();
            leafletImage(map, function (err, canvas) {
                var pngURL = canvas.toDataURL();
                var downloadURL = pngURL.replace(/^data:image\/png/, "data:application/octet-stream");
                dfd.resolve(downloadURL);
            });
            return dfd.promise();
        }

        return {
            export_as_PNG: export_as_PNG,
            get_SVG: get_SVG,
            draw: draw
        };
    })();

    exports['default'] = map;

});
define('linda-vis-fe/utils/pie-chart', ['exports', 'linda-vis-fe/utils/util', 'linda-vis-fe/utils/export-visualization'], function (exports, util, exportVis) {

    'use strict';

    var piechart = (function () {

        var seriesHeaders = [];
        var series = [];

        function draw(configuration, visualisationContainerID) {
            console.log("### INITIALIZE VISUALISATION - PIE CHART");

            var container = $("#" + visualisationContainerID);
            container.empty();

            var measure = configuration.Measure;
            var slice = configuration.Slices;

            if (!(configuration.dataModule && configuration.datasourceLocation && measure && slice)) {
                return $.Deferred().resolve().promise();
            }

            if (measure.length === 0 || slice.length === 0) {
                return $.Deferred().resolve().promise();
            }

            var dataModule = configuration.dataModule;
            var location = configuration.datasourceLocation;
            var graph = configuration.datasourceGraph;

            var selection = {
                dimension: measure,
                multidimension: slice

            };

            console.log("VISUALIZATION SELECTION FOR PIE CHART:");
            console.dir(selection);

            var svg = dimple.newSvg("#" + visualisationContainerID, container.width(), container.height());

            return dataModule.parse(location, graph, selection).then(function (inputData) {
                seriesHeaders = inputData[0];
                series = util['default'].createRows(inputData);
                console.log("GENERATE INPUT DATA FORMAT FOR PIE CHART");
                console.dir(series);

                var chart = new dimple.chart(svg, series);
                chart.addMeasureAxis("p", seriesHeaders[0]);
                chart.addSeries(seriesHeaders.slice(1), dimple.plot.pie);
                chart.addLegend("10%", "5%", "80%", 20, "right");

                //tooltip
                if (configuration.Tooltip === false) {
                    chart.addSeries(series, dimple.plot.pie).addEventHandler("mouseover", function () {});
                }

                chart.draw();
            });
        }

        function export_as_PNG() {
            return exportVis['default'].export_PNG();
        }

        function export_as_SVG() {
            return exportVis['default'].export_SVG();
        }

        function get_SVG() {
            return exportVis['default'].get_SVG();
        }

        return {
            export_as_PNG: export_as_PNG,
            export_as_SVG: export_as_SVG,
            get_SVG: get_SVG,
            draw: draw
        };
    })();

    exports['default'] = piechart;

});
define('linda-vis-fe/utils/scatter-chart', ['exports', 'linda-vis-fe/utils/util', 'linda-vis-fe/utils/export-visualization'], function (exports, util, exportVis) {

    'use strict';

    var scatterchart = (function () {
        var seriesHeaders = [];
        var data = [];

        function draw(configuration, visualisationContainerID) {
            console.log("### INITIALIZE VISUALISATION - COLUMN CHART");

            var container = $("#" + visualisationContainerID);
            container.empty();

            var xAxis = configuration["Horizontal Axis"];
            var yAxis = configuration["Vertical Axis"];
            var group = configuration.Groups;

            if (!(configuration.dataModule && configuration.datasourceLocation && xAxis && yAxis)) {
                return $.Deferred().resolve().promise();
            }

            if (xAxis.length === 0 || yAxis.length === 0) {
                return $.Deferred().resolve().promise();
            }

            var dataModule = configuration.dataModule;
            var location = configuration.datasourceLocation;
            var graph = configuration.datasourceGraph;
            var gridlines = configuration.Gridlines;
            var tooltip = configuration.Tooltip;
            var hLabel = configuration["Horizontal Label"];
            var vLabel = configuration["Vertical Label"];

            var selection = {
                dimension: [],
                multidimension: xAxis.concat(yAxis).concat(group),
                gridlines: gridlines,
                tooltip: tooltip,
                hLabel: hLabel,
                vLabel: vLabel
            };

            console.log("VISUALIZATION SELECTION FOR COLUMN CHART:");
            console.dir(selection);

            var svg = dimple.newSvg("#" + visualisationContainerID, container.width(), container.height());

            return dataModule.parse(location, graph, selection).then(function (inputData) {
                console.log("GENERATE INPUT DATA FORMAT FOR COLUMN CHART - INPUT DATA");
                console.dir(inputData);
                seriesHeaders = inputData[0];
                data = util['default'].createRows(inputData);
                for (var i = 0; i < data.length; i++) {
                    data[i].id = "id" + i;
                }

                console.log("GENERATE INPUT DATA FORMAT FOR COLUMN CHART - OUTPUT DATA");
                console.dir(data);

                var chart = new dimple.chart(svg, data);

                var xAxisName = seriesHeaders[0];
                var yAxisName = seriesHeaders[1];

                var groupAxisName;
                if (group.length > 0) {
                    groupAxisName = seriesHeaders[2];
                }

                var x = chart.addMeasureAxis("x", xAxisName);
                var y = chart.addMeasureAxis("y", yAxisName);

                var series = ["id"];

                if (groupAxisName) {
                    series.push(groupAxisName);
                }

                console.log("SERIES:");
                console.dir(series);

                chart.addSeries(series, dimple.plot.bubble);
                chart.addLegend("50%", "10%", 500, 20, "right");

                //ticks
                x.ticks = selection.gridlines;
                y.ticks = selection.gridlines;
                //titles
                if (selection.hLabel === "" || selection.hLabel === "Label") {
                    selection.hLabel = seriesHeaders[0];
                }
                if (selection.vLabel === "" || selection.vLabel === "Label") {
                    selection.vLabel = seriesHeaders[1];
                }
                x.title = selection.hLabel;
                y.title = selection.vLabel;
                //tooltip
                if (selection.tooltip === false) {
                    chart.addSeries(series, dimple.plot.bubble).addEventHandler("mouseover", function () {});
                }

                chart.draw();
            });
        }

        function export_as_PNG() {
            return exportVis['default'].export_PNG();
        }

        function export_as_SVG() {
            return exportVis['default'].export_SVG();
        }

        function get_SVG() {
            return exportVis['default'].get_SVG();
        }

        return {
            export_as_PNG: export_as_PNG,
            export_as_SVG: export_as_SVG,
            get_SVG: get_SVG,
            draw: draw
        };
    })();

    exports['default'] = scatterchart;

});
define('linda-vis-fe/utils/sparql-data-module', ['exports', 'ember', 'linda-vis-fe/utils/util'], function (exports, Ember, util) {

    'use strict';

    var sparql_data_module = (function () {

        function sparqlProxyQuery(endpoint, query) {
            var promise = Ember['default'].$.getJSON("/visualizations/visual/api/sparql-proxy/" + encodeURIComponent(endpoint) + "/" + encodeURIComponent(query.replace(/\n/g, ' ')));
            return promise.then(function (result) {
                console.log("SPARQL DATA MODULE - SPARQL QUERY RESULT");
                console.dir(result);
                return result;
            });
        }

        function simplifyURI(uri) {
            var splits = uri.split(/[#/:]/);
            return splits[splits.length - 1];
        }

        function queryClasses(endpoint, graph) {
            var query = "";

            query += "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>";
            query += "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>";

            query += "SELECT DISTINCT ?class ?classLabel ";
            query += "WHERE ";
            query += "{";
            query += " GRAPH <" + graph + ">";
            query += " {";
            query += "  SELECT ?class ?classLabel (COUNT(?x) as ?classSize)";
            query += "  WHERE";
            query += "  {";
            query += "   ?x rdf:type ?class .";
            query += "   ?x ?property ?y .";
            query += "   OPTIONAL";
            query += "   {";
            query += "    ?class rdfs:label ?classLabel .";
            query += "   }";
            query += "  } GROUP BY ?class ?classLabel ORDER BY DESC(?classSize)";
            query += " }";
            query += "} ";

            console.log("SPARQL DATA MODULE - CLASSES QUERY");
            console.dir(query);

            return sparqlProxyQuery(endpoint, query).then(function (result) {
                var classes = [];
                for (var i = 0; i < result.length; i++) {
                    var classURI = result[i]["class"].value;

                    var classLabel = (result[i].classLabel || {}).value;
                    if (!classLabel) {
                        classLabel = simplifyURI(classURI);
                    }

                    var dataInfo = {
                        id: classURI,
                        label: classLabel,
                        type: "Class",
                        grandchildren: true
                    };

                    classes.push(dataInfo);
                }
                return classes;
            });
        }

        function predictRDFPropertyRole(propertyURI, propertyTypes) {
            switch (propertyURI) {}
            for (var i = 0; i < propertyTypes.length; i++) {
                var propertyType = propertyTypes[i];
                switch (propertyType) {
                    case "http://purl.org/linked-data/cube#DimensionProperty":
                        return "Domain";
                    case "http://purl.org/linked-data/cube#MeasureProperty":
                        return "Range";
                }
            }
            // undefined
            return;
        }

        function queryProperties(endpoint, graph, _class, _properties) {
            var query = "";

            query += "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n";
            query += "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n";

            query += "SELECT DISTINCT ?property ";
            query += " (SAMPLE(?propertyLabel_) as ?propertyLabel) ";
            query += " (GROUP_CONCAT(STR(?propertyType) ; separator=\" \") as ?propertyTypes) ";
            query += " (SAMPLE(?propertyValue) as ?sampleValue) ";
            query += " (COUNT(?grandchildProperty) as ?numChildren)\n";
            query += "WHERE\n";
            query += "{\n";
            query += " GRAPH <" + graph + ">\n";
            query += " {\n";
            query += "  ?x0 rdf:type <" + _class.id + "> .\n";

            for (var i = 0; i < _properties.length; i++) {
                query += "  ?x" + i + " <" + _properties[i].id + "> ?x" + (i + 1) + " .\n";
            }

            query += "  ?x" + _properties.length + " ?property ?propertyValue .\n";
            query += "  OPTIONAL\n";
            query += "  {\n";
            query += "   ?property rdfs:label ?propertyLabel_ .\n";
            query += "  }\n";
            query += "  OPTIONAL\n";
            query += "  {\n";
            query += "   ?property rdf:type ?propertyType .\n"; // For predicting roles, e.g. DimensionProperty
            query += "  }\n";
            query += "  OPTIONAL\n";
            query += "  {\n";
            query += "   ?propertyValue ?grandchildProperty ?grandchildValue.\n";
            query += "  }\n";
            query += " }\n";
            query += "} GROUP BY ?property";

            console.log("SPARQL DATA MODULE - PROPERTIES QUERY: ");
            console.dir(query);

            return sparqlProxyQuery(endpoint, query).then(function (results) {
                var properties = [];

                for (var i = 0; i < results.length; i++) {
                    var result = results[i];
                    var propertyURI = result.property.value;
                    var propertyLabel = (result.propertyLabel || {}).value;
                    var propertyTypesString = (result.propertyTypes || {}).value;
                    var propertyTypes;
                    if (propertyTypesString) {
                        propertyTypes = propertyTypesString.split(" ");
                    } else {
                        propertyTypes = [];
                    }
                    var grandchildren = (result.numChildren || {}).value;
                    var sampleValueType = (result.sampleValue || {}).type;
                    var sampleValue = (result.sampleValue || {}).value;

                    if (!propertyLabel) {
                        propertyLabel = simplifyURI(propertyURI);
                    }

                    var scaleOfMeasurement;
                    switch (sampleValueType) {
                        case "literal":
                        case "typed-literal":
                            var datatype = result.sampleValue.datatype;
                            if (datatype) {
                                scaleOfMeasurement = predictRDFDatatypeSOM(datatype);
                            } else {
                                var parsedSampleValue = util['default'].toScalar(sampleValue);
                                scaleOfMeasurement = util['default'].predictValueSOM(parsedSampleValue);
                            }
                            break;
                        case "uri":
                        case "bnode":
                            scaleOfMeasurement = "Resource";
                            break;
                        default:
                            scaleOfMeasurement = "Nothing";
                            break;
                    }

                    var dataInfo = {
                        id: propertyURI,
                        label: propertyLabel,
                        grandchildren: parseInt(grandchildren) > 0 ? true : false,
                        role: predictRDFPropertyRole(propertyURI, propertyTypes),
                        special: _.contains(propertyTypes, "http://linda-project.eu/linda-visualization#SpecialProperty"),
                        type: scaleOfMeasurement
                    };

                    properties.push(dataInfo);
                }

                return properties;
            });
        }

        function predictRDFDatatypeSOM(datatype) {
            switch (datatype) {
                case "http://www.w3.org/2001/XMLSchema#float":
                case "http://www.w3.org/2001/XMLSchema#double":
                case "http://www.w3.org/2001/XMLSchema#decimal":
                case "http://www.w3.org/2001/XMLSchema#integer":
                case "http://www.w3.org/2001/XMLSchema#nonPositiveInteger":
                case "http://www.w3.org/2001/XMLSchema#negativeInteger":
                case "http://www.w3.org/2001/XMLSchema#long":
                case "http://www.w3.org/2001/XMLSchema#int":
                case "http://www.w3.org/2001/XMLSchema#short":
                case "http://www.w3.org/2001/XMLSchema#byte":
                case "http://www.w3.org/2001/XMLSchema#nonNegativeInteger":
                case "http://www.w3.org/2001/XMLSchema#unsignedLong":
                case "http://www.w3.org/2001/XMLSchema#unsignedInt":
                case "http://www.w3.org/2001/XMLSchema#unsignedShort":
                case "http://www.w3.org/2001/XMLSchema#unsignedByte":
                case "http://www.w3.org/2001/XMLSchema#positiveInteger":
                    return "Ratio";
                case "http://www.w3.org/2001/XMLSchema#dateTime":
                case "http://www.w3.org/2001/XMLSchema#date":
                case "http://www.w3.org/2001/XMLSchema#gYear":
                case "http://www.w3.org/2001/XMLSchema#gYearMonth":
                    return "Interval";
                //case "http://www.w3.org/2001/XMLSchema#string":
                default:
                    return "Nominal";
            }
        }

        function parse(endpoint, graph, selection) {
            var dimension = selection.dimension;
            var multidimension = selection.multidimension;

            return queryInstances(endpoint, graph, dimension.concat(multidimension));
        }

        function queryInstances(endpoint, graph, properties) {
            var columnHeaders = [];
            var optionals = "";
            var selectVariables = "";
            var selectedVariablesArray = [];
            var class_ = properties[0].parent[0].id;
            var path = [];

            var nameExists = {};

            for (var i = 0; i < properties.length; i++) {
                var property = properties[i];
                path = property.parent;

                selectVariables += " ?z" + i;
                var header;
                if (!nameExists[property.label]) {
                    header = property.label;
                } else {
                    header = property.label + " " + i;
                }
                nameExists[header] = true;
                columnHeaders.push(header);
                selectedVariablesArray.push("z" + i);

                optionals += " OPTIONAL ";
                optionals += " { ";
                for (var j = 1; j < path.length; j++) {
                    var x = simplifyURI(path[j - 1].id) + (j - 1);
                    if (j < path.length - 1) {
                        var variable_t = simplifyURI(path[j].id) + j;
                        optionals += "\n" + "?" + x + " <" + path[j].id + "> ?" + variable_t + ".\n";
                    } else {
                        optionals += "\n" + "?" + x + " <" + path[j].id + "> ?z" + i + ".\n";
                    }
                }
                optionals += " } ";
            }

            var y = simplifyURI(path[0].id) + "0";

            var query = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" + "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" + "SELECT DISTINCT " + selectVariables + "\n" + "WHERE {\n" + "GRAPH <" + graph + "> {\n" + "?" + y + " rdf:type <" + class_ + ">.\n" + optionals + "\n" + "}\n" + "}";

            console.log("SPARQL DATA MODULE - DATA QUERY FOR VISUALIZATION CONFIGURATION");
            console.dir(query);

            return sparqlProxyQuery(endpoint, query).then(function (queryResult) {
                return convert(queryResult, columnHeaders, selectedVariablesArray);
            });
        }

        function convert(queryResults, columnHeaders, selectedVariablesArray) {
            var result = [];
            result.push(columnHeaders);
            for (var i = 0; i < queryResults.length; i++) {
                var queryResult = queryResults[i];
                var record = [];
                for (var j = 0; j < selectedVariablesArray.length; j++) {
                    var p = selectedVariablesArray[j];
                    var binding = queryResult[p];
                    var val = resultToScalar(binding);
                    if (_.isUndefined(val)) {
                        record.push(null);
                    } else {
                        record.push(val);
                    }
                }
                result.push(record);
            }

            console.log("SPARQL DATA MODULE - CONVERSION RESULT");
            console.dir(result);
            return result;
        }

        /*
         * Takes a vexport default sparql_data_module;ariable binding from a json sparql result and converts it to a scalar
         */
        function resultToScalar(binding) {
            if (!binding) {
                return null;
            }
            var value = binding.value;
            var type = binding.type;
            switch (type) {
                case "literal":
                case "typed-literal":
                    var datatype = binding.datatype;
                    if (datatype) {
                        return typedLiteralToScalar(value, datatype);
						
						if (typeof parsedValue !== "undefined") {
                            return parsedValue;
                        }
                    }
					
					// if no datatype is given, try same parsing algorithm as for CSV
                    return util['default'].toScalar(value);
                case "uri":
                case "bnode":
                    return simplifyURI(value);
                default:
                    return value;
            }
        }

        function typedLiteralToScalar(value, datatype) {
            switch (datatype) {
                case "http://www.w3.org/2001/XMLSchema#float":
                case "http://www.w3.org/2001/XMLSchema#double":
                case "http://www.w3.org/2001/XMLSchema#decimal":
                    return parseFloat(value);
                case "http://www.w3.org/2001/XMLSchema#integer":
                case "http://www.w3.org/2001/XMLSchema#nonPositiveInteger":
                case "http://www.w3.org/2001/XMLSchema#negativeInteger":
                case "http://www.w3.org/2001/XMLSchema#long":
                case "http://www.w3.org/2001/XMLSchema#int":
                case "http://www.w3.org/2001/XMLSchema#short":
                case "http://www.w3.org/2001/XMLSchema#byte":
                case "http://www.w3.org/2001/XMLSchema#nonNegativeInteger":
                case "http://www.w3.org/2001/XMLSchema#unsignedLong":
                case "http://www.w3.org/2001/XMLSchema#unsignedInt":
                case "http://www.w3.org/2001/XMLSchema#unsignedShort":
                case "http://www.w3.org/2001/XMLSchema#unsignedByte":
                case "http://www.w3.org/2001/XMLSchema#positiveInteger":
                    return parseInt(value);


                case "http://www.w3.org/2001/XMLSchema#gYear":
                    var numberRegex = /\d+/;
                    var firstNumber = numberRegex.exec(value);
                    var yearDateString;
                    if (firstNumber && firstNumber.length >= 4) {
                        yearDateString = firstNumber + "-01-01";
                    } else {
                        // No idea what this is, maybe JavaScript knows...
                        yearDateString = value;
                    }
                    return new Date(yearDateString).getFullYear();
                case "http://www.w3.org/2001/XMLSchema#gYearMonth":


                    var twoNumbersWithHyphenRegex = /\d+-\d+/;
                    var firstTwoNumbers = twoNumbersWithHyphenRegex.exec(value);
                    var yearMonthDateString;
                    if (firstTwoNumbers && firstTwoNumbers.length >= 4) {
                        yearMonthDateString = firstTwoNumbers + "-01";
                    } else {
                        yearMonthDateString = value;
                    }
                    //prevent long strings
                    yearMonthDateString = Date(yearMonthDateString);
                    return yearMonthDateString.getFullYear() + "-" + (yearMonthDateString.getMonth() + 1);
                case "http://www.w3.org/2001/XMLSchema#dateTime":
                case "http://www.w3.org/2001/XMLSchema#date":
                    return new Date(value);
                case "http://www.w3.org/2001/XMLSchema#string":
                    // Can plain literals be returned as xsd:string in newer
                    // versions of RDF/SPARQL? If so, uses toScalar here to handle
                    // datasets with missing types
                    return value;
                default:

                    return;
            }
        }

        return {
            queryClasses: queryClasses,
            queryProperties: queryProperties,
            queryInstances: queryInstances,
            parse: parse
        };
    })();

    exports['default'] = sparql_data_module;

    // TODO: Are there properties that always have the role of a domain or a range?

});
define('linda-vis-fe/utils/table-data-module', ['exports', 'linda-vis-fe/utils/csv-data-module', 'linda-vis-fe/utils/sparql-data-module'], function (exports, csv_data_module, sparql_data_module) {

    'use strict';

    var table_data_module = (function () {
        var list = [];
        function getContent(selection, datasource) {
            var _location = datasource.location;
            var _graph = datasource.graph;
            var _format = datasource.format;
            var data_module = getDataModule(_format);

            console.log("TABLE DATA MODULE - SELECTION:");
            console.dir(selection);

            return data_module.queryInstances(_location, _graph, selection);
        }

        function getColumns(list) {
            var columns = [];
            for (var i = 0; i < list.length; i++) {
                columns.push({
                    title: list[i].label
                });
            }
            return columns;
        }
        function getDataModule(format) {
            switch (format) {
                case "csv":
                    return csv_data_module['default'];
                case "rdf":
                    return sparql_data_module['default'];
            }
            console.error("Unknown data format '" + format + "'");
            return null;
        }

        return {
            list: list,
            getContent: getContent,
            getColumns: getColumns
        };
    })();

    exports['default'] = table_data_module;

});
define('linda-vis-fe/utils/template-mapping', ['exports'], function (exports) {

    'use strict';

    var templateMapping = (function () {

        function templateMapping(editObject) {
            //the input object might be the result of the recommendation algorithm
            //or the JSON with changed template data, i.e. {layoutOptions:{height:500}}
            console.log("CREATING TEMPLATE MAPPING ...");

            var resultMapping = {
                layoutOptions: {},
                structureOptions: {}
            };

            if (editObject) {
                //retrieving the fields
                var layoutOptions = editObject.get("layoutOptions");
                var structureOptions = editObject.get("structureOptions");

                //invoking an appropriate template for a dimension parameter
                resultMapping["layoutOptions"] = mapping(layoutOptions);

                //invoking an appropriate template for a tuning parameter
                resultMapping["structureOptions"] = mapping(structureOptions);
            }

            return resultMapping;
        }

        function mapping(options) {
            var result = {};

            //Assuming there is a baseofmappings {option: template}
            var mapDB = {
                "dimension": "dimension-area",
                "color": "tuning-bgc",
                "string": "textField",
                "boolean": "tuning-check",
                "number": "tuning-numinput",
                "nonNegativeInteger": "tuning-numinput",
                "integer": "tuning-numinput"
            };

            if (options !== null) {
                for (var prop in options) {
                    if (options.hasOwnProperty(prop)) {
                        var option = options[prop];
                        result[prop] = {
                            template: mapDB[option.type],
                            value: option.value,
                            label: option.optionName,
                            metadata: option.metadata,
                            minCardinality: option.minCardinality,
                            maxCardinality: option.maxCardinality
                        };
                    }
                }
            }

            return result;
        }

        return {
            templateMapping: templateMapping
        };
    })();

    exports['default'] = templateMapping;

});
define('linda-vis-fe/utils/tree-selection-data-module', ['exports', 'linda-vis-fe/utils/csv-data-module', 'linda-vis-fe/utils/sparql-data-module'], function (exports, csv_data_module, sparql_data_module) {

    'use strict';

    var treeselection_data_module = (function () {
        var _location = "";
        var _graph = "";
        var _format = "";
        var _data_module = "";

        function initialize(dataInfo) {
            console.log("SELECTION TREE COMPONENT - INITIALIZING TREE");

            _location = dataInfo.location;
            _graph = dataInfo.graph;
            _format = dataInfo.format;
            _data_module = getDataModule(_format);

            return _data_module.queryClasses(_location, _graph).then(function (data) {
                return createTreeContent(data);
            });
        }

        function restore(dataInfo, previousSelection) {
            console.log("SELECTION TREE COMPONENT - RESTORING TREE");

            _location = dataInfo.location;
            _graph = dataInfo.graph;
            _format = dataInfo.format;
            _data_module = getDataModule(_format);

            var _selectedClassKey = previousSelection[0].parent[0].id;
            var _selectedClassTitle = previousSelection[0].parent[0].label;

            return _data_module.queryClasses(_location, _graph).then(function (classes) {
                var treecontent = createTreeContent(classes);
                var branch = _.filter(treecontent, function (item) {
                    if (_.isEqual(item.key, _selectedClassKey)) {
                        return true;
                    }
                });

                branch[0]["expanded"] = true;
                branch[0]["selected"] = true;
                branch[0]["lazy"] = false;
                branch[0]["children"] = [];
                branch[0]["parent"] = [{ id: _selectedClassKey, label: _selectedClassTitle }];

                return restoreTreeContent(previousSelection, branch[0]).then(function () {
                    return treecontent;
                });
            });
        }

        function restoreTreeContent(previousSelection, branch) {
            console.log("SELECTION TREE COMPONENT - RESTORING TREE CONTENT");

            return branch._children.loadChildren(branch.parent).then(function (children) {
                var promises = [];

                for (var j = 0; j < children.length; j++) {
                    var child = children[j];
                    child["parent"] = branch.parent.concat([{ id: child.key, label: child.title }]);

                    for (var i = 0; i < previousSelection.length; i++) {
                        var selection = previousSelection[i];
                        var prefix = selection.parent.slice(0, child.parent.length);

                        if (_.isEqual(child.parent, prefix) && selection.parent.length > child.parent.length) {
                            child["expanded"] = true;
                            child["selected"] = true;
                            child["lazy"] = false;
                            child["children"] = [];
                            promises.push(restoreTreeContent(previousSelection, child));
                            break;
                        } else if (_.isEqual(child.parent, prefix)) {
                            child["selected"] = true;

                            child["lazy"] = true;
                            if (!child.grandchildren) {

                                child["lazy"] = false;
                            }
                        }
                    }
                    branch.children.push(child);
                }
                return $.when.apply($, promises).then(function (content) {
                    console.log("SELECTION TREE COMPONENT - FINISHED RESTORING TREE CONTENT");
                    return content;
                });
            });
        }

        function createTreeContent(data) {
            console.log("SELECTION TREE COMPONENT - CREATING TREE CONTENT");
            var treeContent = [];

            for (var i = 0; i < data.length; i++) {
                var record = data[i];
                var id = record.id;
                var label = record.label;
                var type = record.type;
                var role = record.role;
                var special = record.special;
                var grandchildren = record.grandchildren;

                treeContent.push({
                    title: label,
                    key: id,
                    lazy: grandchildren,
                    extraClasses: getCSSClass(type),
                    type: type,
                    datatype: getDataType(type),
                    role: role,
                    special: special,
                    hideCheckbox: hideCheckbox(type),
                    _children: {
                        loadChildren: function loadChildren(node_path) {
                            var _class = "";
                            var _properties = "";

                            if (node_path.length > 1) {
                                _class = _.first(node_path);
                                _properties = _.rest(node_path);
                            } else {
                                _class = _.last(node_path);
                                _properties = [];
                            }

                            return _data_module.queryProperties(_location, _graph, _class, _properties).then(function (data) {
                                return createTreeContent(data);
                            });
                        }
                    }
                });
            }

            return treeContent;
        }

        function getDataSelection(selection, datasource) {
            var dataSelection = { datasource: datasource, propertyInfos: [] };

            for (var i = 0; i < selection.length; i++) {
                var record = selection[i];
                dataSelection["propertyInfos"].push({
                    key: record.key,
                    label: record.label,
                    parent: record.parent,
                    role: record.role,
                    special: record.special,
                    type: record.type,
                    datatype: record.datatype
                });
            }

            return dataSelection;
        }

        function getCSSClass(record) {
            switch (record) {
                case "Ratio":
                    return "treenode-number-label";
                case "Interval":
                    return "treenode-date-label";

                case "Nominal":
                    return "treenode-text-label";
                case "Geographic Latitude":
                case "Geographic Longitude":
                    return "treenode-spatial-label";
                case "Class":
                    return "treenode-class-label";
                case "Resource":
                case "Nothing":
                    return "treenode-resource-label";
            }
            console.error("Unknown type of record  '" + record + "'");
            return null;
        }

        function getDataType(record) {
            switch (record) {
                case "Ratio":
                    return "Number";
                case "Interval":
                    return "Date";

                case "Ordinal":
                    return "Ordinal";
                case "Nominal":
                    return "String";
                case "Angular":
                    return "Angle";
                case "Geographic Latitude":
                case "Geographic Longitude":
                    return "Spatial";
                case "Class":
                case "Resource":
                case "Nothing":
                    return null;
            }
            console.error("Unknown data type of record  '" + record + "'");
            return null;
        }

        function hideCheckbox(record) {
            switch (record) {
                case "Ratio":
                case "Interval":

                case "Nominal":
                case "Angular":
                case "Geographic Latitude":
                case "Geographic Longitude":
                case "Class":
                    return false;
                case "Resource":
                case "Nothing":
                    return true;
            }
            console.error("Unknown category '" + record + "'");
            return null;
        }

        function getDataModule(format) {
            switch (format) {
                case "csv":
                    return csv_data_module['default'];
                case "rdf":
                    return sparql_data_module['default'];
            }
            console.error("Unknown data format '" + format + "'");
            return null;
        }

        return {
            initialize: initialize,
            restore: restore,
            getDataSelection: getDataSelection
        };
    })();

    exports['default'] = treeselection_data_module;

});
define('linda-vis-fe/utils/util', ['exports'], function (exports) {

    'use strict';

    var util = (function () {

        function transpose(table) {
            var columnHeaders = table[0];
            var columns = [];
            for (var i = 0; i < columnHeaders.length; i++) {
                var column = [];
                for (var j = 0; j < table.length; j++) {
                    column.push(table[j][i]);
                }
                columns.push(column);
            }
            return columns;
        }

        function createRows(table) {
            var rows = [];
            var columnHeaders = table[0];

            for (var i = 1; i < table.length; i++) {
                var columns = {};
                var row = table[i];
                for (var j = 0; j < row.length; j++) {
                    var name = columnHeaders[j];
                    columns[name] = row[j];
                }
                rows.push(columns);
            }
            return rows;
        }

        var floatPattern = /^-?[0-9]+\.[0-9]+$/;
        var intPattern = /^-?[0-9]+$/;

        function toScalar(value) {
            if (floatPattern.test(value)) {
                var float = parseFloat(value);
                if (isNaN(float)) {
                    return value;
                } else {
                    return float;
                }
            } else if (intPattern.test(value)) {
                var integer = parseInt(value);
                if (isNaN(integer)) {
                    return value;
                } else {
                    return integer;
                }
            } else {
                var date = Date.parse(value);
                if (isNaN(date)) {
                    return value;
                } else {
                    return new Date(date).toISOString();
                }
            }
        }

        function predictValueSOM(value) {
            var jsType = typeof value;
            switch (jsType) {
                case "number":
                    return "Ratio";
                case "object":
                    var asString = Object.prototype.toString.call(value);
                    switch (asString) {
                        case "[object Date]":
                        case "[invalid Date]":
                            return "Interval";
                    }
                    break;
            }

            return "Nominal";
        }

        var cleanAxis = function cleanAxis(axis, interval) {
            if (axis.shapes.length > 0) {
                //first tick
                var del = 0;
                if (interval > 1) {
                    axis.shapes.selectAll("text").each(function (d) {
                        //remove all but nth label
                        if (del % interval !== 0) {
                            this.remove();
                            //delete a corresponding tick
                            axis.shapes.selectAll("line").each(function (d2) {
                                if (d === d2) {
                                    this.remove();
                                }
                            });
                        }
                        del += 1;
                    });
                }
            }
        };
		
        return {
            predictValueSOM: predictValueSOM,
            toScalar: toScalar,
            transpose: transpose,
            createRows: createRows,
			cleanAxis: cleanAxis
        };
    })();

    exports['default'] = util;

});
define('linda-vis-fe/utils/visualization-registry', ['exports', 'linda-vis-fe/utils/column-chart', 'linda-vis-fe/utils/line-chart', 'linda-vis-fe/utils/area-chart', 'linda-vis-fe/utils/pie-chart', 'linda-vis-fe/utils/bubble-chart', 'linda-vis-fe/utils/scatter-chart', 'linda-vis-fe/utils/map'], function (exports, columnchart, linechart, areachart, piechart, bubblechart, scatterchart, map) {

    'use strict';

    var visualizationRegistry = {
        getVisualization: function getVisualization(widgetName) {
            switch (widgetName) {
                case "BarChart":
                    return columnchart['default'];
                case "LineChart":
                    return linechart['default'];
                case "AreaChart":
                    return areachart['default'];
                case "PieChart":
                    return piechart['default'];
                case "BubbleChart":
                    return bubblechart['default'];
                case "ScatterChart":
                    return scatterchart['default'];
                case "Map":
                    return map['default'];
            }
            return null;
        }
    };

    exports['default'] = visualizationRegistry;

});
define('linda-vis-fe/views/draw-visualization', ['exports', 'ember', 'linda-vis-fe/utils/sparql-data-module', 'linda-vis-fe/utils/csv-data-module', 'linda-vis-fe/utils/visualization-registry'], function (exports, Ember, sparql_data_module, csv_data_module, vis_registry) {

    'use strict';

    exports['default'] = Ember['default'].View.extend({
        willAnimateIn: function willAnimateIn() {
            $.css("opacity", 0);
        },
        animateIn: function animateIn(done) {
            $.fadeTo(500, 1, done);
        },
        animateOut: function animateOut(done) {
            $.fadeTo(500, 0, done);
        },
        parentViewDidChange: function parentViewDidChange() {
            $.hide();
            $.fadeIn(500);
        },
        eventManager: Ember['default'].Object.create({
            input: function input() {
                this.triggerAction({
                    action: "willAnimateIn",
                    target: this
                });
            }
        }),
        drawVisualization: (function () {
            var visualization = this.get("visualization");
            console.log("DRAW VISUALIZATION VIEW - DRAW ...");
            console.dir(visualization);

            if (!visualization) {
                return;
            }

            var config = this.get("configurationArray")[0];

            console.log("VISUALIZATION CONFIGURATION");
            console.dir(JSON.stringify(config));

            if (!config) {
                return;
            }

            var dataselection = visualization.get("dataselection");
            var datasource = dataselection.get("datasource");
            var format = datasource.format;
            config.datasourceLocation = datasource.location;
            config.datasourceGraph = datasource.graph;

            switch (format) {
                case "rdf":
                    config.dataModule = sparql_data_module['default'];
                    break;
                case "csv":
                    config.dataModule = csv_data_module['default'];
                    break;
                default:
                    console.error("Unknown DS format: " + format);
                    return;
            }

            var name = visualization.get("visualizationName");
            var visualization_ = vis_registry['default'].getVisualization(name);
            var self = this;

            var element = this.get("element");
            if (!element) {
                return;
            }

            try {
                visualization_.draw(config, element.id).then(function () {
                    var svg = visualization_.get_SVG();
                    self.set("visualizationSVG", svg);
                });
            } catch (ex) {
                console.error("Error drawing visualization: ");
                console.log(ex);
            }
        }).observes("configurationArray.@each").on("didInsertElement"),
        redraw: (function () {}).observes("visualization"),
        resize: (function () {
            //get the controller
            var self = this;

            //run asynchronous code to ensure that DOM has been changed before rerendering
            //time window = 500 ms
            Ember['default'].run.later(function () {
                self.rerender();
            }, 500);
        }).observes("isToggled")
    });

    //this.rerender();

});
define('linda-vis-fe/views/properties-list', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].View.extend({
        templateName: "properties-list",
        tagName: "ul",
        classNames: ["properties-list"]
    });

});
define('linda-vis-fe/views/slide-show', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].View.extend({
        slides: null,
        templateName: "slideShow",
        classNames: ["slider"],
        didInsertElement: function didInsertElement() {
            this._super();

            console.log("Inserted slideshow: ");
            console.dir(this.get("slides"));

            this.$().slick({
                infinite: true,
                slidesToShow: 3,
                slidesToScroll: 1
            });
        },
        refreshView: (function () {
            this.rerender();
        }).observes("slides.[]")
    });

});
define('linda-vis-fe/views/visualization-options', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].ContainerView.extend({
        options: null, // structure or layout options
        config: null, // visualization configuration
        tagName: "ul",
        children: (function () {
            this.clear();

            var options = this.get("options");
            var configArray = this.get("config");

            if (configArray === null || options === null) {
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

                    var view = Ember['default'].View.extend({
                        tagName: "li",
                        templateName: optionTemplate.template,
                        name: optionName,
                        label: optionTemplate.label,
                        content: optionTemplate.value,
                        metadata: optionTemplate.metadata ? optionTemplate.metadata.types : "",
                        maxCardinality: optionTemplate.maxCardinality,
                        contentObserver: (function () {
                            var content = this.get("content");
                            var name = this.get("name");
                            var configMap = configArray[0];
                            configMap[name] = content;
                            configArray.setObjects([configMap]);
                            optionTemplate.value = content;
                        }).observes("content.@each").on("init")
                    }).create();

                    this.pushObject(view);
                }
            } finally {
                console.log("VISUALIZATION OPTIONS VIEW - CREATED CONFIGURATION ARRAY");
                console.dir(configArray);

                // Inside finally block to make sure that this is executed even if the for loop crashes
                configArray.endPropertyChanges();
            }
        }).observes("options").on("init")
    });

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('linda-vis-fe/config/environment', ['ember'], function(Ember) {
  var prefix = 'linda-vis-fe';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("linda-vis-fe/tests/test-helper");
} else {
  require("linda-vis-fe/app")["default"].create({"name":"linda-vis-fe","version":"0.0.0.137afeac"});
}

/* jshint ignore:end */
//# sourceMappingURL=linda-vis-fe.map