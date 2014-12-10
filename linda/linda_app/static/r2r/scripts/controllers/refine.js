(function() {
  'use strict';
  angular.module('app').controller('RefineCtrl', function($scope, _, Rdb, Rdf) {
    $scope.rdb = Rdb;
    $scope.rdf = Rdf;
    $scope.table = '';
    $scope.columns = [];
    $scope.selectedColumns = [];
    $scope.cursorpos = 0;
    $scope.propertyLiteralTypeOptions = ['Plain Literal', 'Typed Literal', 'Blank Node'];
    $scope.propertyLiteralTypes = ['xsd:anyURI', 'xsd:base64Binary', 'xsd:boolean', 'xsd:date', 'xsd:dateTime', 'xsd:decimal', 'xsd:double', 'xsd:duration', 'xsd:float', 'xsd:hexBinary', 'xsd:gDay', 'xsd:gMonth', 'xsd:gMonthDay', 'xsd:gYear', 'xsd:gYearMonth', 'xsd:NOTATION', 'xsd:QName', 'xsd:string', 'xsd:time'];
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

//# sourceMappingURL=refine.js.map
