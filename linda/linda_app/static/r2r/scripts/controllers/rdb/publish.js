(function() {
  'use strict';
  angular.module('r2rDesignerApp').controller('RdbPublishCtrl', function($scope, $timeout, $window, _, Rdb, Rdf, Sml, Transform) {
    $scope.rdb = Rdb;
    $scope.rdf = Rdf;
    $scope.sml = Sml;
    $scope.transform = Transform;
    $scope.publishing = false;
    $scope.published = false;
    $scope.success = false;
    $scope.dump = function(table) {
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
        literalTypes: $scope.rdf.propertyLiteralTypeSelection
      };
      w = $window.open('');
      $scope.currentMapping = $scope.sml.toSml(mapping, table);
      return $scope.transform.dumpdb($scope.currentMapping).then(function(url) {
        return w.location = url;
      });
    };
    $scope.mapping = function(table) {
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
        literalTypes: $scope.rdf.propertyLiteralTypeSelection
      };
      $scope.currentMapping = $scope.sml.toSml(mapping, table);
      w = $window.open('');
      w.document.open();
      w.document.write('<pre>' + $scope.safe_tags_replace($scope.currentMapping) + '</pre>');
      return w.document.close();
    };
    return $scope.publish = function(to) {
      var mapping;
      $scope.publishing = true;
      mapping = {
        source: 'rdb',
        tables: $scope.rdb.selectedTables(),
        columns: $scope.rdb.selectedColumns(),
        baseUri: $scope.rdf.baseUri,
        subjectTemplate: $scope.rdf.subjectTemplate,
        classes: $scope.rdf.selectedClasses,
        properties: $scope.rdf.selectedProperties,
        literals: $scope.rdf.propertyLiteralSelection,
        literalTypes: $scope.rdf.propertyLiteralTypeSelection
      };
      $scope.currentMapping = $scope.sml.toSml(mapping);
      return $scope.transform.publish(to, $scope.currentMapping).success(function(data) {
        $scope.publishing = false;
        $scope.published = true;
        return $scope.success = true;
      }).error(function(data) {
        console.log('error: could not connect to server');
        $scope.publishing = false;
        $scope.published = true;
        return $scope.success = false;
      });
    };
  });

}).call(this);

//# sourceMappingURL=publish.js.map
