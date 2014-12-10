(function() {
  'use strict';
  angular.module('app').controller('ReconcileCtrl', function($scope, _, Oracle, Rdb, Rdf) {
    $scope.rdb = Rdb;
    $scope.rdf = Rdf;
    $scope.loading = false;
    $scope.table = '';
    $scope.tableTag = {};
    $scope.columns = [];
    $scope.columnTags = {};
    $scope.$watch('rdb.selectedTables()', function(val) {
      if (val != null) {
        return $scope.table = _.first($scope.rdb.selectedTables());
      }
    });
    $scope.$watch('table', function(val) {
      if (val != null) {
        return $scope.columns = $scope.rdb.selectedColumns()[val];
      }
    });
    $scope.ask = function(table, columns) {
      $scope.loading = true;
      return Oracle.ask(table, $scope.tableTag[table], columns, $scope.columnTags).then(function(promise) {
        $scope.loading = false;
        return $scope.rdf.suggestions[table] = promise;
      });
    };
    $scope.getColumnSuggestions = function(table, column) {
      if (($scope.rdf.suggestions != null) && $scope.rdf.suggestions[table] && ($scope.rdf.suggestions[table].columns != null)) {
        return (_.first(_.filter($scope.rdf.suggestions[table].columns, function(i) {
          return i.name === column;
        }))).recommend;
      }
    };
    $scope.selectClass = function(table, _class) {
      var selected;
      if ((table != null) && (_class != null)) {
        if (_.contains($scope.rdf.selectedClasses[table], _class)) {
          return $scope.rdf.selectedClasses[table] = _.without($scope.rdf.selectedClasses[table], _class);
        } else {
          selected = $scope.rdf.selectedClasses[table] || [];
          selected.push(_class);
          return $scope.rdf.selectedClasses[table] = selected;
        }
      }
    };
    $scope.selectProperty = function(table, column, property) {
      var currentTable;
      if ((table != null) && (column != null) && (property != null)) {
        currentTable = $scope.rdf.selectedProperties[table] || {};
        if (currentTable[column] === property) {
          currentTable[column] = null;
        } else {
          currentTable[column] = property;
        }
        return $scope.rdf.selectedProperties[table] = currentTable;
      }
    };
    $scope.isSelectedClass = function(table, _class) {
      return _.contains($scope.rdf.selectedClasses[table], _class);
    };
    return $scope.isSelectedProperty = function(table, column, property) {
      var currentTable;
      currentTable = $scope.rdf.selectedProperties[table];
      return currentTable && (currentTable[column] === property);
    };
  });

}).call(this);

//# sourceMappingURL=reconcile.js.map
