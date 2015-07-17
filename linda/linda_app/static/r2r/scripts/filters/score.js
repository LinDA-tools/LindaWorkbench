(function() {
  'use strict';
  angular.module('r2rDesignerApp').filter('scoreFilter', function() {
    return function(input) {
      return (Number(input)).toPrecision(2);
    };
  });

}).call(this);

//# sourceMappingURL=score.js.map
