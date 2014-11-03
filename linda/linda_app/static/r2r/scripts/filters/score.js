(function() {
  'use strict';
  angular.module('app').filter('scoreFilter', function() {
    return function(input) {
      return (Number(input)).toPrecision(2);
    };
  });

}).call(this);

//# sourceMappingURL=score.js.map
