(function() {
  'use strict';
  var app;

  app = angular.module('app');

  app.directive('rdftip', function() {
    return {
      restrict: 'A',
      scope: {
        rdfelem: '@'
      },
      link: function(scope, element, attrs, ctrl) {
        element.bind('mouseenter', function() {
          return scope.$emit('changeSidetip', 'rdf');
        });
        return element.bind('mouseleave', function() {
          return scope.$emit('changeSidetip', '');
        });
      }
    };
  });

}).call(this);

//# sourceMappingURL=rdftip.js.map
