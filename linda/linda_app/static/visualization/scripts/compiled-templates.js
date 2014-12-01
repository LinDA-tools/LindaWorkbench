Ember.TEMPLATES["application"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  
  data.buffer.push("Linked Data Visualization");
  }

  data.buffer.push("<div class=\"container\">\n    <div id=\"header\">\n        <nav class=\"top-bar\" data-topbar role=\"navigation\">\n            <ul class=\"title-area\">\n               <li class=\"name\">\n                    <h1>");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "index", options) : helperMissing.call(depth0, "link-to", "index", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("</h1>\n                </li>\n            </ul>           \n        </nav>\n    </div>\n\n    <div class=\"row left-collapse\">\n        ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n    </div>\n</div>");
  return buffer;
  
});

Ember.TEMPLATES["components/droppable-area"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashContexts, hashTypes, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("<div ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("overArea:droparea-active:droparea")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(">\n    ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "yield", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n</div>");
  return buffer;
  
});

Ember.TEMPLATES["components/property-item"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


  data.buffer.push("<div class=\"large-10 medium-10 columns area-item-label truncate\">\n    ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "item.label", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n</div>\n<div class=\"large-2 medium-2 columns area-item-remove\"> \n    <a ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "remove", "item", {hash:{},contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("> x </a>\n</div>   \n");
  return buffer;
  
});

Ember.TEMPLATES["components/tree-branch"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var stack1, hashTypes, hashContexts, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\n    ");
  hashContexts = {'node': depth0};
  hashTypes = {'node': "ID"};
  options = {hash:{
    'node': ("child")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['tree-node'] || depth0['tree-node']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "tree-node", options))));
  data.buffer.push("\n");
  return buffer;
  }

  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "child", "in", "children", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  else { data.buffer.push(''); }
  
});

Ember.TEMPLATES["components/tree-node"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  data.buffer.push("\n            &#x25BC;\n        ");
  }

function program3(depth0,data) {
  
  
  data.buffer.push("\n            &#x25B6;\n        ");
  }

function program5(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\n    ");
  hashContexts = {'node': depth0};
  hashTypes = {'node': "ID"};
  options = {hash:{
    'node': ("node")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['tree-branch'] || depth0['tree-branch']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "tree-branch", options))));
  data.buffer.push("\n");
  return buffer;
  }

  data.buffer.push("<div>\n    <span ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': (":toggle-icon node.isLeaf:leaf:")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggle", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n        ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers['if'].call(depth0, "isExpanded", {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n    </span>\n    \n<!--How drag and drop works: a node of a tree-node has a property 'draggable'.\nIf this property is set 'true' (see tree_data_module) then the node.label, \nor more specific the span becomes draggable: -->\n    <span ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggle", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" ");
  hashContexts = {'draggable': depth0};
  hashTypes = {'draggable': "ID"};
  options = {hash:{
    'draggable': ("node.draggable")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(">\n        ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "node.label", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n    </span>\n</div>\n\n");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers['if'].call(depth0, "isExpanded", {hash:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  return buffer;
  
});

Ember.TEMPLATES["configureVisualization"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashContexts, hashTypes, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("<div class=\"row left-collapse\">\n    <div class=\"large-7 medium-6 columns tree-content\">\n        ");
  hashContexts = {'node': depth0};
  hashTypes = {'node': "ID"};
  options = {hash:{
    'node': ("view.createTreeContent")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['tree-branch'] || depth0['tree-branch']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "tree-branch", options))));
  data.buffer.push("                                 \n    </div>    \n    <div class=\"large-5 medium-6 columns dimensions\">\n        <div>\n            ");
  hashContexts = {'options': depth0,'config': depth0};
  hashTypes = {'options': "ID",'config': "ID"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.VisualizationOptionsView", {hash:{
    'options': ("view.strOptionsConfVis"),
    'config': ("view.confVis")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n        </div>                   \n    </div>        \n</div>     \n");
  return buffer;
  
});

Ember.TEMPLATES["export"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


  data.buffer.push("<div class=\"consumption\">\n    <h7> EXPORT CHART AS </h7>\n    <ul class=\"inline-list\">\n        <li><a ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "exportSVG", "svg", {hash:{},contexts:[depth0,depth0],types:["STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">SVG</a></li>\n        <li><a ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "exportPNG", "png", {hash:{},contexts:[depth0,depth0],types:["STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">PNG</a></li>      \n    </ul>\n</div>  \n");
  return buffer;
  
});

Ember.TEMPLATES["index"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("          \n          Linear Regression Analysis result\n      ");
  }

function program3(depth0,data) {
  
  
  data.buffer.push("\n          Ubitech Testset 2 (CSV)\n      ");
  }

function program5(depth0,data) {
  
  
  data.buffer.push("\n          Ubitech Testset 3 (CSV)\n      ");
  }

function program7(depth0,data) {
  
  
  data.buffer.push("\n          Healthcare example\n      ");
  }

function program9(depth0,data) {
  
  
  data.buffer.push("\n          Water Quality Example\n      ");
  }

function program11(depth0,data) {
  
  
  data.buffer.push("\n          Newspaper Articles Example (RDF)\n      ");
  }

function program13(depth0,data) {
  
  
  data.buffer.push("\n          Newspaper Articles Example (CSV)\n      ");
  }

function program15(depth0,data) {
  
  
  data.buffer.push("\n          Drug Price Analysis Example\n      ");
  }

  data.buffer.push("<h6>Examples</h6>\n<ul>\n  <li>\n      ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0,depth0,depth0],types:["STRING","STRING","STRING","STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "visualization", "TS1_LinearRegression_Result_And_Original", "http%3A%2F%2F107.170.70.175%3A8890%2Fsparql", "http%3A%2F%2Fwww.linda-project.org%2FTS1_LinearRegression_Result_Original", "rdf", options) : helperMissing.call(depth0, "link-to", "visualization", "TS1_LinearRegression_Result_And_Original", "http%3A%2F%2F107.170.70.175%3A8890%2Fsparql", "http%3A%2F%2Fwww.linda-project.org%2FTS1_LinearRegression_Result_Original", "rdf", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("  \n  </li>\n  <li>\n      ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0,depth0,depth0,depth0,depth0],types:["STRING","STRING","STRING","STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "visualization", "Sales%20Statistics", "http%3A%2F%2F107.170.70.175%3A3002%2Ftestsets%2FTS2_Sales_Statistics.csv", "-", "csv", options) : helperMissing.call(depth0, "link-to", "visualization", "Sales%20Statistics", "http%3A%2F%2F107.170.70.175%3A3002%2Ftestsets%2FTS2_Sales_Statistics.csv", "-", "csv", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n  </li>\n  <li>\n      ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0,depth0,depth0,depth0,depth0],types:["STRING","STRING","STRING","STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "visualization", "Ubitech%20Testset%202", "http%3A%2F%2F107.170.70.175%3A3002%2Ftestsets%2FionosphereToTrain_J48_resultdocument.csv", "-", "csv", options) : helperMissing.call(depth0, "link-to", "visualization", "Ubitech%20Testset%202", "http%3A%2F%2F107.170.70.175%3A3002%2Ftestsets%2FionosphereToTrain_J48_resultdocument.csv", "-", "csv", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n  </li>\n  <li>\n      ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0,depth0,depth0,depth0,depth0],types:["STRING","STRING","STRING","STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "visualization", "Ubitech%20Testset%203", "http%3A%2F%2F107.170.70.175%3A3002%2Ftestsets%2FairlineToForecast_5xQ3Xie_Arima_resultdocument.csv", "-", "csv", options) : helperMissing.call(depth0, "link-to", "visualization", "Ubitech%20Testset%203", "http%3A%2F%2F107.170.70.175%3A3002%2Ftestsets%2FairlineToForecast_5xQ3Xie_Arima_resultdocument.csv", "-", "csv", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n  </li>\n  <li>\n      ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0,depth0,depth0,depth0,depth0],types:["STRING","STRING","STRING","STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "visualization", "Healthcare%20Analysis", "http%3A%2F%2F107.170.70.175%3A8890%2Fsparql", "http%3A%2F%2Fwww.hospitals_reviewer.com%2F2014", "rdf", options) : helperMissing.call(depth0, "link-to", "visualization", "Healthcare%20Analysis", "http%3A%2F%2F107.170.70.175%3A8890%2Fsparql", "http%3A%2F%2Fwww.hospitals_reviewer.com%2F2014", "rdf", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n  </li>\n  <li>\n      ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0,depth0,depth0,depth0,depth0],types:["STRING","STRING","STRING","STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "visualization", "Water%20Quality%20Analysis", "http%3A%2F%2F107.170.70.175%3A8890%2Fsparql", "http%3A%2F%2Fwater_quality_check.it%2Finfo", "rdf", options) : helperMissing.call(depth0, "link-to", "visualization", "Water%20Quality%20Analysis", "http%3A%2F%2F107.170.70.175%3A8890%2Fsparql", "http%3A%2F%2Fwater_quality_check.it%2Finfo", "rdf", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n  </li>\n  <li>\n      ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0,depth0,depth0,depth0,depth0],types:["STRING","STRING","STRING","STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "visualization", "Newspaper%20Articles%20Analysis", "http%3A%2F%2F107.170.70.175%3A8890%2Fsparql", "http%3A%2F%2Fnewspaper.org%2Farticles_2007", "rdf", options) : helperMissing.call(depth0, "link-to", "visualization", "Newspaper%20Articles%20Analysis", "http%3A%2F%2F107.170.70.175%3A8890%2Fsparql", "http%3A%2F%2Fnewspaper.org%2Farticles_2007", "rdf", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n  </li>\n  <li>\n      ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(13, program13, data),contexts:[depth0,depth0,depth0,depth0,depth0],types:["STRING","STRING","STRING","STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "visualization", "Newspaper%20Articles%20Analysis", "http%3A%2F%2F107.170.70.175%3A3002%2Ftestsets%2FUC2_Newspaper-Articles-Analysis.csv", "-", "csv", options) : helperMissing.call(depth0, "link-to", "visualization", "Newspaper%20Articles%20Analysis", "http%3A%2F%2F107.170.70.175%3A3002%2Ftestsets%2FUC2_Newspaper-Articles-Analysis.csv", "-", "csv", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n  </li>\n  <li>\n      ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(15, program15, data),contexts:[depth0,depth0,depth0,depth0,depth0],types:["STRING","STRING","STRING","STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "visualization", "Drug%20Price%20Analysis", "http%3A%2F%2F107.170.70.175%3A3002%2Ftestsets%2FUC1_Drug_Price_Analysis.csv", "-", "csv", options) : helperMissing.call(depth0, "link-to", "visualization", "Drug%20Price%20Analysis", "http%3A%2F%2F107.170.70.175%3A3002%2Ftestsets%2FUC1_Drug_Price_Analysis.csv", "-", "csv", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n  </li>\n</ul>\n");
  return buffer;
  
});

Ember.TEMPLATES["publish"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashContexts, hashTypes, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("<div class=\"consumption\">\n    <h7> EMBED INTO WEBSITE </h7>\n    ");
  hashContexts = {'value': depth0,'cols': depth0,'rows': depth0};
  hashTypes = {'value': "ID",'cols': "STRING",'rows': "STRING"};
  options = {hash:{
    'value': ("controller.visualizationSVG"),
    'cols': ("60"),
    'rows': ("1")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.textarea || depth0.textarea),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "textarea", options))));
  data.buffer.push("\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["save"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashContexts, hashTypes, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("<div class=\"consumption\">\n    <h7> SAVE SETTINGS </h7>\n    <div class=\"row collapse\">\n        <div class=\"medium-10 small-9 columns\">\n            ");
  hashContexts = {'value': depth0,'placeholder': depth0};
  hashTypes = {'value': "STRING",'placeholder': "STRING"};
  options = {hash:{
    'value': (""),
    'placeholder': ("Enter name.")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n        </div>\n        <div class=\"medium-2 small-3 columns\">\n            <a ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "save", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"postfix\"> <i class=\"fi-save save-visualization\"></i></a> \n        </div>\n    </div>\n</div>");
  return buffer;
  
});

Ember.TEMPLATES["slideShow"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts, options;
  data.buffer.push("\n<div><a ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "chooseVisualization", "visualization", {hash:{},contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("> <img ");
  hashContexts = {'src': depth0};
  hashTypes = {'src': "STRING"};
  options = {hash:{
    'src': ("visualization.thumbnail")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(" /></a></div>\n");
  return buffer;
  }

  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "visualization", "in", "view.slides", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
  
});

Ember.TEMPLATES["vistemplates/dimension-area"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\n        <div class=\"dim-metadata\">\n           ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "view.label", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" (");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "type", "in", "view.metadata", {hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push(")\n        </div>\n        <div class=\"dim-area-item\">\n            ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "areaItem", "in", "view.inArea", {hash:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        </div>\n    ");
  return buffer;
  }
function program2(depth0,data) {
  
  var hashTypes, hashContexts;
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "type", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  }

function program4(depth0,data) {
  
  
  data.buffer.push("any");
  }

function program6(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\n                ");
  hashContexts = {'item': depth0,'collection': depth0};
  hashTypes = {'item': "ID",'collection': "ID"};
  options = {hash:{
    'item': ("areaItem"),
    'collection': ("view.inArea")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['property-item'] || depth0['property-item']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "property-item", options))));
  data.buffer.push("	               \n            ");
  return buffer;
  }

  data.buffer.push("<div class=\"col-xs-6 area-box\">\n    ");
  hashContexts = {'inArea': depth0,'metadata': depth0,'label': depth0};
  hashTypes = {'inArea': "ID",'metadata': "ID",'label': "ID"};
  options = {hash:{
    'inArea': ("view.content"),
    'metadata': ("view.metadata"),
    'label': ("view.label")
  },inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['droppable-area'] || depth0['droppable-area']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "droppable-area", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["vistemplates/selectField"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


  data.buffer.push("<span class=\"configurationOption\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "view.label", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</span>  ");
  hashContexts = {'viewName': depth0,'content': depth0,'optionLabelPath': depth0,'selection': depth0};
  hashTypes = {'viewName': "STRING",'content': "ID",'optionLabelPath': "STRING",'selection': "ID"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {hash:{
    'viewName': ("selectField"),
    'content': ("view.values"),
    'optionLabelPath': ("content.label"),
    'selection': ("view.content")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n");
  data.buffer.push("\n\n");
  return buffer;
  
});

Ember.TEMPLATES["vistemplates/textField"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  data.buffer.push("<span class=\"configurationOption\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "view.label", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</span> ");
  hashContexts = {'type': depth0,'value': depth0};
  hashTypes = {'type': "STRING",'value': "ID"};
  options = {hash:{
    'type': ("text"),
    'value': ("view.content")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  return buffer;
  
});

Ember.TEMPLATES["vistemplates/tuning-check"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  data.buffer.push("<span class=\"configurationOption\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "view.label", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</span>  ");
  hashContexts = {'type': depth0,'checked': depth0};
  hashTypes = {'type': "STRING",'checked': "ID"};
  options = {hash:{
    'type': ("checkbox"),
    'checked': ("view.content")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n");
  return buffer;
  
});

Ember.TEMPLATES["vistemplates/tuning-numinput"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  data.buffer.push("<span class=\"configurationOption\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "view.label", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</span>  ");
  hashContexts = {'type': depth0,'value': depth0};
  hashTypes = {'type': "STRING",'value': "ID"};
  options = {hash:{
    'type': ("text"),
    'value': ("view.content")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n");
  return buffer;
  
});

Ember.TEMPLATES["visualization"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashContexts, hashTypes, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  data.buffer.push("<div class=\"row box\">\n    <div class=\"large-5 medium-3 columns\">\n        <!-- Visualization Selection -->        \n        <div class=\"row inner_box\">\n            <div class=\"inner_title_box\">\n                <h7>SELECT VISUALIZATION</h7>\n            </div> \n            <div class=\"sliderWrapper\">\n                ");
  hashContexts = {'slides': depth0};
  hashTypes = {'slides': "ID"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.SlideShowView", {hash:{
    'slides': ("controller.recommendations")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n            </div>    \n        </div>                    \n        <!-- Visualization Configuration - Left: Tree with data source; Right: dimension mapping -->        \n        <div class=\"row inner_box\">\n            <div class=\"inner_title_box\">\n                <h7>CONFIGURE VISUALIZATION</h7>\n            </div>                    \n            ");
  hashContexts = {'strOptionsConfVis': depth0,'confVis': depth0,'dsConfVis': depth0,'treeContent': depth0};
  hashTypes = {'strOptionsConfVis': "ID",'confVis': "ID",'dsConfVis': "ID",'treeContent': "ID"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.ConfigureVisualizationView", {hash:{
    'strOptionsConfVis': ("controller.structureOptions"),
    'confVis': ("controller.visualizationConfiguration"),
    'dsConfVis': ("controller.datasource"),
    'treeContent': ("controller.treeContent")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n        </div>                        \n        <!-- Visualization Customization -->   \n        <div class=\"row inner_box\">    \n            <div class=\"inner_title_box\">\n                <h7>CUSTOMIZE VISUALIZATION</h7>\n            </div> \n            <div class=\"row\">                        \n                ");
  hashContexts = {'options': depth0,'config': depth0,'tagName': depth0,'class': depth0};
  hashTypes = {'options': "ID",'config': "ID",'tagName': "STRING",'class': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.VisualizationOptionsView", {hash:{
    'options': ("controller.layoutOptions"),
    'config': ("controller.visualizationConfiguration"),
    'tagName': ("ul"),
    'class': ("small-block-grid-2 medium-block-grid-3 large-block-grid-5")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("                  \n            </div>      \n        </div>  \n    </div>                                          \n          \n    <div class=\"large-7 medium-9 columns\">       \n        <div class=\"inner_box\">\n            <!-- Visualization -->\n            <div class=\"row inner_box\">\n                <div id=\"visualization\"></div>               \n            </div \n            <!-- Visualization Consumption -->                       \n            <div class=\"row\">\n                <div class=\"large-4 medium-4 columns\">      \n                    ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.partial || depth0.partial),stack1 ? stack1.call(depth0, "export", options) : helperMissing.call(depth0, "partial", "export", options))));
  data.buffer.push("\n                </div> \n                <div class=\"large-4 medium-4 columns\">      \n                    ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.partial || depth0.partial),stack1 ? stack1.call(depth0, "save", options) : helperMissing.call(depth0, "partial", "save", options))));
  data.buffer.push("\n                </div> \n                <div class=\"large-4 medium-4 columns\">      \n                    ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.partial || depth0.partial),stack1 ? stack1.call(depth0, "publish", options) : helperMissing.call(depth0, "partial", "publish", options))));
  data.buffer.push("\n                </div> \n            </div>  \n        </div>\n    </div>   \n\n</div>\n");
  return buffer;
  
});