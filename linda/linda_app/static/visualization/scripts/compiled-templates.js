Ember.TEMPLATES["application"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  
  data.buffer.push("LinDa VIS");
  }

function program3(depth0,data) {
  
  
  data.buffer.push("Upload data");
  }

  data.buffer.push("<div class=\"container\">\n    <div id=\"header\">\n        <nav class=\"top-bar\" data-topbar role=\"navigation\">\n            <ul class=\"title-area\">\n               <li class=\"name\">\n                    <h1>");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "index", options) : helperMissing.call(depth0, "link-to", "index", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("</h1>\n                </li>\n            </ul>\n            <section class=\"top-bar-section\">\n                <ul class=\"right\">\n                    <li>");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "upload", options) : helperMissing.call(depth0, "link-to", "upload", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("</li>\n                </ul>\n            </section>\n        </nav>\n    </div>\n\n    <div class=\"row left-collapse\">\n        ");
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


  data.buffer.push("<div class=\"areaItem\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "item.label", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" <a ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "remove", "item", {hash:{},contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("> x </a> ");
  hashContexts = {'checked': depth0};
  hashTypes = {'checked': "ID"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Checkbox", {hash:{
    'checked': ("item.groupBy")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</div>\n\n                          ");
  return buffer;
  
});

Ember.TEMPLATES["components/tree-branch"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var stack1, hashTypes, hashContexts, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\n    ");
  hashContexts = {'node': depth0,'selection': depth0,'expansion': depth0};
  hashTypes = {'node': "ID",'selection': "ID",'expansion': "ID"};
  options = {hash:{
    'node': ("child"),
    'selection': ("selection"),
    'expansion': ("expansion")
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
  hashContexts = {'node': depth0,'selection': depth0,'expansion': depth0};
  hashTypes = {'node': "ID",'selection': "ID",'expansion': "ID"};
  options = {hash:{
    'node': ("node"),
    'selection': ("selection"),
    'expansion': ("expansion")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['tree-branch'] || depth0['tree-branch']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "tree-branch", options))));
  data.buffer.push("\n");
  return buffer;
  }

  data.buffer.push("<div ");
  hashContexts = {'draggable': depth0};
  hashTypes = {'draggable': "STRING"};
  options = {hash:{
    'draggable': ("node.draggable:true")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(">\n    <span ");
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
  data.buffer.push("\n    </span>\n\n    ");
  hashContexts = {'type': depth0,'checked': depth0};
  hashTypes = {'type': "STRING",'checked': "ID"};
  options = {hash:{
    'type': ("checkbox"),
    'checked': ("node.selected")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n\n    <span ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggle", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
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

Ember.TEMPLATES["index"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("<dl class=\"workflow\">\n    <dd>\n        ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.outlet || depth0.outlet),stack1 ? stack1.call(depth0, "selectData", options) : helperMissing.call(depth0, "outlet", "selectData", options))));
  data.buffer.push("\n    </dd>\n    <dd>\n        ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.outlet || depth0.outlet),stack1 ? stack1.call(depth0, "visualizeData", options) : helperMissing.call(depth0, "outlet", "visualizeData", options))));
  data.buffer.push("\n    </dd>\n</dl>");
  return buffer;
  
});

Ember.TEMPLATES["selectData"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashContexts, hashTypes, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("<div class=\"row workflow_step\">\n    <h6>Explore and Select Data</h6>\n</div>\n<div class=\"row box\">\n    <div class=\"large-4 medium-6 columns\">\n        <div class=\"inner_subtitle_box\"><h7>Select Data</h7></div>\n        <div class=\"inner_box\">\n            <!--title bar with search field and 'order by' select field-->\n             <div class=\"row collapse\">                             \n                <div class=\"large-11 medium-11 columns\">\n                    <!--search field-->\n                    ");
  hashContexts = {'action': depth0,'on': depth0,'placeholder': depth0};
  hashTypes = {'action': "STRING",'on': "STRING",'placeholder': "STRING"};
  options = {hash:{
    'action': ("search"),
    'on': ("key-press"),
    'placeholder': ("Search")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n                </div>\n                <div class=\"large-1 medium-1 columns\">\n                    <i class=\"postfix fi-magnifying-glass\"></i>\n                </div>\n            </div>\n\n            <div class=\"col-xs-6\">\n               ");
  hashContexts = {'node': depth0,'selection': depth0,'expansion': depth0};
  hashTypes = {'node': "ID",'selection': "ID",'expansion': "ID"};
  options = {hash:{
    'node': ("controller.treeContent"),
    'selection': ("controller.dataSelection"),
    'expansion': ("controller.tableContent")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['tree-branch'] || depth0['tree-branch']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "tree-branch", options))));
  data.buffer.push(" <!--tree component-->\n            </div>\n        </div>\n    </div>\n    <div class=\"large-8 medium-6 columns\">\n        <div class=\"inner_subtitle_box\">\n            <h7>Preview Selected Data</h7> <a class=\"right\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "visualize", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">Visualize</a> \n        </div>\n        <div class=\"inner_box\">\n            <!--title bar plus 'visualize' button-->\n            <div>\n                <!--'visualize' button-->\n            </div>\n        \n            <div>\n                <!---->\n                 ");
  hashContexts = {'list': depth0};
  hashTypes = {'list': "ID"};
  options = {hash:{
    'list': ("controller.tableContent")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['data-table'] || depth0['data-table']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "data-table", options))));
  data.buffer.push("\n                 \n            </div>\n        </div>\n    </div>\n</div>");
  return buffer;
  
});

Ember.TEMPLATES["upload"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  


  data.buffer.push(" <h5>Manage Datasources</h5>");
  
});

Ember.TEMPLATES["vistemplates/area"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\n    <div style=\"height:7rem; overflow:auto; text-align: left; \">\n        ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "item_", "in", "view.inArea", {hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </div>\n    ");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\n        ");
  hashContexts = {'item': depth0,'collection': depth0};
  hashTypes = {'item': "ID",'collection': "ID"};
  options = {hash:{
    'item': ("item_"),
    'collection': ("view.inArea")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['property-item'] || depth0['property-item']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "property-item", options))));
  data.buffer.push("	\n        ");
  return buffer;
  }

function program4(depth0,data) {
  
  
  data.buffer.push("\n        <div style=\"color:#888888; font-size:14pt; text-align: center\">Drop here</div>\n        ");
  }

  data.buffer.push("<div class=\"col-xs-6 area-box\">\n    <h6>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "view.label", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</h6>\n\n    ");
  hashContexts = {'inArea': depth0};
  hashTypes = {'inArea': "ID"};
  options = {hash:{
    'inArea': ("view.content")
  },inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['droppable-area'] || depth0['droppable-area']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "droppable-area", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["vistemplates/box"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n            ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "childView", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n        ");
  return buffer;
  }

  data.buffer.push("<div class=\"box\">\n    <div class=\"boxTitle\">\n        ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "view.label", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n    </div>\n\n    <ul class=\"boxContent\">\n        ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "childView", "in", "view.childrenViews", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </ul>\n</div>");
  return buffer;
  
});

Ember.TEMPLATES["vistemplates/selectField"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


  data.buffer.push("<ul class=\"list\" style=\"font-size: 9pt\">\n    <li style=\"width:30%\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "view.label", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</li>\n    <li style=\"width:60%\">\n        <!--view in content und selection bezieht sich auf die selectField.hbs view nicht auf Ember.Select view -->\n        ");
  hashContexts = {'viewName': depth0,'content': depth0,'optionLabelPath': depth0,'selection': depth0};
  hashTypes = {'viewName': "STRING",'content': "ID",'optionLabelPath': "STRING",'selection': "ID"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {hash:{
    'viewName': ("selectField"),
    'content': ("view.values"),
    'optionLabelPath': ("content.label"),
    'selection': ("view.content")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n            ");
  data.buffer.push("\n    </li>\n</ul>");
  return buffer;
  
});

Ember.TEMPLATES["vistemplates/textField"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  data.buffer.push("<ul class=\"list\" style=\"font-size: 9pt\">\n    <li style=\"width:30%\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "view.label", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</li>\n    <li style=\"width:60%\">\n        ");
  hashContexts = {'type': depth0,'value': depth0};
  hashTypes = {'type': "STRING",'value': "ID"};
  options = {hash:{
    'type': ("text"),
    'value': ("view.content")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n    </li>\n</ul>");
  return buffer;
  
});

Ember.TEMPLATES["vistemplates/treeView"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("    \n\n                ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "childView", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n                \n            ");
  return buffer;
  }

  data.buffer.push("<div class=\"row left-collapse\">\n    <div class=\"large-3 medium-3 columns\">\n        <h6 class=\"workflowStepTitle\"  style=\"background-color: #eeeeee; padding: 0.17rem;\">Data View</h6>\n        <div class=\"contents\"> \n            <div class=\"row\">\n                <div class=\"col-xs-6\">\n                    ");
  hashContexts = {'node': depth0};
  hashTypes = {'node': "ID"};
  options = {hash:{
    'node': ("controller.treeContent")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['tree-branch'] || depth0['tree-branch']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "tree-branch", options))));
  data.buffer.push("\n                </div>              \n            </div>                       \n        </div>                      \n    </div>    \n    <div class=\"stage large-9 medium-9 columns\" style=\"background-color: #ffffff; padding-top:0rem;\">\n        <h6 class=\"workflowStepTitle\"  style=\"background-color: #eeeeee; padding: 0.10rem;\">Dimensions Mapping</h6>\n        <ul class=\"small-block-grid-4 medium-block-grid-4 large-block-grid-4 areas\" style=\"background-color: #ffffff\">\n\n            ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers.each.call(depth0, "childView", "in", "view.childrenViews", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push(" \n            \n        </ul>\n    </div>        \n</div>                ");
  return buffer;
  
});

Ember.TEMPLATES["visualizeData"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts, options;
  data.buffer.push("\n                        <li>\n                            <div><a ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "configure", "tool", {hash:{},contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("> ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "tool.name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" </a></div>\n                            <img ");
  hashContexts = {'src': depth0};
  hashTypes = {'src': "STRING"};
  options = {hash:{
    'src': ("tool.thumbnail")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(" />\n                        </li>\n                        ");
  return buffer;
  }

  data.buffer.push("<!--List with recommended visualizations-->\n<div class=\"row workflow_step\">\n    <h6>Visualize Data</h6>\n</div>\n<div class=\"row box\">\n    <div class=\"row\" data-equalizer>\n        <div class=\"large-10 medium-9 columns\">\n            <div class=\"inner_box\" data-equalizer-watch>\n                <!-- Visualization -->\n                <div class=\"inner_box\">\n                    <div id=\"visualisation\">Visualization</div>\n                </div>\n                <!-- Consumption -->                       \n                <div id=\"consumption\">\n                    <ul>\n                        <li> <a ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "export", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">Export</a> </li>\n                        <li> <a ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "publish", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">Publish</a> </li>\n                        <li> <a ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "save", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">Save</a> </li>\n                        <li> <a ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "share", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">Share</a> </li>\n                    </ul>\n                </div> \n                <!-- Customization -->\n                <div class=\"inner_title_box\">\n                    <h7>Customize Visualization</h7>\n                </div>\n                <div class=\"inner_box\">\n                    ");
  hashContexts = {'tagName': depth0,'elementId': depth0};
  hashTypes = {'tagName': "STRING",'elementId': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.ContainerView", {hash:{
    'tagName': ("ul"),
    'elementId': ("tuningOptionsView")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n                </div>\n            </div>\n        </div>\n        <div class=\"large-2 medium-3 columns\">\n            <div data-equalizer-watch>\n                <div class=\"inner_title_box\">\n                    <h7>Suggestions</h7>\n                </div>\n                <div class=\"inner_box\" >\n                    <ul >              \n                        ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "tool", "in", "suggestions", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                    </ul>\n                </div> \n            </div>\n        </div>\n    </div>\n    <!-- Configuration -->        \n    <div class=\"row inner_title_box\">\n        <h7>Configure Visualization</h7>\n    </div>\n    <div class=\"row inner_box\">\n        <!-- Tree (selected data) -->\n        <div class=\"large-4 medium-5 columns\">   \n            <div class=\"inner_subtitle_box\">\n                <h7> Selected Data </h7>\n            </div>\n            <div class=\"inner_box\">\n                Tree\n            </div>\n        </div>\n        <!-- Dimension Mapping -->\n        <div class=\"large-8 medium-7 columns\">\n            <div class=\"inner_subtitle_box\">\n                <h7> Dimension Mapping </h7>\n            </div>\n            <div class=\"inner_box\">\n                <!--");
  hashContexts = {'classNames': depth0,'tagName': depth0,'elementId': depth0};
  hashTypes = {'classNames': "STRING",'tagName': "STRING",'elementId': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.ContainerView", {hash:{
    'classNames': ("list"),
    'tagName': ("ul"),
    'elementId': ("structureOptionsView")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("-->\n            </div>\n\n        </div>\n    </div>\n</div>\n\n\n\n<script>\n    $(document).foundation();\n</script>");
  return buffer;
  
});