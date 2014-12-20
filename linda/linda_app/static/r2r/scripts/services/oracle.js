(function() {
  'use strict';
  angular.module('app').factory('Oracle', function($http, _, Config) {
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
        if ((table != null) && (columns != null)) {
          return $http.post(oracleApi, {
            table: {
              name: table,
              tag: tableTag || table
            },
            columns: zipColumnTags(columns, columnTags)
          }).then(function(res) {
            return res.data;
          });
        }
      }
    };
  });

}).call(this);

//# sourceMappingURL=oracle.js.map
