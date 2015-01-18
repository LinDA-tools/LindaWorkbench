(function() {
  'use strict';
  angular.module('r2rDesignerApp').controller('CsvReviseCtrl', function($scope, _, Csv, Rdf) {
    $scope.csv = Csv;
    $scope.rdf = Rdf;
    $scope.table = '';
    $scope.columns = [];
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
    $scope.selectedColumns = [];
    $scope.cursorpos = 0;
    $scope.hasColumns = function() {
      return !_.isEmpty($scope.columns);
    };
    $scope.isSelected = function(column) {
      return _.contains($scope.selectedColumns, column);
    };
    return $scope.insert = function(column) {
      var oldVal;
      if ($scope.isSelected(column)) {
        oldVal = $scope.rdf.subjectTemplate;
        $scope.rdf.subjectTemplate = oldVal.replace('{' + column + '}', '');
        return $scope.selectedColumns = _.without($scope.selectedColumns, column);
      } else {
        oldVal = $scope.rdf.subjectTemplate;
        $scope.rdf.subjectTemplate = (oldVal.slice(0, $scope.cursorpos)) + '{' + column + '}' + (oldVal.slice($scope.cursorpos, oldVal.length));
        return $scope.selectedColumns.push(column);
      }
    };
  });

}).call(this);

//# sourceMappingURL=revise.js.map
