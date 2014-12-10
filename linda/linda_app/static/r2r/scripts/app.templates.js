angular.module('dist').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('partials/csvconfig.html',
    "<div ng-controller=\"CsvConfigCtrl\"> \n" +
    "  <div class=\"row\">\n" +
    "\n" +
    "    <div class=\"col-md-12\">\n" +
    "      CSV File:\n" +
    "    </div>\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <input type=\"file\" ng-file-select=\"onFileSelect($files)\" />\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  \n" +
    "  <br />\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-8\">\n" +
    "      <div class=\"progress\" ng-show=\"progress.submitting\">\n" +
    "        <div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"{{progress.value}}\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: {{progress.value}}%\">\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-4\">\n" +
    "      <div align=\"right\">\n" +
    "        <i class=\"fa fa-spinner fa-spin fa-lg\" ng-show=\"progress.submitting\"></i>\n" +
    "        <i class=\"fa fa-check fa-lg\" ng-show=\"success && submitted\" style=\"color: #449d44\"></i>\n" +
    "        <i class=\"fa fa-times fa-lg\" ng-show=\"!success && submitted\" style=\"color: #c9302c\"></i>\n" +
    "        <button type=\"button\" class=\"btn btn-primary\" ng-click=\"submit()\">Submit</button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('partials/csvcontents.html',
    "<div ng-controller=\"CsvContentsCtrl\">\n" +
    "\n" +
    "  Content of: <b>{{csv.csvFile.name}}</b>\n" +
    "\n" +
    "  <table class=\"table table-scrollable\">\n" +
    "    <tr>\n" +
    "      <th ng-repeat=\"column in csv.getColumns()\">\n" +
    "        <button type=\"button\" \n" +
    "                class=\"btn btn-primary btn-sm table-btn\"\n" +
    "                ng-class=\"{active: csv.isSelectedColumn(table, column)}\"\n" +
    "                ng-click=\"csv.toggleSelectedColumn(table, column)\">\n" +
    "            {{column}}\n" +
    "        </button>\n" +
    "      </th>\n" +
    "    </tr>\n" +
    "\n" +
    "    <tr ng-repeat=\"data in csv.data()\">\n" +
    "      <td ng-repeat=\"i in data\">\n" +
    "        <div ng-class=\"{treated: !csv.isSelectedColumn(table, csv.getColumns()[$index])}\">\n" +
    "          {{i}}\n" +
    "        </div>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "  </table>\n" +
    "  <hr />\n" +
    "</div>\n"
  );


  $templateCache.put('partials/csvpublish.html',
    "<div ng-controller=\"PublishCtrl\">\n" +
    "  <button class=\"btn btn-default\" ng-click=\"dumpcsv()\">Download RDF dump</button>\n" +
    "  <button class=\"btn btn-default\" ng-click=\"mappingcsv()\">Download mapping file</button>\n" +
    "\n" +
    "  <br />\n" +
    "\n" +
    "  <div class=\"btn-group\">\n" +
    "    <button class=\"btn btn-primary dropdown-toggle\" data-toggle=\"dropdown\" aria-expanded=\"false\">\n" +
    "      Publish <span class=\"caret\"></span>\n" +
    "    </button>\n" +
    "    <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "      <li><a href=\"#\" ng-click=\"publish('sparqlify')\">as SPARQL Endpoint</a></li>\n" +
    "      <li><a href=\"#\" ng-click=\"publish('openrdf')\">to OpenRDF</a></li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "\n" +
    "  &nbsp;\n" +
    "  <i class=\"fa fa-spinner fa-spin fa-lg\" ng-show=\"publishing\"></i>\n" +
    "  <i class=\"fa fa-check fa-lg\" ng-show=\"success && published && !publishing\" style=\"color: #449d44\"></i>\n" +
    "  <i class=\"fa fa-times fa-lg\" ng-show=\"!success && published && !publishing\" style=\"color: #c9302c\"></i>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('partials/csvreconcile.html',
    "<div ng-controller=\"CsvReconcileCtrl\">\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <p align=\"left\">\n" +
    "        For file: <b>{{csv.csvFile.name}}</b>\n" +
    "      </p>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <p align=\"right\">\n" +
    "        <i class=\"fa fa-spinner fa-spin\" ng-show=\"loading\"></i>&nbsp;\n" +
    "        <button class=\"btn btn-primary\" ng-click=\"ask(table, columns)\">Ask the Oracle!</button>\n" +
    "      </p>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <table class=\"table table-scrollable\">\n" +
    "    <!-- table and columns -->\n" +
    "    <tr>\n" +
    "      <th><div class=\"btn btn-sm btn-block\">Data subject</div></th>\n" +
    "      <th ng-repeat=\"column in columns\"><div class=\"btn btn-sm btn-block\">Column <a>{{column}}</a></div></th>\n" +
    "    </tr>\n" +
    "\n" +
    "    <!-- tags -->\n" +
    "    <tr>\n" +
    "      <td><input type=\"text\" class=\"table-input\" placeholder=\"{{table}}\" ng-model=\"tableTag[table]\" /></td>\n" +
    "      <td ng-repeat=\"column in columns\"><input type=\"text\" class=\"table-input\" placeholder=\"{{column}}\" ng-model=\"columnTags[column]\"/></td>\n" +
    "    </tr>\n" +
    "\n" +
    "    <!-- suggestions -->\n" +
    "    <tr>\n" +
    "      <td>\n" +
    "        <div class=\"list-group\">\n" +
    "          <a href=\"\" class=\"list-group-item\"\n" +
    "             ng-repeat=\"i in rdf.suggestions[table].table.recommend\" ng-click=\"selectClass(table, i)\" ng-class=\"{active: isSelectedClass(table, i)}\">\n" +
    "            <div rdf-badge\n" +
    "              uri=\"{{i.uri[0]}}\"\n" +
    "              label=\"{{i.label[0]}}\"\n" +
    "              comment=\"{{i.comment[0]}}\"\n" +
    "              definition=\"{{i.definition[0]}}\"\n" +
    "              local=\"{{i.localName[0]}}\"\n" +
    "              prefixed=\"{{i.prefixedName[0]}}\"\n" +
    "              definition=\"{{i.definition[0]}}\"\n" +
    "              vocab-uri=\"{{i['vocabulary.uri'][0]}}\"\n" +
    "              vocab-title=\"{{i['vocabulary.title'][0]}}\"\n" +
    "              vocab-descr=\"{{i['vocabulary.description'][0]}}\"\n" +
    "              score=\"{{i.score | scoreFilter}}\">\n" +
    "            </div>\n" +
    "          </a>\n" +
    "        </div>\n" +
    "      </td>\n" +
    "      <td ng-repeat=\"column in columns\">\n" +
    "        <div class=\"list-group\">\n" +
    "          <a href=\"\" class=\"list-group-item\" \n" +
    "             ng-repeat=\"i in getColumnSuggestions(table, column)\" ng-click=\"selectProperty(table, column, i)\" ng-class=\"{active: isSelectedProperty(table, column, i)}\">\n" +
    "            <div rdf-badge\n" +
    "              uri=\"{{i.uri[0]}}\"\n" +
    "              label=\"{{i.label[0]}}\"\n" +
    "              comment=\"{{i.comment[0]}}\"\n" +
    "              definition=\"{{i.definition[0]}}\"\n" +
    "              local=\"{{i.localName[0]}}\"\n" +
    "              prefixed=\"{{i.prefixedName[0]}}\"\n" +
    "              definition=\"{{i.definition[0]}}\"\n" +
    "              vocab-uri=\"{{i['vocabulary.uri'][0]}}\"\n" +
    "              vocab-title=\"{{i['vocabulary.title'][0]}}\"\n" +
    "              vocab-descr=\"{{i['vocabulary.description'][0]}}\"\n" +
    "              score=\"{{i.score | scoreFilter}}\">\n" +
    "            </div>\n" +
    "          </a>\n" +
    "        </div>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "  </table>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('partials/csvrefine.html',
    "<div ng-controller=\"CsvRefineCtrl\">\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <label for=\"baseUriInput\" class=\"col-md-2 control-label\">Base URI</label>\n" +
    "    <div id=\"baseUriInput\" class=\"col-md-8\">\n" +
    "      <input type=\"text\" ng-model=\"rdf.baseUri\" spellcheck=\"false\" size=\"60\" placeholder=\"http://my.company.com/dataset/\" />\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <hr />\n" +
    " \n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <p align=\"left\">\n" +
    "        For file: <b>{{csv.csvFile.name}}</b>\n" +
    "      </p>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div ng-show=\"table && table != ''\">\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-md-2\">\n" +
    "        Columns:\n" +
    "      </div>\n" +
    "      <div class=\"col-md-10\">\n" +
    "        <button ng-repeat=\"column in columns\" type=\"button\" class=\"btn btn-default btn-sm\" ng-class=\"{active: isSelected(column)}\" ng-click=\"insert(column)\">{{column}}</button>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"col-md-2\">\n" +
    "        Subject URI:\n" +
    "      </div>\n" +
    "      <div class=\"col-md-10\">\n" +
    "        <textarea rows=\"1\" cols=\"60\" content=\"rdf.subjectTemplate\" cursor cursorpos=\"cursorpos\" ng-model=\"rdf.subjectTemplate\"></textarea>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"row\" ng-repeat=\"class in rdf.selectedClasses[table]\">\n" +
    "      <div class=\"col-md-1\">\n" +
    "        <div align=\"right\"><i class=\"fa fa-arrow-right\"></i></div>\n" +
    "      </div>\n" +
    "      <div class=\"col-md-3\" align=\"right\">\n" +
    "        <b><em>a</em></b>\n" +
    "      </div>\n" +
    "      <div class=\"col-md-4\">\n" +
    "        <b>{{class.prefixedName[0]}}</b>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"row\" ng-repeat=\"prop in rdf.selectedProperties[table]\">\n" +
    "      <div class=\"col-md-1\">\n" +
    "        <div align=\"right\"><i class=\"fa fa-arrow-right\"></i></div>\n" +
    "      </div>\n" +
    "      <div class=\"col-md-3\" align=\"right\">\n" +
    "        <b><em>{{prop.prefixedName[0]}}</em></b>\n" +
    "      </div>\n" +
    "      <div class=\"col-md-4\">\n" +
    "        <select class=\"form-control\" ng-model=\"rdf.propertyLiteralSelection[prop.prefixedName[0]]\" ng-options=\"selection for selection in propertyLiteralTypeOptions\" />\n" +
    "      </div>\n" +
    "      <div class=\"col-md-4\">\n" +
    "        <select class=\"form-control\" ng-model=\"rdf.propertyLiteralTypes[prop.prefixedName[0]]\" ng-options=\"type for type in propertyLiteralTypes\" ng-show=\"rdf.propertyLiteralSelection[prop.prefixedName[0]] == 'Typed Literal'\"></input>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('partials/csvtrans.html',
    "<div class=\"main container\" style=\"min-height:128em\">\n" +
    "\n" +
    "  <div class=\"header\">\n" +
    "    <ul class=\"nav nav-pills pull-right\">\n" +
    "      <li class=\"active\"><a ng-href=\"#\">Home</a></li>\n" +
    "      <li><a ng-href=\"#\">About</a></li>\n" +
    "      <li><a ng-href=\"#\">Contact</a></li>\n" +
    "    </ul>\n" +
    "    <h3 class=\"text-muted\">R2R Mapping Designer</h3>\n" +
    "  </div>\n" +
    " \n" +
    "  <wizard>\n" +
    "    <step name=\"1. welcome\"\n" +
    "      heading=\"Welcome\"\n" +
    "      description=\"\" \n" +
    "      sidetip=\"sidetip\">\n" +
    "\n" +
    "      <br />\n" +
    "    </step>\n" +
    "\n" +
    "    <step name=\"2. datasource config\"\n" +
    "      heading=\"Data Source Configuration\"\n" +
    "      description=\"\"\n" +
    "      sidetip=\"sidetip\">\n" +
    "\n" +
    "      <br />\n" +
    "      <div ng-include src=\"'/static/r2r/partials/csvconfig.html'\"></div>\n" +
    "    </step>\n" +
    "\n" +
    "    <step name=\"3. contents of CSV file\"\n" +
    "      heading=\"Select Columns\"\n" +
    "      description=\"\"\n" +
    "      sidetip=\"sidetip\">\n" +
    "\n" +
    "      <br />\n" +
    "      <div ng-include src=\"'/static/r2r/partials/csvcontents.html'\"></div>\n" +
    "    </step>\n" +
    "\n" +
    "    <step name=\"4. transforming\"\n" +
    "      heading=\"Translate CSV file content\"\n" +
    "      description=\"\"\n" +
    "      sidetip=\"sidetip\">\n" +
    "\n" +
    "      <br />\n" +
    "      <div ng-include src=\"'/static/r2r/partials/csvreconcile.html'\"></div>\n" +
    "    </step>\n" +
    "\n" +
    "    <step name=\"5. revising\"\n" +
    "      heading=\"Revise Output RDF\"\n" +
    "      description=\"<p>These URIs need to be globally unique, so\n" +
    "<ul><li>the web address the URIs point to should be a site that you control</li>\n" +
    "<li>the URIs should comprise (at least) the content of those column(s) that constitute the Primary Key of the table</li></p><p>Beyond global uniqueness, you should strive for long term stability of the generated URIs, since they may be referred to by others.</p>\n" +
    "\"\n" +
    "      sidetip=\"sidetip\">\n" +
    "\n" +
    "      <p>In this step, you specify the URIs that will be generated for each row of every selected table. Typically, they are made up of your web address and the content of the column(s) that constitute the Primary Key, intervened by fixed separators.</p>\n" +
    "\n" +
    "      <br />\n" +
    "      <div ng-include src=\"'/static/r2r/partials/csvrefine.html'\"></div>\n" +
    "    </step>\n" +
    "\n" +
    "    <step name=\"6. publishing\"\n" +
    "      heading=\"Publish\"\n" +
    "      description=\"<p>A SPARQL endpoint is a service that processes queries against a RDF triple store. Here, the triple store is hypothetical, the queries are translated to SQL, your database is queried, and the results are translated according to your mapping specification.</p>\"\n" +
    "      sidetip=\"sidetip\">\n" +
    "\n" +
    "      <p>In this step, you choose whether you dump the current state of the database to an RDF triple store, or establish a SPARQL endpoint that performs the specified transformations dynamically on request.</p>\n" +
    "      <p>In either case, you will have to provide the respective technical information, such as file paths and the like.</p>\n" +
    "\n" +
    "      <br />\n" +
    "      <div ng-include src=\"'/static/r2r/partials/csvpublish.html'\"></div>\n" +
    "    </step>\n" +
    "\n" +
    "    <step name=\"7. finished\"\n" +
    "      heading=\"Finished\"\n" +
    "      description=\"\"\n" +
    "      sidetip=\"sidetip\">\n" +
    "\n" +
    "      <p>You are finished with this process!</p>\n" +
    "      <p>Now you can go back to the LinDA Workbench and proceed to <a href=\"/visualizations\">visualize</a> or to <a href=\"/analytics\">analyze</a> the output RDF dataset.</p>\n" +
    "\n" +
    "      <br />\n" +
    "    </step>\n" +
    "  </wizard>\n" +
    "\n" +
    "  <p align=\"center\" style=\"font-size: 20px;margin-top: 10em\">❦</p>\n" +
    "</div>\n"
  );


  $templateCache.put('partials/rdbconfig.html',
    "<div ng-controller=\"ConfigCtrl\"> \n" +
    "  <form class=\"form-horizontal\" role=\"form\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <label for=\"hostInput\" class=\"col-md-4 control-label\">Host</label>\n" +
    "      <div id=\"hostInput\" class=\"col-md-8\">\n" +
    "        <input type=\"text\" class=\"form-control\" ng-model=\"rdb.datasource.host\" spellcheck=\"false\" />\n" +
    "      </div>\n" +
    "\n" +
    "      <label for=\"driverInput\" class=\"col-md-4 control-label\">Driver</label>\n" +
    "      <div id=\"driverInput\" class=\"col-md-8\">\n" +
    "        <input type=\"text\" class=\"form-control\" ng-model=\"rdb.datasource.driver\" spellcheck=\"false\" />\n" +
    "      </div>\n" +
    "\n" +
    "      <label for=\"nameInput\" class=\"col-md-4 control-label\">Datasource Name</label>\n" +
    "      <div id=\"nameInput\" class=\"col-md-8\">\n" +
    "        <input type=\"text\" class=\"form-control\" ng-model=\"rdb.datasource.name\" spellcheck=\"false\" />\n" +
    "      </div>\n" +
    "\n" +
    "      <label for=\"userInput\" class=\"col-md-4 control-label\">Username</label>\n" +
    "      <div id=\"userInput\" class=\"col-md-8\">\n" +
    "        <input type=\"text\" class=\"form-control\" ng-model=\"rdb.datasource.username\" spellcheck=\"false\" />\n" +
    "      </div>\n" +
    "\n" +
    "      <label for=\"passwordInput\" class=\"col-md-4 control-label\">Password</label>\n" +
    "      <div id=\"passwordInput\" class=\"col-md-8\">\n" +
    "        <input type=\"password\" class=\"form-control\" ng-model=\"rdb.datasource.password\" />\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div align=\"right\">\n" +
    "      <i class=\"fa fa-spinner fa-spin fa-lg\" ng-show=\"checking\"></i>\n" +
    "      <i class=\"fa fa-check fa-lg\" ng-show=\"success && checked && !checking\" style=\"color: #449d44\"></i>\n" +
    "      <i class=\"fa fa-times fa-lg\" ng-show=\"!success && checked && !checking\" style=\"color: #c9302c\"></i>\n" +
    "      &nbsp;\n" +
    "      <button type=\"button\" class=\"btn btn-default\" ng-click=\"test()\">Test</button>\n" +
    "      <button type=\"button\" class=\"btn btn-primary\" ng-click=\"apply()\">Apply</button>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "</div>\n"
  );


  $templateCache.put('partials/rdbcontents.html',
    "<div ng-controller=\"DbContentsCtrl\">\n" +
    "\n" +
    "  <table class=\"table table-scrollable\">\n" +
    "    <tr ng-repeat=\"table in rdb.tables()\">\n" +
    "      <th class=\"btn-th\">\n" +
    "        <button type=\"button\" \n" +
    "                class=\"btn btn-primary btn-sm table-btn\" \n" +
    "                ng-class=\"{active: rdb.isSelectedTable(table)}\"\n" +
    "                ng-click=\"rdb.toggleSelectTable(table)\"> \n" +
    "          {{table}}\n" +
    "        </button>\n" +
    "      </th>\n" +
    "\n" +
    "      <td>\n" +
    "        <button ng-repeat=\"column in rdb.tableColumns()[table]\" \n" +
    "                type=\"button\" \n" +
    "                class=\"btn btn-default btn-sm table-btn\"\n" +
    "                ng-class=\"{disabled: !rdb.isSelectedTable(table), active: rdb.isSelectedColumn(table, column)}\"\n" +
    "                ng-click=\"rdb.toggleSelectColumn(table, column)\"\n" +
    "                columntip table=\"{{table}}\" column=\"{{column}}\"> \n" +
    "            {{column}}\n" +
    "        </button>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "  </table>\n" +
    "</div>\n"
  );


  $templateCache.put('partials/rdbpublish.html',
    "<div ng-controller=\"PublishCtrl\">\n" +
    "  <button class=\"btn btn-default\" ng-click=\"dumpdb()\">Download RDF dump</button>\n" +
    "  <button class=\"btn btn-default\" ng-click=\"mappingdb()\">Download mapping file</button>\n" +
    "\n" +
    "  <br />\n" +
    "\n" +
    "  <div class=\"btn-group\">\n" +
    "    <button class=\"btn btn-primary dropdown-toggle\" data-toggle=\"dropdown\" aria-expanded=\"false\">\n" +
    "      Publish <span class=\"caret\"></span>\n" +
    "    </button>\n" +
    "    <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "      <li><a href=\"#\" ng-click=\"publish('sparqlify')\">as SPARQL Endpoint</a></li>\n" +
    "      <li><a href=\"#\" ng-click=\"publish('openrdf')\">to OpenRDF</a></li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "\n" +
    "  &nbsp;\n" +
    "  <i class=\"fa fa-spinner fa-spin fa-lg\" ng-show=\"publishing\"></i>\n" +
    "  <i class=\"fa fa-check fa-lg\" ng-show=\"success && published && !publishing\" style=\"color: #449d44\"></i>\n" +
    "  <i class=\"fa fa-times fa-lg\" ng-show=\"!success && published && !publishing\" style=\"color: #c9302c\"></i>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('partials/rdbreconcile.html',
    "<div ng-controller=\"ReconcileCtrl\">\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-4\">\n" +
    "      <p align=\"left\">\n" +
    "        <select class=\"form-control\" ng-model=\"table\" ng-options=\"table for table in rdb.selectedTables()\">\n" +
    "        </select>\n" +
    "      </p>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-8\">\n" +
    "      <p align=\"right\">\n" +
    "        <i class=\"fa fa-spinner fa-spin\" ng-show=\"loading\"></i>&nbsp;\n" +
    "        <button class=\"btn btn-primary\" ng-click=\"ask(table, columns)\" ng-class=\"{disabled: table == ''}\">Ask the Oracle!</button>\n" +
    "      </p>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <table class=\"table table-scrollable\" ng-show=\"table && table != ''\">\n" +
    "    <!-- table and columns -->\n" +
    "    <tr>\n" +
    "      <th><div class=\"btn btn-sm btn-block\">Table <a>{{table}}</a></div></th>\n" +
    "      <th ng-repeat=\"column in columns\"><div class=\"btn btn-sm btn-block\">Column <a>{{column}}</a></div></th>\n" +
    "    </tr>\n" +
    "\n" +
    "    <!-- tags -->\n" +
    "    <tr>\n" +
    "      <td><input type=\"text\" class=\"table-input\" placeholder=\"{{table}}\" ng-model=\"tableTag[table]\" /></td>\n" +
    "      <td ng-repeat=\"column in columns\"><input type=\"text\" class=\"table-input\" placeholder=\"{{column}}\" ng-model=\"columnTags[column]\"/></td>\n" +
    "    </tr>\n" +
    "\n" +
    "    <!-- suggestions -->\n" +
    "    <tr>\n" +
    "      <td>\n" +
    "        <div class=\"list-group\">\n" +
    "          <a href=\"\" class=\"list-group-item\"\n" +
    "             ng-repeat=\"i in rdf.suggestions[table].table.recommend\" ng-click=\"selectClass(table, i)\" ng-class=\"{active: isSelectedClass(table, i)}\">\n" +
    "            <div rdf-badge\n" +
    "              uri=\"{{i.uri[0]}}\"\n" +
    "              label=\"{{i.label[0]}}\"\n" +
    "              comment=\"{{i.comment[0]}}\"\n" +
    "              definition=\"{{i.definition[0]}}\"\n" +
    "              local=\"{{i.localName[0]}}\"\n" +
    "              prefixed=\"{{i.prefixedName[0]}}\"\n" +
    "              definition=\"{{i.definition[0]}}\"\n" +
    "              vocab-uri=\"{{i['vocabulary.uri'][0]}}\"\n" +
    "              vocab-title=\"{{i['vocabulary.title'][0]}}\"\n" +
    "              vocab-descr=\"{{i['vocabulary.description'][0]}}\"\n" +
    "              score=\"{{i.score | scoreFilter}}\">\n" +
    "            </div>\n" +
    "          </a>\n" +
    "        </div>\n" +
    "      </td>\n" +
    "      <td ng-repeat=\"column in columns\">\n" +
    "        <div class=\"list-group\">\n" +
    "          <a href=\"\" class=\"list-group-item\" \n" +
    "             ng-repeat=\"i in getColumnSuggestions(table, column)\" ng-click=\"selectProperty(table, column, i)\" ng-class=\"{active: isSelectedProperty(table, column, i)}\">\n" +
    "            <div rdf-badge\n" +
    "              uri=\"{{i.uri[0]}}\"\n" +
    "              label=\"{{i.label[0]}}\"\n" +
    "              comment=\"{{i.comment[0]}}\"\n" +
    "              definition=\"{{i.definition[0]}}\"\n" +
    "              local=\"{{i.localName[0]}}\"\n" +
    "              prefixed=\"{{i.prefixedName[0]}}\"\n" +
    "              definition=\"{{i.definition[0]}}\"\n" +
    "              vocab-uri=\"{{i['vocabulary.uri'][0]}}\"\n" +
    "              vocab-title=\"{{i['vocabulary.title'][0]}}\"\n" +
    "              vocab-descr=\"{{i['vocabulary.description'][0]}}\"\n" +
    "              score=\"{{i.score | scoreFilter}}\">\n" +
    "            </div>\n" +
    "          </a>\n" +
    "        </div>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "  </table>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('partials/rdbrefine.html',
    "<div ng-controller=\"RdbRefineCtrl\">\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <label for=\"baseUriInput\" class=\"col-md-2 control-label\">Base URI</label>\n" +
    "    <div id=\"baseUriInput\" class=\"col-md-8\">\n" +
    "      <input type=\"text\" ng-model=\"rdf.baseUri\" spellcheck=\"false\" size=\"60\" placeholder=\"http://my.company.com/dataset/\" />\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <hr />\n" +
    " \n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-4\">\n" +
    "      <p align=\"left\">\n" +
    "        <select class=\"form-control\" ng-model=\"table\" ng-options=\"table for table in rdb.selectedTables()\">\n" +
    "          <option>--</option>\n" +
    "        </select>\n" +
    "      </p>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div ng-show=\"table && table != ''\">\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-md-2\">\n" +
    "        Columns:\n" +
    "      </div>\n" +
    "      <div class=\"col-md-10\">\n" +
    "        <button ng-repeat=\"column in columns\" type=\"button\" class=\"btn btn-default btn-sm\" ng-class=\"{active: isSelected(column)}\" ng-click=\"insert(column)\">{{column}}</button>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"col-md-2\">\n" +
    "        Subject URI:\n" +
    "      </div>\n" +
    "      <div class=\"col-md-10\">\n" +
    "        <textarea rows=\"1\" cols=\"60\" content=\"rdf.subjectTemplate\" cursor cursorpos=\"cursorpos\" ng-model=\"rdf.subjectTemplate\"></textarea>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"row\" ng-repeat=\"class in rdf.selectedClasses[table]\">\n" +
    "      <div class=\"col-md-1\">\n" +
    "        <div align=\"right\"><i class=\"fa fa-arrow-right\"></i></div>\n" +
    "      </div>\n" +
    "      <div class=\"col-md-3\" align=\"right\">\n" +
    "        <b><em>a</em></b>\n" +
    "      </div>\n" +
    "      <div class=\"col-md-4\">\n" +
    "        <b>{{class.prefixedName[0]}}</b>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"row\" ng-repeat=\"prop in rdf.selectedProperties[table]\">\n" +
    "      <div class=\"col-md-1\">\n" +
    "        <div align=\"right\"><i class=\"fa fa-arrow-right\"></i></div>\n" +
    "      </div>\n" +
    "      <div class=\"col-md-3\" align=\"right\">\n" +
    "        <b><em>{{prop.prefixedName[0]}}</em></b>\n" +
    "      </div>\n" +
    "      <div class=\"col-md-4\">\n" +
    "        <select class=\"form-control\" ng-model=\"rdf.propertyLiteralSelection[prop.prefixedName[0]]\" ng-options=\"selection for selection in propertyLiteralTypeOptions\" />\n" +
    "      </div>\n" +
    "      <div class=\"col-md-4\">\n" +
    "        <select class=\"form-control\" ng-model=\"rdf.propertyLiteralTypes[prop.prefixedName[0]]\" ng-options=\"type for type in propertyLiteralTypes\" ng-show=\"rdf.propertyLiteralSelection[prop.prefixedName[0]] == 'Typed Literal'\"></input>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('partials/rdbtrans.html',
    "<div class=\"main container\" style=\"margin-bottom:32em\">\n" +
    "\n" +
    "  <div class=\"header\">\n" +
    "    <ul class=\"nav nav-pills pull-right\">\n" +
    "      <li class=\"active\"><a ng-href=\"#\">Home</a></li>\n" +
    "      <li><a ng-href=\"#\">About</a></li>\n" +
    "      <li><a ng-href=\"#\">Contact</a></li>\n" +
    "    </ul>\n" +
    "    <h3 class=\"text-muted\">R2R Mapping Designer</h3>\n" +
    "  </div>\n" +
    " \n" +
    "  <wizard>\n" +
    "    <step name=\"1. welcome\"\n" +
    "      heading=\"Welcome\"\n" +
    "      description=\"<p>The alternative to Direct Mapping would be semantic mappings, which re-express the information to be transformed in appropriate ontology frameworks.</p><p>The information you will need to proceed through this wizard is essentially:\n" +
    "    <ul>\n" +
    "    <li>your database address and credentials</li>\n" +
    "    <li>server address and access credentials where the SPARQL endpoint is to be launched</li>\n" +
    "    <li>patterns for the URIs you want to generate, and certain metadata you want to add</li>\n" +
    "    </ul></p>\" \n" +
    "      sidetip=\"sidetip\">\n" +
    "\n" +
    "      <p>This wizard will guide you through the transformation of your relational database to RDF, and then either through the dump of the result into an RDF triple store, \n" +
    "        or through the publication of the result as a SPARQL endpoint.</p>\n" +
    "      <p>The transformation of your relational data is essentially limited to what is called \"Direct Mapping\", i.e., the structure of the database will be preserved in the result. \n" +
    "        However, the generated URIs will be configurable, and certain metadata can be added.</p>\n" +
    "      <p>Please have your database address and credentials handy, and possibly also the access to the server where the SPARQL endpoint is to be launched.</p>\n" +
    "\n" +
    "      <br />\n" +
    "    </step>\n" +
    "\n" +
    "    <step name=\"2. datasource config\"\n" +
    "      heading=\"Data Source Configuration\"\n" +
    "      description=\"<p><em>Data Source Name</em> is the name of the database</p>\n" +
    "    <p><em>Protocol</em> is usually named after the type/brand name of the database</p>\n" +
    "    <p><em>Username/Password</em> are your access credentials</p>\"\n" +
    "      sidetip=\"sidetip\">\n" +
    "\n" +
    "      <p>In this step, you configure the access data and credentials for your database.</p>\n" +
    "      <p>If a SPARQL endpoint is to be set up, your access data credentials will be stored in its configuration and be used throughout its lifetime.</p>\n" +
    "\n" +
    "      <br />\n" +
    "      <div ng-include src=\"'/static/r2r/partials/rdbconfig.html'\"></div>\n" +
    "    </step>\n" +
    "\n" +
    "    <step name=\"3. database contents\"\n" +
    "      heading=\"Select Database Content\"\n" +
    "      description=\"\n" +
    "      <p>Deselecting a table also deselects all its columns, although they remain visually highlighted in case of a subsequent reactivation.</p>\"\n" +
    "      sidetip=\"sidetip\">\n" +
    "\n" +
    "      <p>In this step, you select which tables and which columns are to be taken into account in the transformation. \n" +
    "        Whenever a selected column is a Foreign Key, the referenced table and its Primary Key column(s) should also be selected.</p>\n" +
    "\n" +
    "      <br />\n" +
    "      <div ng-include src=\"'/static/r2r/partials/rdbcontents.html'\"></div>\n" +
    "    </step>\n" +
    "\n" +
    "    <step name=\"4. transforming\"\n" +
    "      heading=\"Translate Database Content\"\n" +
    "      description=\"<p>These specifications constitute the central part of the transformation. Types and properties should be selected with care, so as to get best possible precision of the transformation.</p><p>The <em>oracle<em> is a web service that gets the table names and column headers in question, matches them against its database of vocabularies, and returns ranked results.</p>\n" +
    "\"\n" +
    "      sidetip=\"sidetip\">\n" +
    "\n" +
    "      <p>In this step, you specify the translations of table names to types, and of column headers to properties. You first select a table, ask the oracle, and then select from its ranked answers.</p>\n" +
    "      <p>You will have to go through all those tables and columns that were selected for transformation in the previous step (“Database Contents”).</p>\n" +
    "\n" +
    "      <br />\n" +
    "      <div ng-include src=\"'/static/r2r/partials/rdbreconcile.html'\"></div>\n" +
    "    </step>\n" +
    "\n" +
    "    <step name=\"5. revising\"\n" +
    "      heading=\"Revise Output RDF\"\n" +
    "      description=\"<p>These URIs need to be globally unique, so\n" +
    "<ul><li>the web address the URIs point to should be a site that you control</li>\n" +
    "<li>the URIs should comprise (at least) the content of those column(s) that constitute the Primary Key of the table</li></p><p>Beyond global uniqueness, you should strive for long term stability of the generated URIs, since they may be referred to by others.</p>\n" +
    "\"\n" +
    "      sidetip=\"sidetip\">\n" +
    "\n" +
    "      <p>In this step, you specify the URIs that will be generated for each row of every selected table. Typically, they are made up of your web address and the content of the column(s) that constitute the Primary Key, intervened by fixed separators.</p>\n" +
    "\n" +
    "      <br />\n" +
    "      <div ng-include src=\"'/static/r2r/partials/rdbrefine.html'\"></div>\n" +
    "    </step>\n" +
    "\n" +
    "    <step name=\"6. publishing\"\n" +
    "      heading=\"Publish\"\n" +
    "      description=\"<p>A SPARQL endpoint is a service that processes queries against a RDF triple store. Here, the triple store is hypothetical, the queries are translated to SQL, your database is queried, and the results are translated according to your mapping specification.</p>\"\n" +
    "      sidetip=\"sidetip\">\n" +
    "\n" +
    "      <p>In this step, you choose whether you dump the current state of the database to an RDF triple store, or establish a SPARQL endpoint that performs the specified transformations dynamically on request.</p>\n" +
    "      <p>In either case, you will have to provide the respective technical information, such as file paths and the like.</p>\n" +
    "\n" +
    "      <br />\n" +
    "      <div ng-include src=\"'static/r2r/partials/rdbpublish.html'\"></div>\n" +
    "    </step>\n" +
    "\n" +
    "    <step name=\"7. finished\"\n" +
    "      heading=\"Finished\"\n" +
    "      description=\"\"\n" +
    "      sidetip=\"sidetip\">\n" +
    "\n" +
    "      <p>You are finished with this process!</p>\n" +
    "      <p>Now you can go back to the LinDA Workbench and proceed to <a href=\"/visualizations\">visualize</a> or to <a href=\"/analytics\">analyze</a> the output RDF dataset.</p>\n" +
    "\n" +
    "      <br />\n" +
    "    </step>\n" +
    "  </wizard>\n" +
    "\n" +
    "  <p align=\"center\" style=\"font-size: 20px;margin-top: 10em\">❦</p>\n" +
    "</div>\n"
  );


  $templateCache.put('partials/rdfbadge.html',
    "<div>\n" +
    "  {{prefixed}}\n" +
    "  <span class=\"score\">(score:&nbsp;{{score}})</span>\n" +
    "</div>\n"
  );


  $templateCache.put('partials/step.html',
    "<section id=\"{{name}}\">\n" +
    "  <div ng-class=\"{treated: !isSelected() && isTreated()}\" ng-show=\"isSelected() || isTreated()\">\n" +
    "    <div class=\"row\">\n" +
    "      <h3>{{heading}}</h3>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "      <div>\n" +
    "        <fieldset ng-disabled=\"!isSelected()\">\n" +
    "          <p><div ng-transclude /></p>\n" +
    "        </fieldset>\n" +
    "      </div>\n" +
    "\n" +
    "      <div ng-show=\"isSelected()\" style=\"margin-top:2em\">\n" +
    "        <a href prev ng-show=\"!isFirst()\">&lt;&lt; Previous&nbsp;</a>\n" +
    "        <a href next ng-show=\"!isLast()\">Next &gt;&gt;</a>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- <hr /> -->\n" +
    "    <p style=\"margin-bottom:5em\"><p>\n" +
    "  </div>\n" +
    "</section>\n"
  );


  $templateCache.put('partials/wizard.html',
    "<div class=\"wizard\"> \n" +
    "  <div class=\"row\">\n" +
    "\n" +
    "    <div class=\"col-md-2\">\n" +
    "      <div class=\"navigation\">\n" +
    "        <ul class=\"nav nav-list\">\n" +
    "          <li ng-class=\"{disabled: !(step.selected || step.treated), active: step.selected}\" ng-repeat=\"step in steps\"><a href goto=\"{{step.name}}\">{{step.name}}</a></li>\n" +
    "        </ul>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-8\">\n" +
    "      <div class=\"steps\" ng-transclude></div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-2\">\n" +
    "      <div style=\"position:fixed;margin-top:2em;margin-left:2em;margin-right:2em\">\n" +
    "        <div ng-bind-html=\"sidetip.tooltip\"></div>\n" +
    "        <hr />\n" +
    "        <div ng-bind-html=\"sidetip.tmpl\"></div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "  </div>\n" +
    "</div>\n"
  );

}]);
