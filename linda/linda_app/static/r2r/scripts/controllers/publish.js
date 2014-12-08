(function() {
  'use strict';
  angular.module('app').controller('PublishCtrl', function($scope, $timeout, $window, _, Rdb, Rdf, Sml, Transform) {
    $scope.rdb = Rdb;
    $scope.rdf = Rdf;
    $scope.sml = Sml;
    $scope.transform = Transform;
    $scope.publishing = false;
    $scope.published = false;
    $scope.success = false;
    $scope.dump = function() {
      var mapping, w;
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
      w = $window.open('');
      $scope.currentMapping = $scope.sml.toSml(mapping);
      return $scope.transform.dump($scope.currentMapping).then(function(url) {
        return w.location = url;
      });
    };
    $scope.mapping = function() {
      var mapping, w;
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
