(function() {
  'use strict';

  /**
    * @ngdoc function
    * @name app.controller:RdbCtrl
    * @description
    * # RdbCtrl
    * Controller of the r2rDesignerApp
   */
  angular.module('r2rDesignerApp').controller('RdbCtrl', function($scope) {
    $scope.template = function(i) {
      return $scope.steps[i].partial;
    };
    return $scope.steps = [
      {
        name: '1. welcome',
        heading: 'Welcome',
        description: "<p>The alternative to Direct Mapping would be semantic mappings, which re-express the information to be transformed in appropriate ontology frameworks.</p>\n<p>The information you will need to proceed through this wizard is essentially:</p> \n<sl> \n  <li>your database address and credentials</li> \n  <li>server address and access credentials where the SPARQL endpoint is to be launched</li> \n  <li>patterns for the URIs you want to generate, and certain metadata you want to add</li> \n</sl>",
        content: "<p>This wizard will guide you through the transformation of your relational database to RDF, and then either through the dump of the result into an RDF triple store, \n  or through the publication of the result as a SPARQL endpoint.</p>\n<p>The transformation of your relational data is essentially limited to what is called \"Direct Mapping\", i.e., the structure of the database will be preserved in the result. \n  However, the generated URIs will be configurable, and certain metadata can be added.</p>\n<p>Please have your database address and credentials handy, and possibly also the access to the server where the SPARQL endpoint is to be launched.</p>",
        partial: ''
      }, {
        name: '2. datasource config',
        heading: 'Data Source Configuration',
        description: "<p><em>Data Source Name</em> is the name of the database</p>\n<p><em>Protocol</em> is usually named after the type/brand name of the database</p><p><em>Username/Password</em> are your access credentials</p>",
        content: "<p>In this step, you configure the access data and credentials for your database.</p>\n<p>If a SPARQL endpoint is to be set up, your access data credentials will be stored in its configuration and be used throughout its lifetime.</p>",
        partial: 'partials/rdb/config.html'
      }, {
        name: '3. database contents',
        heading: 'Select Database Content',
        description: "<p>Deselecting a table also deselects all its columns, although they remain visually highlighted in case of a subsequent reactivation.</p>",
        content: "<p>In this step, you select which tables and which columns are to be taken into account in the transformation. \n   Whenever a selected column is a Foreign Key, the referenced table and its Primary Key column(s) should also be selected.</p>",
        partial: 'partials/rdb/contents.html'
      }, {
        name: '4. transforming',
        heading: 'Translate Database Content',
        description: "<p>These specifications constitute the central part of the transformation. Types and properties should be selected with care, so as to get best possible precision of the transformation.</p>\n<p>The <em>oracle<em> is a web service that gets the table names and column headers in question, matches them against its database of vocabularies, and returns ranked results.</p>",
        content: "<p>In this step, you specify the translations of table names to types, and of column headers to properties. You first select a table, ask the oracle, and then select from its ranked answers.</p>\n<p>You will have to go through all those tables and columns that were selected for transformation in the previous step (“Database Contents”).</p>",
        partial: 'partials/rdb/transform.html'
      }, {
        name: '5. revising',
        heading: 'Revise Output RDF',
        description: "<p>These URIs need to be globally unique, so</p>\n<sl>\n  <li>the web address the URIs point to should be a site that you control</li>\n  <li>the URIs should comprise (at least) the content of those column(s) that constitute the Primary Key of the table</li>\n</sl>\n<p>Beyond global uniqueness, you should strive for long term stability of the generated URIs, since they may be referred to by others.</p>",
        content: "<p>In this step, you specify the URIs that will be generated for each row of every selected table. Typically, they are made up of your web address and the content of the column(s) that constitute the Primary Key, intervened by fixed separators.</p>",
        partial: 'partials/rdb/revise.html'
      }, {
        name: '6. publishing',
        heading: 'Publish',
        description: "<p>A SPARQL endpoint is a service that processes queries against a RDF triple store. Here, the triple store is hypothetical, the queries are translated to SQL, your database is queried, and the results are translated according to your mapping specification.</p>",
        content: "<p>In this step, you choose whether you dump the current state of the database to an RDF triple store, or establish a SPARQL endpoint that performs the specified transformations dynamically on request.</p>\n<p>In either case, you will have to provide the respective technical information, such as file paths and the like.</p>",
        partial: 'partials/rdb/publish.html'
      }, {
        name: '7. finished',
        heading: 'Finished',
        description: "",
        content: "<p>You are finished with this process!</p>\n<p>Now you can go back to the LinDA Workbench and proceed to <a href=\"/visualizations\">visualize</a> or to <a href=\"/analytics\">analyze</a> the output RDF dataset.</p>",
        partial: ''
      }
    ];
  });

}).call(this);

//# sourceMappingURL=rdb.js.map
