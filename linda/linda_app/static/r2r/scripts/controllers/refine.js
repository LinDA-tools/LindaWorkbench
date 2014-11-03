(function() {
  'use strict';
  angular.module('app').controller('refineCtrl', function($scope, _, Rdb, Rdf) {
    $scope.rdb = Rdb;
    $scope.rdf = Rdf;
    $scope.table = '';
    $scope.columns = [];
    $scope.selectedColumns = [];
    $scope.subjectTemplate = '';
    $scope.cursorpos = 0;
    $scope.propertyLiteralSelection = {};
    $scope.propertyLiteralType = {};
    $scope.propertyLiteralTypeSelections = ['Plain Literal', 'Typed Literal', 'Blank Node'];
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
    $scope.isSelected = function(column) {
      return _.contains($scope.selectedColumns, column);
    };
    return $scope.insert = function(column) {
      var oldVal;
      if ($scope.isSelected(column)) {
        oldVal = $scope.subjectTemplate;
        $scope.subjectTemplate = oldVal.replace('{' + column + '}', '');
        return $scope.selectedColumns = _.without($scope.selectedColumns, column);
      } else {
        oldVal = $scope.subjectTemplate;
        $scope.subjectTemplate = (oldVal.slice(0, $scope.cursorpos)) + '{' + column + '}' + (oldVal.slice($scope.cursorpos, oldVal.length));
        return $scope.selectedColumns.push(column);
      }
    };
  });

}).call(this);

//# sourceMappingURL=refine.js.map
