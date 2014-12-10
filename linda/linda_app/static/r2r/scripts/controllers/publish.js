(function() {
  'use strict';
  angular.module('app').controller('PublishCtrl', function($scope, $timeout, $window, _, Rdb, Csv, Rdf, Sml, Transform) {
    $scope.rdb = Rdb;
    $scope.csv = Csv;
    $scope.rdf = Rdf;
    $scope.sml = Sml;
    $scope.transform = Transform;
    $scope.publishing = false;
    $scope.published = false;
    $scope.success = false;
    $scope.dumpdb = function(table) {
      var mapping, w;
      mapping = {
        source: 'rdb',
        tables: $scope.rdb.selectedTables(),
        columns: $scope.rdb.selectedColumns(),
        baseUri: $scope.rdf.baseUri,
        subjectTemplate: $scope.rdf.subjectTemplate,
        classes: $scope.rdf.selectedClasses,
        properties: $scope.rdf.selectedProperties,
        literals: $scope.rdf.propertyLiteralSelection,
        literalTypes: $scope.rdf.propertyLiteralTypes
      };
      w = $window.open('');
      $scope.currentMapping = $scope.sml.toSml(mapping, table);
      return $scope.transform.dumpdb($scope.currentMapping).then(function(url) {
        return w.location = url;
      });
    };
    $scope.dumpcsv = function(table) {
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
        literalTypes: $scope.rdf.propertyLiteralTypes
      };
      w = $window.open('');
      $scope.currentMapping = $scope.sml.toSml(mapping, table);
      return $scope.transform.dumpcsv($scope.currentMapping).then(function(url) {
        return w.location = url;
      });
    };
    $scope.mappingdb = function(table) {
      var mapping, w;
      mapping = {
        source: 'rdb',
        tables: $scope.rdb.selectedTables(),
        columns: $scope.rdb.selectedColumns(),
        baseUri: $scope.rdf.baseUri,
        subjectTemplate: $scope.rdf.subjectTemplate,
        classes: $scope.rdf.selectedClasses,
        properties: $scope.rdf.selectedProperties,
        literals: $scope.rdf.propertyLiteralSelection,
        literalTypes: $scope.rdf.propertyLiteralTypes
      };
      $scope.currentMapping = $scope.sml.toSml(mapping, table);
      w = $window.open('');
      w.document.open();
      w.document.write('<pre>' + $scope.currentMapping + '</pre>');
      return w.document.close();
    };
    $scope.mappingcsv = function() {
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
        literalTypes: $scope.rdf.propertyLiteralTypes
      };
      $scope.currentMapping = $scope.sml.toSml(mapping);
      w = $window.open('');
      w.document.open();
      w.document.write('<pre>' + $scope.currentMapping + '</pre>');
      return w.document.close();
    };
    return $scope.publish = function(to) {
      var mapping;
      $scope.publishing = true;
      mapping = {
        tables: $scope.rdb.selectedTables(),
        columns: $scope.rdb.selectedColumns(),
        baseUri: $scope.rdf.baseUri,
        subjectTemplate: $scope.rdf.subjectTemplate,
        classes: $scope.rdf.selectedClasses,
        properties: $scope.rdf.selectedProperties,
        literals: $scope.rdf.propertyLiteralSelection,
        literalTypes: $scope.rdf.propertyLiteralTypes
      };
      $scope.currentMapping = $scope.sml.toSml(mapping);
      return $scope.transform.publish(to, $scope.currentMapping).success(function(data) {
        console.log('success');
        $scope.publishing = false;
        $scope.published = true;
        return $scope.success = true;
      }).error(function(data) {
        console.log('error');
        $scope.publishing = false;
        $scope.published = true;
        return $scope.success = false;
      });
    };
  });

}).call(this);

//# sourceMappingURL=publish.js.map
