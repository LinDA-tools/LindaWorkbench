(function() {
  'use strict';

  /**
    * @ngdoc function
    * @name app.controller:CsvCtrl
    * @description
    * # CsvCtrl
    * Controller of the r2rDesignerApp
   */
  angular.module('r2rDesignerApp').controller('CsvCtrl', function($scope) {
    $scope.template = function(i) {
      return $scope.steps[i].partial;
    };
    return $scope.steps = [
      {
        name: '1. welcome',
        heading: 'Welcome',
        description: '',
        content: "<p>This wizard will guide you through the transformation of your CSV file to RDF, up to the dump of the result into an RDF triple store.</p>\n<p>The transformation of your CSV data follows and preserves its tabular structure. However, the column properties will be configurable, and you will have to provide the pattern for the generated URIs.</p>",
        partial: ''
      }, {
        name: '2. datasource config',
        heading: 'Data Source Configuration',
        description: '',
        content: "<p>In this step, you select and upload your CSV file that is to be converted.</p>\n<sl>\n  <li>Click the file selection button, and select the file in the pop up dialog,</li>\n  <li>click “submit”; this will upload the file (may take a few moments),</li>\n  <li>click “next” to move on to the next step.</li>\n</sl>",
        partial: 'partials/csv/config.html'
      }, {
        name: '3. contents of CSV file',
        heading: 'Select Columns',
        description: '<p>Current restriction: The column separator character has indeed to be a comma; semicolons or other characters are not processed (yet).</p>',
        content: "<p>It is assumed that the first line of the file contains columns headers.</p>\n<p>The screen shows the column headers and the content of the first few rows. Unselected columns are greyed out. Clicking on the column header buttons toggles the selection state of the respective column.</p>\n<p>When the columns selection is finished, click “next”.</p>",
        partial: 'partials/csv/contents.html'
      }, {
        name: '4. transforming',
        heading: 'Translate CSV file content',
        description: '<p>These specifications constitute the central part of the transformation. Types and properties should be selected with care, so as to get best possible precision of the transformation.</p><p>The <em>oracle</em> is a web service that gets the column headers in question, matches them against its database of vocabularies, and returns ranked results.</p>',
        content: "<p>In this step, you specify the RDF properties that will be used for the translation of the selected columns.</p>\n<sl>\n  <li>Click “ask the oracle”; this will submit the column headers to a remote server, and the response will consist in ranked proposals for the column properties.</li>\n  <li>For every (selected) column, choose one of the proposed properties, or enter another one into the textbox at the top of the column.</li>\n</sl>\n<p>You will have to go through all columns that were selected for transformation in the previous step (“Columns”).</p>",
        partial: 'partials/csv/transform.html'
      }, {
        name: '5. revising',
        heading: 'Revise Output RDF',
        description: "<p>These URIs need to be globally unique, so</p>\n<sl>\n  <li>the web address the URIs point to should be a site that you control</li>\n  <li>the URIs should comprise (at least) the content of those column(s) that constitute the Primary Key of the table</li>\n</sl>\n<p>Beyond global uniqueness, you should strive for long term stability of the generated URIs, since they may be referred to by others.</p>",
        content: "<p>In this step, you specify the URIs that will be generated for each row of every selected table. Typically, they are made up of your web address and the content of the column(s) that constitute the Primary Key, intervened by fixed separators.</p>",
        partial: 'partials/csv/revise.html'
      }, {
        name: '6. publishing',
        heading: 'Publish',
        description: '<p>A SPARQL endpoint is a service that processes queries against a RDF triple store. Here, the triple store is hypothetical, the queries are translated to SQL, your database is queried, and the results are translated according to your mapping specification.</p>',
        content: "<p>In this step, you choose whether you dump the current state of the database to an RDF triple store, or establish a SPARQL endpoint that performs the specified transformations dynamically on request.</p>\n<p>In either case, you will have to provide the respective technical information, such as file paths and the like.</p>",
        partial: 'partials/csv/publish.html'
      }, {
        name: '7. finished',
        heading: 'Finished',
        description: '',
        content: "<p>You are finished with this process!</p>\n<p>Now you can go back to the LinDA Workbench and proceed to <a href=\"/visualizations\">visualize</a> or to <a href=\"/analytics\">analyze</a> the output RDF dataset.</p>",
        partial: ''
      }
    ];
  });

}).call(this);

//# sourceMappingURL=csv.js.map
