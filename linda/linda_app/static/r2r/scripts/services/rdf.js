(function() {
  'use strict';
  angular.module('app').factory('Rdf', function() {
    return {
      baseUri: '',
      subjectTemplate: '',
      propertyLiteralSelection: {},
      propertyLiteralTypes: {},
      selectedClasses: {},
      selectedProperties: {},
      suggestions: {}
    };
  });

}).call(this);

//# sourceMappingURL=rdf.js.map
