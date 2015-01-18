(function() {
  'use strict';
  angular.module('r2rDesignerApp').factory('Rdf', function() {
    return {
      propertyLiteralTypeOptions: ['Plain Literal', 'Typed Literal', 'Blank Node'],
      propertyLiteralTypes: ['xsd:anyURI', 'xsd:base64Binary', 'xsd:boolean', 'xsd:date', 'xsd:dateTime', 'xsd:decimal', 'xsd:double', 'xsd:duration', 'xsd:float', 'xsd:hexBinary', 'xsd:gDay', 'xsd:gMonth', 'xsd:gMonthDay', 'xsd:gYear', 'xsd:gYearMonth', 'xsd:NOTATION', 'xsd:QName', 'xsd:string', 'xsd:time'],
      baseUri: '',
      subjectTemplate: '',
      propertyLiteralSelection: {},
      propertyLiteralTypeSelection: {},
      selectedClasses: {},
      selectedProperties: {},
      suggestions: {}
    };
  });

}).call(this);

//# sourceMappingURL=rdf.js.map
