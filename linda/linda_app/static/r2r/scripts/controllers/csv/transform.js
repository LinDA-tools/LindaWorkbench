(function() {
  'use strict';
  angular.module('r2rDesignerApp').controller('CsvTransformCtrl', function($scope, _, Oracle, Csv, Rdf) {
    $scope.csv = Csv;
    $scope.rdf = Rdf;
    $scope.loading = false;
    $scope.table = '';
    $scope.tableTag = {};
    $scope.columns = [];
    $scope.columnTags = {};
    $scope.$watch('csv.csvFile()', function(val) {
      if (val != null) {
        return $scope.table = val.name;
      }
    });
    $scope.$watch('csv.selectedColumns()[table]', function(val) {
      if (val != null) {
        return $scope.columns = $scope.csv.selectedColumns()[$scope.table];
      }
    });
    $scope.ask = function(table, columns) {
      if ((table != null) && (columns != null)) {
        $scope.loading = true;
        return Oracle.ask(table, $scope.tableTag[table], columns, $scope.columnTags).success(function(data) {
          $scope.loading = false;
          return $scope.rdf.suggestions[table] = data;
        }).error(function() {
          console.log("error: could not connect to server");
          return $scope.loading = false;
        });
      }
    };
    $scope.getColumnSuggestions = function(table, column) {
      if (($scope.rdf.suggestions != null) && $scope.rdf.suggestions[table] && ($scope.rdf.suggestions[table].columns != null)) {
        column = _.first(_.filter($scope.rdf.suggestions[table].columns, function(i) {
          return i.name === column;
        }));
        if (column != null) {
          return column.recommend;
        }
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
        $scope.rdf.selectedProperties[table] = currentTable;
        return $scope.rdf.propertyLiteralSelection[property.prefixedName[0]] = $scope.rdf.propertyLiteralTypeOptions[0];
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

//# sourceMappingURL=transform.js.map
