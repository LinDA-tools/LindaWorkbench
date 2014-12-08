(function() {
  'use strict';
  var app;

  app = angular.module('app');

  app.directive('columntip', function() {
    return {
      restrict: 'A',
      scope: {
        table: '@',
        column: '@'
      },
      controller: function($scope, Rdb) {
        $scope.rdb = Rdb;
        return $scope.getData = function() {
          return $scope.rdb.getColumn($scope.table, $scope.column);
        };
      },
      link: function(scope, element, attrs, ctrl) {
        element.bind('mouseenter', function() {
          return scope.getData().success(function(data) {
            var tmpl;
            tmpl = _.foldl(_.take(data, 20), (function(x, y) {
              return (x + "<br />").concat(y);
            }));
            if ((_.size(data)) > 20) {
              tmpl += '<br />...';
            }
            return scope.$emit('changeSidetip', tmpl);
          });
        });
        return element.bind('mouseleave', function() {
          return scope.$emit('changeSidetip', '');
        });
      }
    };
  });

}).call(this);

//# sourceMappingURL=columntip.js.map
