Ember.TEMPLATES["application"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  
  data.buffer.push("LinDA Visualization");
  }

function program3(depth0,data) {
  
  
  data.buffer.push("<i  class=\"fi-upload\" title=\"Load\"> </i>");
  }

function program5(depth0,data) {
  
  
  data.buffer.push("<i  class=\"fi-widget\" title=\"Configure\"> </i>");
  }

  data.buffer.push("<div class=\"container\">\n    <div id=\"header\">\n        <nav class=\"top-bar\" data-topbar role=\"navigation\">\n            <ul class=\"title-area\">\n                <li class=\"name\">\n                    <h1>");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "index", options) : helperMissing.call(depth0, "link-to", "index", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("</h1>\n                </li>\n            </ul>\n            <section class=\"top-bar-section\">\n                <!-- Right Nav Section -->\n                <ul class=\"right\">\n                    <li>");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "loadVisualization", options) : helperMissing.call(depth0, "link-to", "loadVisualization", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("</li>\n                    <li>");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "configure", options) : helperMissing.call(depth0, "link-to", "configure", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("</li>\n                </ul>\n            </section>\n        </nav>\n    </div>\n\n    <div class=\"row left-collapse\">\n        ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
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
  var buffer = '', stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n            <span class=\"categorized-property-parent\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "p.label", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" &raquo;</span>\n        ");
  return buffer;
  }

  data.buffer.push("<div class=\"large-10 medium-10 columns area-item-label truncate\">\n    <div class=\"categorized-property-parents\">\n        ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "p", "in", "item.parent", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </div>\n    <div class=\"categorized-property-name\">\n        ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "item.label", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n    </div>\n</div>\n<div class=\"large-2 medium-2 columns area-item-remove\">\n    <a ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "remove", "item", {hash:{},contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("> x </a>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["configure"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  


  data.buffer.push("<div class=\"row box\">\n    <div class=\"large-12 medium-12 columns\">\n        <div class=\"inner_box dsdefault\">\n            <div class=\"inner_title_box\">\n                <h7>Configuration</h7>\n            </div>\n            <div>\n                Here you will be able to change user settings\n            </div>\n        </div>                                                            \n    </div>                                         \n</div>  ");
  
});

Ember.TEMPLATES["configureVisualization"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', hashContexts, hashTypes, escapeExpression=this.escapeExpression;


  data.buffer.push("<div class=\"row left-collapse\">\n    <div class=\"large-7 medium-6 columns properties-list-content\">\n        ");
  hashContexts = {'categories': depth0};
  hashTypes = {'categories': "ID"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.PropertiesListView", {hash:{
    'categories': ("view.categorizedProperties")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n    </div>\n    <div class=\"large-5 medium-6 columns dimensions\">\n        <div>\n            ");
  hashContexts = {'options': depth0,'config': depth0};
  hashTypes = {'options': "ID",'config': "ID"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.VisualizationOptionsView", {hash:{
    'options': ("view.strOptionsConfVis"),
    'config': ("view.confVis")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n        </div>\n    </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["datasource"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashContexts, hashTypes, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("<div class=\"row box\">\n    <div class=\"large-5 medium-3 columns\">\n        <!-- Data Selection -->        \n        <div class=\"row inner_box dsdefault\">\n            <div class=\"inner_title_box\">\n                <h7>Explore and Select Data</h7>\n            </div>\n            <div>\n                ");
  hashContexts = {'treedata': depth0,'selection': depth0};
  hashTypes = {'treedata': "ID",'selection': "ID"};
  options = {hash:{
    'treedata': ("controller.treeContent"),
    'selection': ("controller.dataSelection")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['tree-selection'] || depth0['tree-selection']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "tree-selection", options))));
  data.buffer.push(" \n            </div>\n        </div>                                                            \n    </div>                                         \n\n    <div class=\"large-7 medium-9 columns\">       \n        <div class=\"inner_box dsdefault\">\n            <!-- Data Selection Preview -->\n            <div class=\"inner_title_box\">\n                <h7>Preview Data Selection</h7> <span class=\"visualize\"><a ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "visualize", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">Visualize</a></span>\n            </div>\n            <div>  \n                ");
  hashContexts = {'preview': depth0,'datasource': depth0};
  hashTypes = {'preview': "ID",'datasource': "ID"};
  options = {hash:{
    'preview': ("controller.dataSelection"),
    'datasource': ("controller.selectedDatasource")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['data-table'] || depth0['data-table']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "data-table", options))));
  data.buffer.push(" \n            </div>          \n        </div>   \n    </div>\n</div>  ");
  return buffer;
  
});

Ember.TEMPLATES["export"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', hashContexts, hashTypes, escapeExpression=this.escapeExpression;


  data.buffer.push("<div class=\"consumption\">\n    <div class=\"consumption-title\">\n        <h7> Export Chart </h7>\n    </div>\n    <div>\n        Export as ");
  hashContexts = {'content': depth0,'value': depth0};
  hashTypes = {'content': "ID",'value': "ID"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {hash:{
    'content': ("controller.exportFormats"),
    'value': ("controller.selectedFormat")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" <a ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "export", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"postfix\"> <i class=\"fi-page-export consumption-icons\"></i></a>                  \n    </div>\n</div>\n   \n");
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
  
  
  data.buffer.push("\n            12. SecurityAndExchangeCommission- Public Company Bankruptcy Cases 2009 (RDF format)\n            ");
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

  data.buffer.push("<div class=\"box\" style=\"height:600px;\">\n    <h6>Examples</h6>\n    <ul>\n        <li>\n            ");
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
  data.buffer.push("\n        </li>\n        <li>\n            ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0,depth0,depth0,depth0,depth0],types:["STRING","STRING","STRING","STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "datasource", "DepartmentOfTheTreasury-Quarterly%20Report%20on%20Bank%20Derivatives%20Activities", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FDepartmentOfTheTreasury-QuarterlyReportonBankDerivativesActivities.nt", "rdf", options) : helperMissing.call(depth0, "link-to", "datasource", "DepartmentOfTheTreasury-Quarterly%20Report%20on%20Bank%20Derivatives%20Activities", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FDepartmentOfTheTreasury-QuarterlyReportonBankDerivativesActivities.nt", "rdf", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n        </li>\n        <li>\n            ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(13, program13, data),contexts:[depth0,depth0,depth0,depth0,depth0],types:["STRING","STRING","STRING","STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "datasource", "DepartmentOfVeteransAffairs-Veterans%20Health%20Administration%202008", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FDepartmentOfVeteransAffairs-VeteransHealthAdministration2008.nt", "rdf", options) : helperMissing.call(depth0, "link-to", "datasource", "DepartmentOfVeteransAffairs-Veterans%20Health%20Administration%202008", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FDepartmentOfVeteransAffairs-VeteransHealthAdministration2008.nt", "rdf", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n        </li>       \n        <li> \n            ");
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
  data.buffer.push("\n        </li>\n        <li>\n            ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(23, program23, data),contexts:[depth0,depth0,depth0,depth0,depth0],types:["STRING","STRING","STRING","STRING","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "datasource", "SecurityAndExchangeCommission-Public%20Company%20Bankruptcy%20Cases%202009", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FSecurityAndExchangeCommission-PublicCompanyBankruptcyCases2009.nt", "rdf", options) : helperMissing.call(depth0, "link-to", "datasource", "SecurityAndExchangeCommission-Public%20Company%20Bankruptcy%20Cases%202009", "http%3A%2F%2Flocalhost%3A8890%2Fsparql", "http%3A%2F%2Fwww.linda-project.org%2Fexamples%2FSecurityAndExchangeCommission-PublicCompanyBankruptcyCases2009.nt", "rdf", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n        </li>\n        <li>\n            ");
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
  data.buffer.push("\n        </li>\n    </ul>\n</div>");
  return buffer;
  
});

Ember.TEMPLATES["loadVisualization"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
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
  
  var hashTypes, hashContexts;
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "visualization.visualizationConfigName", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  }

  data.buffer.push("<div class=\"row box\">\n    <div class=\"large-12 medium-12 columns\">\n        <div class=\"inner_box dsdefault\">\n            <div class=\"inner_title_box\">\n                <h7>Load</h7>\n            </div>\n            <div>\n                ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "visualization", "in", "model", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n            </div>\n        </div>                                                            \n    </div>                                         \n</div>  ");
  return buffer;
  
});

Ember.TEMPLATES["propertiesList"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\n    <li>\n       <div class=\"category\"> ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "category.name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" </div>\n        <ul class=\"categorized-property\">\n            ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "item", "in", "category.items", {hash:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        </ul>\n    </li> \n");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options;
  data.buffer.push("\n                ");
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
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\n                    <div class=\"categorized-property-parents\">\n                    ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "p", "in", "item.parent", {hash:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                    </div>\n                    <div class=\"categorized-property-name\">\n                        ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "view.data.label", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n                    </div>\n                ");
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
  else { data.buffer.push(''); }
  
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


  data.buffer.push("<div class=\"consumption\">\n    <div class=\"consumption-title\">    \n        <h7> Save Settings </h7>\n    </div>\n    <div>\n        ");
  hashContexts = {'value': depth0,'placeholder': depth0,'size': depth0};
  hashTypes = {'value': "ID",'placeholder': "STRING",'size': "STRING"};
  options = {hash:{
    'value': ("controller.configName"),
    'placeholder': ("Enter name."),
    'size': ("15")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push(" <a ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "save", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"postfix\"> <i class=\"fi-save save-visualization  consumption-icons\"></i></a>     \n    </div>\n</div>");
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
    'src': ("visualization.visualizationThumbnail")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(" ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("visualization.valid:valid-suggestion:invalid-suggestion")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(" /> </a></div>\n");
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
  data.buffer.push(" \n        </div>\n        <div class=\"dim-metadata\">\n           Drag ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "type", "in", "view.metadata", {hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("here\n        </div>\n        <div class=\"dim-area-item\">\n            ");
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

  data.buffer.push("<div class=\"col-xs-6 area-box\">\n    ");
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
  var buffer = '', stack1, hashTypes, hashContexts, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  data.buffer.push("<div class=\"row box\">\n    <div class=\"large-5 medium-3 columns\">\n        <!-- Visualization Selection -->\n        <div class=\"row inner_box\">\n            <div class=\"inner_title_box\">\n                <h7>Select Visualization</h7>\n            </div>\n            <div class=\"sliderWrapper\">\n                ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "controller.slideShowContainer", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n            </div>\n        </div>\n\n        <!-- Visualization Configuration - Left: Tree with data source; Right: dimension mapping -->\n        <div class=\"row inner_box\">\n            <div class=\"inner_title_box\">\n                <h7>Configure Visualization</h7>  <span class=\"visualize\"><a ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "select", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">Select Data</a></span>\n            </div>\n            <div class=\"row left-collapse\">\n                <div class=\"large-5 medium-6 columns properties-list-content\">\n                    <div class=\"data_selection_title_box\">\n                        <h7>Selected Data</h7>\n                    </div>\n                    ");
  hashContexts = {'categories': depth0};
  hashTypes = {'categories': "ID"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.PropertiesListView", {hash:{
    'categories': ("controller.categorizedProperties")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n                </div>\n                <div class=\"large-7 medium-6 columns dimensions\">\n                    <div class=\"dimensions_title_box\">\n                        <h7>Visualization Dimensions</h7>\n                    </div>\n                    <div>\n                        ");
  hashContexts = {'options': depth0,'config': depth0};
  hashTypes = {'options': "ID",'config': "ID"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.VisualizationOptionsView", {hash:{
    'options': ("controller.structureOptions"),
    'config': ("controller.visualizationConfiguration")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"large-7 medium-9 columns\">\n        <div class=\"inner_box\">\n            <!-- Visualization -->\n            <div class=\"row inner_box_visualization\">\n                ");
  hashContexts = {'id': depth0,'visualization': depth0,'configurationArray': depth0};
  hashTypes = {'id': "STRING",'visualization': "ID",'configurationArray': "ID"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.DrawVisualizationView", {hash:{
    'id': ("visualization"),
    'visualization': ("controller.drawnVisualization"),
    'configurationArray': ("controller.visualizationConfiguration")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n            </div\n            <!-- Visualization Consumption -->\n            <div class=\"row\">\n                <div class=\"large-4 medium-4 columns\">\n                    ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.partial || depth0.partial),stack1 ? stack1.call(depth0, "export", options) : helperMissing.call(depth0, "partial", "export", options))));
  data.buffer.push("\n                </div>\n                <div class=\"large-4 medium-4 columns\">\n                    ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.partial || depth0.partial),stack1 ? stack1.call(depth0, "save", options) : helperMissing.call(depth0, "partial", "save", options))));
  data.buffer.push("\n                </div>\n                <div class=\"large-4 medium-4 columns\">\n                    ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.partial || depth0.partial),stack1 ? stack1.call(depth0, "publish", options) : helperMissing.call(depth0, "partial", "publish", options))));
  data.buffer.push("\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n");
  return buffer;
  
});