(function() {
  'use strict';
  angular.module('app').factory('Csv', function($http, $upload, _, Config) {
    var csvAdapter, csvData, csvFile, selectedColumns, selectedTables, tableColumns, tables;
    csvAdapter = Config.backend + '/api/v1/csv';
    csvData = {};
    tables = [];
    tableColumns = {};
    selectedTables = [];
    selectedColumns = {};
    csvFile = {};
    return {
      csvFile: function() {
        return csvFile;
      },
      tables: function() {
        return tables;
      },
      columns: function(table) {
        if (table && (csvData[table] != null)) {
          return _.first(csvData[table]);
        } else {
          return [];
        }
      },
      data: function(table) {
        if (table && (csvData[table] != null)) {
          return _.drop(csvData[table], 1);
        } else {
          return [];
        }
      },
      selectedTables: function() {
        return selectedTables;
      },
      selectedColumns: function() {
        return selectedColumns;
      },
      isSelectedColumn: function(table, column) {
        return _.contains(selectedColumns[table], column);
      },
      toggleSelectedColumn: function(table, column) {
        if (_.contains(selectedColumns[table], column)) {
          return selectedColumns[table] = _.without(selectedColumns[table], column);
        } else {
          if (selectedColumns[table] != null) {
            return selectedColumns[table].push(column);
          } else {
            return selectedColumns[table] = [column];
          }
        }
      },
      submitCsvFile: function(file, progress) {
        csvFile = {
          name: file.name
        };
        progress.submitting = true;
        return $upload.upload({
          url: csvAdapter + '/upload',
          method: 'POST',
          file: file,
          fileName: file.name
        }).progress(function(evt) {
          progress.value = parseInt(100.0 * evt.loaded / evt.total);
          if (evt.loaded === evt.total) {
            return progress.submitting = false;
          }
        });
      },
      getCsvData: function() {
        return $http.get(csvAdapter + '/data').then(function(res) {
          var table;
          if (csvFile.name != null) {
            table = csvFile.name;
            tables = [table];
            selectedTables = tables;
            return csvData[table] = res.data;
          }
        });
      }
    };
  });

}).call(this);

//# sourceMappingURL=csv.js.map
