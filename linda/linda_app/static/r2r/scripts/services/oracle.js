(function() {
  'use strict';
  angular.module('r2rDesignerApp').factory('Oracle', function($http, _, Config) {
    var oracleApi, zipColumnTags;
    oracleApi = Config.backend + '/api/v1/oracle';
    zipColumnTags = function(columns, tags) {
      return _.map(columns, function(i) {
        return {
          name: i,
          tag: tags[i] || i
        };
      });
    };
    return {
      ask: function(table, tableTag, columns, columnTags) {
        return $http.post(oracleApi, {
          table: {
            name: table,
            tag: tableTag || table
          },
          columns: zipColumnTags(columns, columnTags)
        });
      }
    };
  });

}).call(this);

//# sourceMappingURL=oracle.js.map
