(function() {
  'use strict';
  var app;

  app = angular.module('app');

  app.directive('cursor', function() {
    return {
      restrict: 'A',
      scope: {
        content: '=',
        cursorpos: '='
      },
      controller: function($scope) {},
      link: function(scope, element, attrs) {
        element.on('keyup', function() {
          scope.cursorpos = element.prop('selectionStart');
          return scope.$apply();
        });
        return element.on('click', function() {
          scope.cursorpos = element.prop('selectionStart');
          return scope.$apply();
        });
      }
    };
  });

}).call(this);

//# sourceMappingURL=cursor.js.map
