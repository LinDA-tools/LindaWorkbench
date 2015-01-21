(function() {
  'use strict';
  angular.module('r2rDesignerApp').controller('CsvPublishCtrl', function($scope, $timeout, $window, _, Csv, Rdf, Sml, Transform) {
    $scope.csv = Csv;
    $scope.rdf = Rdf;
    $scope.sml = Sml;
    $scope.transform = Transform;
    $scope.publishing = false;
    $scope.published = false;
    $scope.success = false;
    $scope.dump = function() {
      var mapping, w;
      mapping = {
        source: 'csv',
        tables: $scope.csv.selectedTables(),
        columns: $scope.csv.selectedColumns(),
        baseUri: $scope.rdf.baseUri,
        subjectTemplate: $scope.rdf.subjectTemplate,
        classes: $scope.rdf.selectedClasses,
        properties: $scope.rdf.selectedProperties,
        literals: $scope.rdf.propertyLiteralSelection,
        literalTypes: $scope.rdf.propertyLiteralTypeSelection
      };
      w = $window.open('');
      $scope.currentMapping = $scope.sml.toSml(mapping);
      return $scope.transform.dumpcsv($scope.currentMapping).then(function(url) {
        return w.location = url;
      });
    };
    $scope.safe_tags_replace = function(str) {
      var replaceTag, tagsToReplace;
      tagsToReplace = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;'
      };
      replaceTag = function(tag) {
        return tagsToReplace[tag] || tag;
      };
      return str.replace(/[&<>]/g, replaceTag);
    };
    $scope.mapping = function() {
      var mapping, w;
      mapping = {
        source: 'csv',
        tables: $scope.csv.selectedTables(),
        columns: $scope.csv.selectedColumns(),
        baseUri: $scope.rdf.baseUri,
        subjectTemplate: $scope.rdf.subjectTemplate,
        classes: $scope.rdf.selectedClasses,
        properties: $scope.rdf.selectedProperties,
        literals: $scope.rdf.propertyLiteralSelection,
        literalTypes: $scope.rdf.propertyLiteralTypeSelection
      };
      $scope.currentMapping = $scope.sml.toSml(mapping);
      w = $window.open('');
      w.document.open();
      w.document.write('<pre>' + $scope.safe_tags_replace($scope.currentMapping) + '</pre>');
      return w.document.close();
    };
    return $scope.publish = function(datasource) {
      var mapping, r;
      $scope.publishing = true;
      mapping = {
        source: 'csv',
        tables: $scope.csv.selectedTables(),
        columns: $scope.csv.selectedColumns(),
        baseUri: $scope.rdf.baseUri,
        subjectTemplate: $scope.rdf.subjectTemplate,
        classes: $scope.rdf.selectedClasses,
        properties: $scope.rdf.selectedProperties,
        literals: $scope.rdf.propertyLiteralSelection,
        literalTypes: $scope.rdf.propertyLiteralTypeSelection
      };
      $scope.currentMapping = $scope.sml.toSml(mapping);
      r = $scope.transform.publish('linda', datasource, $scope.currentMapping);
      if (r != null) {
        r.success(function(data) {
          $scope.publishing = false;
          $scope.published = true;
          return $scope.success = true;
        });
        return r.error(function() {
          console.log('error: could not connect to server');
          $scope.publishing = false;
          $scope.published = true;
          return $scope.success = false;
        });
      } else {
        console.log('error: invalid params');
        $scope.publishing = false;
        $scope.published = true;
        return $scope.success = false;
      }
    };
  });

}).call(this);

//# sourceMappingURL=publish.js.map
