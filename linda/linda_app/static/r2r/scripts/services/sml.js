(function() {
  'use strict';
  angular.module('r2rDesignerApp').factory('Sml', function(_, Csv) {
    var columnToNum, createClause, fromClause, getVar, namespacePrefixes, newLookup, propertyLiterals, subjectTemplate, toClasses, toProperties, unwrapColumn;
    newLookup = function() {
      return {
        index: 0,
        table: {}
      };
    };
    getVar = function(key, lookup) {
      var found, new_entry;
      found = lookup.table[key];
      if (found) {
        return found;
      } else {
        new_entry = '?x' + lookup.index++;
        lookup.table[key] = new_entry;
        return new_entry;
      }
    };
    toClasses = function(mapping, table) {
      var c, classes;
      if (mapping.classes[table] == null) {
        return '\n';
      }
      classes = (function() {
        var _i, _len, _ref, _results;
        _ref = mapping.classes[table];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          c = _ref[_i];
          _results.push('a ' + c.prefixedName[0]);
        }
        return _results;
      })();
      if (_.isEmpty(classes)) {
        return '\n';
      } else {
        return (_.foldl(classes, (function(x, y) {
          return (x + ';\n').concat(y);
        }))) + ';';
      }
    };
    toProperties = function(mapping, table, lookup) {
      var c, columns, properties;
      columns = _.keys(mapping.properties[table]);
      properties = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = columns.length; _i < _len; _i++) {
          c = columns[_i];
          _results.push(mapping.properties[table][c].prefixedName[0] + ' ' + getVar(c, lookup));
        }
        return _results;
      })();
      if (_.isEmpty(properties)) {
        return '\n';
      } else {
        return _.foldl(properties, (function(x, y) {
          return (x + ';\n').concat(y);
        }));
      }
    };
    unwrapColumn = function(column) {
      return column.substring(1, column.length - 1);
    };
    columnToNum = function(table, column) {
      if ((table != null) && (column != null)) {
        return (_.indexOf(Csv.columns(table), column)) + 1;
      }
    };
    subjectTemplate = function(mapping, table) {
      var template;
      if (_.isEmpty(mapping.subjectTemplate)) {
        if (_.isEmpty(mapping.baseUri)) {
          return "?s = bNode(concat(fn:urlEncode('" + table + "'), '_'))\n";
        } else {
          return "?s = bNode(concat('" + mapping.baseUri + "', '_'))\n";
        }
      } else {
        template = mapping.subjectTemplate;
        template = template.replace(/{[^}]*}/g, function(i) {
          console.log(i);
          return ';$;' + '?' + (mapping.source === 'csv' ? columnToNum(table, unwrapColumn(i)) : unwrapColumn(i)) + ';$;';
        });
        template = template.split(';$;');
        template = _.filter(template, function(i) {
          return !(_.isEmpty(i));
        });
        template = _.map(template, function(i) {
          if (i[0] === '?') {
            return 'fn:urlEncode(' + i + ')';
          } else {
            return "'" + i + "'";
          }
        });
        template = "concat('" + mapping.baseUri + "', " + template + ")";
        if (_.isEmpty(mapping.baseUri)) {
          return "?s = bNode(" + template + ")";
        } else {
          return "?s = uri(" + template + ")";
        }
      }
    };
    propertyLiterals = function(mapping, table, lookup) {
      var columns, literals, properties, types;
      literals = mapping.literals;
      types = mapping.literalTypes;
      columns = _.keys(mapping.properties[table]);
      columns = _.filter(columns, function(i) {
        var property;
        property = mapping.properties[table][i].prefixedName[0];
        return literals[property] || ((litearls[property] === 'Typed Literal') && types[property]);
      });
      properties = _.map(columns, function(i) {
        var col, property;
        property = mapping.properties[table][i].prefixedName[0];
        col = '';
        if (mapping.source === 'csv') {
          col = columnToNum(table, i);
        } else {
          col = i;
        }
        switch (literals[property]) {
          case 'Blank Node':
            return lookup[property] = (getVar(i, lookup)) + ' = bNode(?' + col + ')';
          case 'Plain Literal':
            return lookup[property] = (getVar(i, lookup)) + ' = plainLiteral(?' + col + ')';
          case 'Typed Literal':
            return lookup[property] = (getVar(i, lookup)) + ' = typedLiteral(?' + col + ', ' + types[property] + ')';
          default:
            return '';
        }
      });
      if (_.isEmpty(properties)) {
        return '';
      } else {
        return _.foldl(properties, (function(x, y) {
          return (x + '\n').concat(y);
        }));
      }
    };
    namespacePrefixes = function(mapping) {
      var baseUri, baseUris, suggestedUris, suggestions;
      baseUris = ['Prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>', 'Prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>', 'Prefix xsd: <http://www.w3.org/2001/XMLSchema#>', 'Prefix fn: <http://aksw.org/sparqlify/>'];
      suggestions = _.flatten((_.values(mapping.classes)).concat(_.map(_.values(mapping.properties), _.values)));
      suggestedUris = _.without(_.map(suggestions, function(i) {
        if ((i['vocabulary.prefix'] != null) && (i['vocabulary.uri'] != null)) {
          return "Prefix " + (_.first(i['vocabulary.prefix'])) + ": <" + (_.first(i['vocabulary.uri'])) + ">";
        } else {
          return null;
        }
      }), null);
      baseUri = !_.isEmpty(mapping.baseUri) ? ["Prefix tns: <" + mapping.baseUri + ">"] : [];
      return _.foldl(baseUris.concat(suggestedUris, baseUri), (function(x, y) {
        return (x + '\n').concat(y);
      }));
    };
    createClause = function(mapping, table) {
      if (mapping.source === 'csv') {
        return "Create View Template " + (table.replace(/[^\w]/g, '')) + " As";
      } else {
        return "Create View " + (table.replace(/[^\w]/g, '')) + " As";
      }
    };
    fromClause = function(mapping, table) {
      if (mapping.source === 'rdb') {
        return "From " + table;
      } else {
        return "";
      }
    };
    return {
      toSml: function(mapping) {
        var lookup, table;
        table = mapping.tables[0];
        lookup = newLookup();
        return "" + (namespacePrefixes(mapping)) + "\n\n" + (createClause(mapping, table)) + "\n    Construct {\n        ?s \n" + (toClasses(mapping, table)) + "\n" + (toProperties(mapping, table, lookup)) + ".\n    }\n    With\n" + (subjectTemplate(mapping, table)) + "\n" + (propertyLiterals(mapping, table, lookup)) + "\n" + (fromClause(mapping, table));
      }
    };
  });

}).call(this);

//# sourceMappingURL=sml.js.map
