(function() {
  'use strict';
  var app;

  app = angular.module('app');

  app.directive('columntip', function() {
    return {
      restrict: 'A',
      controller: function($scope, Rdb) {
        $scope.rdb = Rdb;
        return $scope.getData = function() {
          var d;
          d = $scope.rdb.getColumn('products', 'ProductName');
          return console.log(d);
        };
      },
      link: function(scope, element, attrs, ctrl) {
        element.bind('mouseenter', function() {
          var data, tmpl;
          tmpl = "";
          data = scope.getData();
          console.log(data);
          return scope.$emit('changeSidetip', tmpl);
        });
        return element.bind('mouseleave', function() {
          return scope.$emit('changeSidetip', '');
        });
      }
    };
  });

}).call(this);

//# sourceMappingURL=columntip.js.map
