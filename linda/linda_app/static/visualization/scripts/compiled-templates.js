Ember.TEMPLATES["application"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  
  data.buffer.push("\n                    <a class=\"navbar-brand\" href=\"#\">\n                        <img src=\"/static/images/logo_.png\"/> <span> LinDA Visualization</span>\n                    </a>\n                    ");
  }

  data.buffer.push("<div class=\"container\">\n    <div id=\"header\">\n        <nav class=\"navbar navbar-default\" >\n            <div class=\"container-fluid\"> \n                <div class=\"navbar-header\">\n\n                    ");
  hashContexts = {'animations': depth0};
  hashTypes = {'animations': "STRING"};
  options = {hash:{
    'animations': ("main:fade")
  },inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "index", options) : helperMissing.call(depth0, "link-to", "index", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n\n                </div>\n                <div class=\"collapse navbar-collapse\">  \n                   \n                    <div class=\"btn-group pull-right\" role=\"group\" aria-label=\"...\">\n                        <button type=\"button\" class=\"btn btn-default navbar-btn\">\n                            <span class=\"glyphicon glyphicon-cog\" aria-hidden=\"true\"></span>\n                        </button>\n                        <button type=\"button\" class=\"btn btn-default navbar-btn\">\n                            <span class=\"glyphicon glyphicon-open-file\" aria-hidden=\"true\"></span>\n                        </button>\n                    </div>\n\n                </div>               \n            </div>\n        </nav>\n    </div>\n    <div>\n        ");
  hashContexts = {'animationSequence': depth0};
  hashTypes = {'animationSequence': "STRING"};
  options = {hash:{
    'animationSequence': ("async")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.outlet || depth0.outlet),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "outlet", options))));
  data.buffer.push("\n    </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["components/draggable-item"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "yield", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n   ");
  return buffer;
  
});

Ember.TEMPLATES["components/droppable-area"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var hashTypes, hashContexts, escapeExpression=this.escapeExpression;


  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "yield", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  
});

Ember.TEMPLATES["components/property-item"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashContexts, hashTypes, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("<div class=\"area-item-label\">\n     <div ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("item.datatype")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(">      \n       ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "item.label", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" <a class=\"area-item-remove\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "remove", "item", {hash:{},contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("> X </a> \n    </div>\n</div>\n\n");
  return buffer;
  
});

Ember.TEMPLATES["configure"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  


  data.buffer.push("<div class=\"row box\">\n    <div class=\"large-12 medium-12 columns\">\n        <div class=\"inner_box dsdefault\">\n            <div class=\"inner_title_box\">\n                <h7>Configuration</h7>\n            </div>\n            <div>\n                Here you will be able to change user settings\n            </div>\n        </div>                                                            \n    </div>                                         \n</div>  ");
  
});

Ember.TEMPLATES["datasource"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  data.buffer.push("\n                    <span class=\"glyphicon glyphicon-resize-full\" aria-hidden=\"true\"></span> \n                    ");
  }

function program3(depth0,data) {
  
  
  data.buffer.push("\n                    <span class=\"glyphicon glyphicon-resize-small\" aria-hidden=\"true\"></span> \n                    ");
  }

  data.buffer.push("<div class=\"row\" id=\"ds_container\">\n    <div ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("isToggled:col-md-5:col-md-0")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(">\n        <!-- Data Selection -->\n        <div class=\"panel panel-default\">\n            <div class=\"panel-heading\">\n                <h1 class=\"panel-title pull-left\">Explore and Select Data</h1>\n            </div>\n            <div class=\"panel-body\">\n                ");
  hashContexts = {'treedata': depth0,'selection': depth0};
  hashTypes = {'treedata': "ID",'selection': "ID"};
  options = {hash:{
    'treedata': ("controller.treeContent"),
    'selection': ("controller.dataSelection")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['tree-selection'] || depth0['tree-selection']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "tree-selection", options))));
  data.buffer.push("  \n            </div>\n            <div class=\"panel-footer clearfix\">\n            </div>\n        </div>                                                      \n    </div>           \n    <div ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("isToggled:col-md-7:col-md-12")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(">\n        <!-- Data Selection Preview -->\n        <div class=\"panel panel-default\">\n            <div class=\"panel-heading\">\n                <h1 class=\"panel-title pull-left\">Preview Data Selection</h1>\n\n                <button type=\"button\" class=\"btn btn-default btn-xs pull-right\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggle", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n                    ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers['if'].call(depth0, "isToggled", {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n                </button>\n\n            </div>\n            <div class=\"panel-body\">\n                ");
  hashContexts = {'preview': depth0,'datasource': depth0};
  hashTypes = {'preview': "ID",'datasource': "ID"};
  options = {hash:{
    'preview': ("controller.dataSelection"),
    'datasource': ("controller.selectedDatasource")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['data-table'] || depth0['data-table']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "data-table", options))));
  data.buffer.push(" \n            </div>\n            <div class=\"panel-footer clearfix\">\n                <button type=\"button\" class=\"btn btn-default pull-right\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "visualize", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n                    <span class=\"glyphicon glyphicon-stats\" aria-hidden=\"true\"></span>   Visualize\n                </button>\n            </div>\n        </div>     \n    </div>\n</div>");
  return buffer;
  
});

Ember.TEMPLATES["export"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', hashContexts, hashTypes, escapeExpression=this.escapeExpression;


  data.buffer.push("<div>\n    <div class=\"consumption-title\">\n        <span> Export as </span>  ");
  hashContexts = {'content': depth0,'value': depth0,'class': depth0};
  hashTypes = {'content': "ID",'value': "ID",'class': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {hash:{
    'content': ("controller.exportFormats"),
    'value': ("controller.selectedFormat"),
    'class': ("btn btn-default dropdown-toggle")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" \n        <button type=\"button\" class=\"btn btn-default btn-xs\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "export", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n            <span class=\"glyphicon glyphicon-export\" aria-hidden=\"true\"></span>  Export\n        </button>\n    </div>  \n</div>\n\n");
  return buffer;
  
});

Ember.TEMPLATES["index"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("\n            1. DepartmentOfAgriculture-Quick Stats (RDF format)\n            ");
  }

function program3(depth0,data) {
  
  
  data.buffer.push("\n            2. DepartmentOfDefense-Marital Status (RDF format)\n            ");
  }

function program5(depth0,data) {
  
  
  data.buffer.push("\n            3. DepartmentofHealthandHumanServices-OMH Claims Listed by State (RDF format)\n            ");
  }

function program7(depth0,data) {
  
  
  data.buffer.push("\n            4. DepartmentOfTheInterior-Wildland Fires 1960-2008 (RDF format)\n            ");
  }

function program9(depth0,data) {
  
  
  data.buffer.push("\n            5. DepartmentOfState-Africa Conflicts Without Borders 2009 (RDF format)\n            ");
  }

function program11(depth0,data) {
  
  
  data.buffer.push("\n            6. DepartmentOfTheTreasury-Quarterly Report on Bank Derivatives Activities (RDF format)\n            ");
  }

function program13(depth0,data) {
  
  
  data.buffer.push("\n            7. DepartmentOfVeteransAffairs-Veterans Health Administration 2008 (RDF format)\n            ");
  }

function program15(depth0,data) {
  
  
  data.buffer.push("\n            8. GeneralServicesAdministration- Cash and Payments Management Data (RDF format)\n            ");
  }

function program17(depth0,data) {
  
  
  data.buffer.push("\n\n            9. NationalScienceFoundation- NSF Research Grant Funding Rates (RDF format)\n            ");
  }

function program19(depth0,data) {
  
  
  data.buffer.push("\n            10. NationalTransportationSafetyBoardAviation- Fatal Accident Statistics 2008 (RDF format)\n            ");
  }

function program21(depth0,data) {
  
  
  data.buffer.push("\n            11. OfficeOfPersonnelManagement-Fiscal Year 2007 Employee Survivor Annuitants (RDF format)\n            ");
  }

function program23(depth0,data) {
  
  
  data.buffer.push("     \n            12. SecurityAndExchangeCommission- Public Company Bankruptcy Cases 2009 (RDF format)\n            ");
  }

function program25(depth0,data) {
  
  
  data.buffer.push("\n            13. Sales Statistics (dimple dataset; CSV format)\n            ");
  }

function program27(depth0,data) {
  
  
  data.buffer.push("\n\n            14. GDP per Capita Example (temporal/statistical dataset; RDF (data cube) format)\n            ");
  }

function program29(depth0,data) {
  
  
  data.buffer.push("\n            15. Healthcare Example (geographical/statistical dataset; RDF (basic geo) format)\n            ");
  }

function program31(depth0,data) {
  
  
  data.buffer.push("\n            16. Water Quality Example (statistical dataset; RDF format)\n            ");
  }

function program33(depth0,data) {
  
  
  data.buffer.push("\n            17. Newspaper Articles Example (statistical dataset; RDF format)\n            ");
  }

function program35(depth0,data) {
  
  
  data.buffer.push("\n            18. Newspaper Articles Example (statistical dataset; RDF format)\n            ");
  }

function program37(depth0,data) {
  
  
  data.buffer.push("\n            19. Bundestagswahlstatistik (statistical dataset; RDF format)\n            ");
  }

function program39(depth0,data) {
  
  
  data.buffer.push("\n            19. Health Data.gov - Hospital Inpatient Discharges by Facility (statistical dataset; RDF format)\n            ");
  }

function program41(depth0,data) {
  
  
  data.buffer.push("\n            20. TS1 (statistical dataset; RDF format)\n            ");
  }

  data.buffer.push("<div class=\"box\" style=\"height:600px;\">\n    <h4>Example Datasets:</h4>\n    <ul>\n        <li>\n            ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0,depth0,depth0],types:["STRING","STRING","STRING","STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "datasource", "DepartmentOfAgriculture-Quick%20Stats", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FDepartmentOfAgriculture-QuickStats.nt", "rdf", options) : helperMissing.call(depth0, "link-to", "datasource", "DepartmentOfAgriculture-Quick%20Stats", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FDepartmentOfAgriculture-QuickStats.nt", "rdf", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n        </li>\n        <li>\n            ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0,depth0,depth0,depth0,depth0],types:["STRING","STRING","STRING","STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "datasource", "DepartmentOfDefense-Marital%20Status", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FDepartmentOfDefense-MaritalStatus.nt", "rdf", options) : helperMissing.call(depth0, "link-to", "datasource", "DepartmentOfDefense-Marital%20Status", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FDepartmentOfDefense-MaritalStatus.nt", "rdf", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n        </li>\n        <li>\n            ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0,depth0,depth0,depth0,depth0],types:["STRING","STRING","STRING","STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "datasource", "DepartmentofHealthandHumanServices-OMHClaims%20Listed%20by%20State", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FDepartmentofHealthandHumanServices-OMHClaimsListedbyState.nt", "rdf", options) : helperMissing.call(depth0, "link-to", "datasource", "DepartmentofHealthandHumanServices-OMHClaims%20Listed%20by%20State", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FDepartmentofHealthandHumanServices-OMHClaimsListedbyState.nt", "rdf", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n        </li>\n        <li> \n            ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0,depth0,depth0,depth0,depth0],types:["STRING","STRING","STRING","STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "datasource", "DepartmentOfTheInterior-Wildl%20and%20Fires%20and%201960-2008", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FDepartmentOfTheInterior-WildlandFiresand1960-2008.nt", "rdf", options) : helperMissing.call(depth0, "link-to", "datasource", "DepartmentOfTheInterior-Wildl%20and%20Fires%20and%201960-2008", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FDepartmentOfTheInterior-WildlandFiresand1960-2008.nt", "rdf", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n        </li>\n        <li>\n            ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0,depth0,depth0,depth0,depth0],types:["STRING","STRING","STRING","STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "datasource", "DepartmentofState-Africa%20Conflicts%20Without%20Borders%202009", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FDepartmentofState-AfricaConflictsWithoutBorders2009.nt", "rdf", options) : helperMissing.call(depth0, "link-to", "datasource", "DepartmentofState-Africa%20Conflicts%20Without%20Borders%202009", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FDepartmentofState-AfricaConflictsWithoutBorders2009.nt", "rdf", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n        </li>\n        <li>  \n            ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0,depth0,depth0,depth0,depth0],types:["STRING","STRING","STRING","STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "datasource", "DepartmentOfTheTreasury-Quarterly%20Report%20on%20Bank%20Derivatives%20Activities", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FDepartmentOfTheTreasury-QuarterlyReportonBankDerivativesActivities.nt", "rdf", options) : helperMissing.call(depth0, "link-to", "datasource", "DepartmentOfTheTreasury-Quarterly%20Report%20on%20Bank%20Derivatives%20Activities", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FDepartmentOfTheTreasury-QuarterlyReportonBankDerivativesActivities.nt", "rdf", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n        </li>     \n        <li>\n            ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(13, program13, data),contexts:[depth0,depth0,depth0,depth0,depth0],types:["STRING","STRING","STRING","STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "datasource", "DepartmentOfVeteransAffairs-Veterans%20Health%20Administration%202008", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FDepartmentOfVeteransAffairs-VeteransHealthAdministration2008.nt", "rdf", options) : helperMissing.call(depth0, "link-to", "datasource", "DepartmentOfVeteransAffairs-Veterans%20Health%20Administration%202008", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FDepartmentOfVeteransAffairs-VeteransHealthAdministration2008.nt", "rdf", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n        </li>       \n        <li>\n            ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(15, program15, data),contexts:[depth0,depth0,depth0,depth0,depth0],types:["STRING","STRING","STRING","STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "datasource", "GeneralServicesAdministration-Cash%20and%20Payments%20Management%20Data", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FGeneralServicesAdministration-CashandPaymentsManagementData.nt", "rdf", options) : helperMissing.call(depth0, "link-to", "datasource", "GeneralServicesAdministration-Cash%20and%20Payments%20Management%20Data", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FGeneralServicesAdministration-CashandPaymentsManagementData.nt", "rdf", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n        </li>\n        <li>\n            ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(17, program17, data),contexts:[depth0,depth0,depth0,depth0,depth0],types:["STRING","STRING","STRING","STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "datasource", "NationalScienceFoundation-NSF%20Research%20Grant%20Funding%20Rates", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FNationalScienceFoundation-NSFResearchGrantFundingRates.nt", "rdf", options) : helperMissing.call(depth0, "link-to", "datasource", "NationalScienceFoundation-NSF%20Research%20Grant%20Funding%20Rates", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FNationalScienceFoundation-NSFResearchGrantFundingRates.nt", "rdf", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n        </li>\n        <li>\n            ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(19, program19, data),contexts:[depth0,depth0,depth0,depth0,depth0],types:["STRING","STRING","STRING","STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "datasource", "NationalTransportationSafetyBoardAviation-Accident%20Statistics%202008", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FNationalTransportationSafetyBoardAviation-AccidentStatistics2008.nt", "rdf", options) : helperMissing.call(depth0, "link-to", "datasource", "NationalTransportationSafetyBoardAviation-Accident%20Statistics%202008", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FNationalTransportationSafetyBoardAviation-AccidentStatistics2008.nt", "rdf", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n        </li>\n        <li> \n            ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(21, program21, data),contexts:[depth0,depth0,depth0,depth0,depth0],types:["STRING","STRING","STRING","STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "datasource", "OfficeofPersonnelManagement-Fiscal%20Year%202007%20Employee%20Survivor%20Annuitants", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FOfficeofPersonnelManagement-FiscalYear2007EmployeeSurvivorAnnuitants.nt", "rdf", options) : helperMissing.call(depth0, "link-to", "datasource", "OfficeofPersonnelManagement-Fiscal%20Year%202007%20Employee%20Survivor%20Annuitants", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FOfficeofPersonnelManagement-FiscalYear2007EmployeeSurvivorAnnuitants.nt", "rdf", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n        </li>  \n        <li>\n            ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(23, program23, data),contexts:[depth0,depth0,depth0,depth0,depth0],types:["STRING","STRING","STRING","STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "datasource", "SecurityAndExchangeCommission-Public%20Company%20Bankruptcy%20Cases%202009", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FSecurityAndExchangeCommission-PublicCompanyBankruptcyCases2009.nt", "rdf", options) : helperMissing.call(depth0, "link-to", "datasource", "SecurityAndExchangeCommission-Public%20Company%20Bankruptcy%20Cases%202009", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FSecurityAndExchangeCommission-PublicCompanyBankruptcyCases2009.nt", "rdf", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n        </li>\n        <li>        \n            ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(25, program25, data),contexts:[depth0,depth0,depth0,depth0,depth0],types:["STRING","STRING","STRING","STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "datasource", "Sales%20Statistics", "http%3A%2F%2Flocalhost%3A3002%2Ftestsets%2FTS2_Sales_Statistics.csv", "-", "csv", options) : helperMissing.call(depth0, "link-to", "datasource", "Sales%20Statistics", "http%3A%2F%2Flocalhost%3A3002%2Ftestsets%2FTS2_Sales_Statistics.csv", "-", "csv", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n        </li>\n        <li>\n            ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(27, program27, data),contexts:[depth0,depth0,depth0,depth0,depth0],types:["STRING","STRING","STRING","STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "datasource", "World%20Bank%20GDP%20per%20capita", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2Fworldbank-slice-5000", "rdf", options) : helperMissing.call(depth0, "link-to", "datasource", "World%20Bank%20GDP%20per%20capita", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2Fworldbank-slice-5000", "rdf", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n        </li>\n        <li>\n            ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(29, program29, data),contexts:[depth0,depth0,depth0,depth0,depth0],types:["STRING","STRING","STRING","STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "datasource", "Healthcare%20Analysis", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fwww.hospitals_reviewer.com%2F2014", "rdf", options) : helperMissing.call(depth0, "link-to", "datasource", "Healthcare%20Analysis", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fwww.hospitals_reviewer.com%2F2014", "rdf", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n        </li>\n        <li>\n            ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(31, program31, data),contexts:[depth0,depth0,depth0,depth0,depth0],types:["STRING","STRING","STRING","STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "datasource", "Water%20Quality%20Analysis", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fwater_quality_check.it%2Finfo", "rdf", options) : helperMissing.call(depth0, "link-to", "datasource", "Water%20Quality%20Analysis", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fwater_quality_check.it%2Finfo", "rdf", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n        </li>\n        <li>\n            ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(33, program33, data),contexts:[depth0,depth0,depth0,depth0,depth0],types:["STRING","STRING","STRING","STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "datasource", "Newspaper%20Articles%20Analysis", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fnewspaper.org%2Farticles_2007", "rdf", options) : helperMissing.call(depth0, "link-to", "datasource", "Newspaper%20Articles%20Analysis", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fnewspaper.org%2Farticles_2007", "rdf", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n        </li>\n        <li>\n            ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(35, program35, data),contexts:[depth0,depth0,depth0,depth0,depth0],types:["STRING","STRING","STRING","STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "datasource", "Newspaper%20Articles%20Analysis", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fnewspaper.org%2Farticles_2007", "rdf", options) : helperMissing.call(depth0, "link-to", "datasource", "Newspaper%20Articles%20Analysis", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fnewspaper.org%2Farticles_2007", "rdf", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n        </li>\n        <li>\n            ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(37, program37, data),contexts:[depth0,depth0,depth0,depth0,depth0],types:["STRING","STRING","STRING","STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "datasource", "Bundestagswahlstatistik", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2FBundestagswahlstatistik", "rdf", options) : helperMissing.call(depth0, "link-to", "datasource", "Bundestagswahlstatistik", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2FBundestagswahlstatistik", "rdf", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n        </li>\n         <li>\n            ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(39, program39, data),contexts:[depth0,depth0,depth0,depth0,depth0],types:["STRING","STRING","STRING","STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "datasource", "Health Data.gov - Hospital Inpatient Discharges by Facility", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2FHealthData.govHospitalInpatientDischargesbyFacility", "rdf", options) : helperMissing.call(depth0, "link-to", "datasource", "Health Data.gov - Hospital Inpatient Discharges by Facility", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2FHealthData.govHospitalInpatientDischargesbyFacility", "rdf", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n        </li>\n         <li>\n            ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(41, program41, data),contexts:[depth0,depth0,depth0,depth0,depth0],types:["STRING","STRING","STRING","STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "datasource", "TS1", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A//www.linda-project.org/TS1_LinearRegression_Result_Original", "rdf", options) : helperMissing.call(depth0, "link-to", "datasource", "TS1", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A//www.linda-project.org/TS1_LinearRegression_Result_Original", "rdf", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n        </li>\n    </ul>\n</div>");
  return buffer;
  
});

Ember.TEMPLATES["propertiesList"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options;
  data.buffer.push("\n    <li>\n       <div ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("category.name")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push("> ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "category.datatype", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" </div>\n        <ul class=\"categorized-property\">\n            ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers.each.call(depth0, "item", "in", "category.items", {hash:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n        </ul>\n    </li> \n");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options;
  data.buffer.push("  \n                ");
  hashContexts = {'data': depth0,'tagName': depth0};
  hashTypes = {'data': "ID",'tagName': "STRING"};
  options = {hash:{
    'data': ("item"),
    'tagName': ("li")
  },inverse:self.noop,fn:self.program(3, program3, data),contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['draggable-item'] || depth0['draggable-item']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "draggable-item", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n            ");
  return buffer;
  }
function program3(depth0,data) {
  
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options;
  data.buffer.push("\n                   <div ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("item.datatype")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(">\n                    <div class=\"categorized-property-parents\">\n                    ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers.each.call(depth0, "p", "in", "item.parent", {hash:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n                    </div>\n                    <div class=\"categorized-property-name\">\n                        ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "view.data.label", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n                    </div>\n                  </div> \n                ");
  return buffer;
  }
function program4(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n                        <span class=\"categorized-property-parent\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "p.label", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" &raquo;</span>\n                    ");
  return buffer;
  }

  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "category", "in", "view.categories", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
  
});

Ember.TEMPLATES["publish"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  data.buffer.push("<div class=\"consumption\">\n    <div class=\"consumption-title\">\n        <a ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "publish", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("><h7> Embed Chart into Website </h7> </a>\n    </div>\n    ");
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


  data.buffer.push("<div>\n    <div class=\"consumption-title\">    \n        ");
  hashContexts = {'value': depth0,'placeholder': depth0,'size': depth0,'class': depth0};
  hashTypes = {'value': "ID",'placeholder': "STRING",'size': "STRING",'class': "STRING"};
  options = {hash:{
    'value': ("controller.configName"),
    'placeholder': ("Save settings"),
    'size': ("15"),
    'class': ("form-control")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("    \n         <button type=\"button\" class=\"btn btn-default btn-xs\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "save", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n            <span class=\"glyphicon glyphicon-save\" aria-hidden=\"true\"></span>  Save\n        </button>\n    </div>    \n</div>");
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
  data.buffer.push("> <span ");
  hashContexts = {'data-visualization-name': depth0};
  hashTypes = {'data-visualization-name': "STRING"};
  options = {hash:{
    'data-visualization-name': ("visualization.visualizationName")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(" ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("visualization.valid:valid-suggestion:invalid-suggestion :visualization-thumbnail")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push("> </span> </a></div>\n");
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
  data.buffer.push("\n        <div class=\"dim-name\">\n           ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "view.label", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" \n        </div>\n        <div class=\"dim-area-box\">\n        <div class=\"dim-metadata\">\n           Drag ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "type", "in", "view.metadata", {hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("here\n        </div>\n        <div class=\"dim-area-item\">\n            ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "areaItem", "in", "view.inArea", {hash:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        </div>\n        </div>\n    ");
  return buffer;
  }
function program2(depth0,data) {
  
  var hashTypes, hashContexts;
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "type", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  }

function program4(depth0,data) {
  
  
  data.buffer.push("any data ");
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
  data.buffer.push("\n            ");
  return buffer;
  }

  data.buffer.push("<div class=\"area-box\">\n    ");
  hashContexts = {'inArea': depth0,'metadata': depth0,'label': depth0,'maxNumItems': depth0};
  hashTypes = {'inArea': "ID",'metadata': "ID",'label': "ID",'maxNumItems': "ID"};
  options = {hash:{
    'inArea': ("view.content"),
    'metadata': ("view.metadata"),
    'label': ("view.label"),
    'maxNumItems': ("view.maxCardinality")
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
  hashContexts = {'type': depth0,'value': depth0,'on': depth0,'class': depth0};
  hashTypes = {'type': "STRING",'value': "ID",'on': "STRING",'class': "STRING"};
  options = {hash:{
    'type': ("text"),
    'value': ("view.content"),
    'on': ("enter"),
    'class': ("form-control")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n");
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
  data.buffer.push("\n\n");
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
  hashContexts = {'type': depth0,'value': depth0,'on': depth0,'class': depth0};
  hashTypes = {'type': "STRING",'value': "ID",'on': "STRING",'class': "STRING"};
  options = {hash:{
    'type': ("text"),
    'value': ("view.content"),
    'on': ("key-press"),
    'class': ("form-control Number")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n\n");
  return buffer;
  
});

Ember.TEMPLATES["visualization"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  data.buffer.push("\n                    <span class=\"glyphicon glyphicon-resize-full\" aria-hidden=\"true\"></span> \n                    ");
  }

function program3(depth0,data) {
  
  
  data.buffer.push("\n                    <span class=\"glyphicon glyphicon-resize-small\" aria-hidden=\"true\"></span> \n                    ");
  }

  data.buffer.push("<div class=\"row\" id=\"v_container\">\n    <div ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("isToggled:col-md-5:col-md-0")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(">\n        <!-- Visualization Selection -->\n        <div class=\"panel panel-default\">\n            <div class=\"panel-heading\">\n                <h1 class=\"panel-title pull-left\">Select Visualization</h1>\n            </div>\n            <div class=\"panel-body\">\n                <div class=\"sliderWrapper\">\n                    ");
  hashContexts = {'slides': depth0};
  hashTypes = {'slides': "ID"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.SlideShowView", {hash:{
    'slides': ("controller.model")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n                </div>\n            </div>\n        </div>\n\n        <!-- Visualization Configuration - Left: Tree with data source; Right: dimension mapping -->\n        <div class=\"panel panel-default\">\n            <div class=\"panel-heading\">\n                <h1 class=\"panel-title pull-left\">Configure Visualization</h1>\n            </div>\n            <div class=\"panel-body\">\n                <div class=\"row\">\n                    <div class=\"col-md-6\">\n                        <div class=\"panel panel-default\">\n                            <div class=\"panel-heading\">\n                                <h1 class=\"panel-title pull-left\">Selected Data</h1>\n                            </div>\n                            <div class=\"panel-body\">\n                                ");
  hashContexts = {'categories': depth0};
  hashTypes = {'categories': "ID"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.PropertiesListView", {hash:{
    'categories': ("controller.categorizedProperties")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n                            </div>                           \n                        </div> \n                    </div>\n                    <div class=\"col-md-6\">\n                        <div class=\"panel panel-default\">\n                            <div class=\"panel-heading\">\n                                <h1 class=\"panel-title pull-left\">Visualization Options</h1>\n                            </div>\n                            <div class=\"panel-body\">\n                                ");
  hashContexts = {'options': depth0,'config': depth0};
  hashTypes = {'options': "ID",'config': "ID"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.VisualizationOptionsView", {hash:{
    'options': ("controller.structureOptions"),
    'config': ("controller.visualizationConfiguration")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n                            </div> \n\n                        </div>\n                    </div>\n                </div>\n            </div>\n            <div class=\"panel-footer clearfix\">\n                <button type=\"button\" class=\"btn btn-default pull-right\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "select", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n                    <span class=\"glyphicon glyphicon-stats\" aria-hidden=\"true\"></span>   Select Data\n                </button>\n            </div>\n        </div>\n\n    </div>\n\n    <div ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("isToggled:col-md-7:col-md-12")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(">\n        <!-- Visualization -->\n        <div class=\"panel panel-default\">\n            <div class=\"panel-heading\">\n                <h1 class=\"panel-title pull-left\">Configured Visualization</h1>\n                <button type=\"button\" class=\"btn btn-default btn-xs pull-right\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggle", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n                    ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers['if'].call(depth0, "isToggled", {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n                </button>\n            </div>\n            <div class=\"panel-body\">\n                ");
  hashContexts = {'id': depth0,'visualization': depth0,'configurationArray': depth0};
  hashTypes = {'id': "STRING",'visualization': "ID",'configurationArray': "ID"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.DrawVisualizationView", {hash:{
    'id': ("visualization"),
    'visualization': ("controller.drawnVisualization"),
    'configurationArray': ("controller.visualizationConfiguration")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("            \n            </div>\n            <div class=\"panel-footer clearfix\">\n                <div class=\"row\">\n                    <div class=\"col-md-6\">\n                        <div class=\"row\">\n                            ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.partial || depth0.partial),stack1 ? stack1.call(depth0, "export", options) : helperMissing.call(depth0, "partial", "export", options))));
  data.buffer.push("\n                        </div>\n                        <div class=\"row\">\n                            ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.partial || depth0.partial),stack1 ? stack1.call(depth0, "save", options) : helperMissing.call(depth0, "partial", "save", options))));
  data.buffer.push("\n                        </div>\n                    </div>\n                \n                <div class=\"col-md-6\">\n                    ");
  hashContexts = {'options': depth0,'config': depth0};
  hashTypes = {'options': "ID",'config': "ID"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.VisualizationOptionsView", {hash:{
    'options': ("controller.layoutOptions"),
    'config': ("controller.visualizationConfiguration")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n                </div>\n                    <div class=\"col-md-6\"></div>\n            </div>\n        </div>\n    </div>\n</div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["visualizationConfig"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options;
  data.buffer.push("\n                    ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0,depth0],types:["STRING","STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "visualization", "visualizationConfiguration", "visualization.id", options) : helperMissing.call(depth0, "link-to", "visualization", "visualizationConfiguration", "visualization.id", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n                ");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "visualization.configurationName", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("<br>");
  return buffer;
  }

  data.buffer.push("<div class=\"row box\">\n    <div class=\"large-12 medium-12 columns\">\n        <div class=\"inner_box dsdefault\">\n            <div class=\"inner_title_box\">\n                <h7>Load</h7>\n            </div>\n            <div>\n                ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "visualization", "in", "controller", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n            </div>\n        </div>                                                            \n    </div>                                         \n</div>  ");
  return buffer;
  
});