(function() {
  'use strict';
  angular.module('r2rDesignerApp').controller('CsvContentsCtrl', function($scope, Csv) {
    $scope.csv = Csv;
    $scope.table = '';
    $scope.$watch('csv.csvFile()', function(val) {
      if (val != null) {
        return $scope.table = val.name;
      }
    });
    return $scope.$watch('selectAll', function(val) {
      if (val) {
        return $scope.csv.selectAllColumns($scope.table);
      } else {
        return $scope.csv.deselectAllColumns($scope.table);
      }
    });
  });

}).call(this);

//# sourceMappingURL=contents.js.map
