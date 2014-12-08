(function() {
  'use strict';
  angular.module('app').factory('Sml', function(_) {
    var columnToVar, getVar, namespacePrefixes, newLookup, propertyLiterals, subjectTemplate, toClasses, toProperties;
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
        return _.foldl(classes, (function(x, y) {
          return (x + ";\n").concat(y);
        }));
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
          return (x + ";\n").concat(y);
        }));
      }
    };
    columnToVar = function(column) {
      return '?' + column.substring(1, column.length - 1);
    };
    subjectTemplate = function(mapping, table) {
      var template;
      if (_.isEmpty(mapping.subjectTemplate)) {
        if (_.isEmpty(mapping.baseUri)) {
          return "?s = uri(tns:" + table + ")\n";
        } else {
          return "?s = bNode(concat('" + table + "', '_')\n";
        }
      } else {
        template = mapping.subjectTemplate;
        template = template.replace(/{[^}]*}/g, function(i) {
          return ';$;' + (columnToVar(i)) + ';$;';
        });
        template = template.split(';$;');
        template = _.filter(template, function(i) {
          return !(_.isEmpty(i));
        });
        template = _.map(template, function(i) {
          if (i[0] === '?') {
            return i;
          } else {
            return "'" + i + "'";
          }
        });
        template = "concat('" + mapping.baseUri + "', " + template + ")";
        if (_.isEmpty(mapping.baseUri)) {
          return '?s = bNode(' + template + ')';
        } else {
          return '?s = uri(' + template + ')';
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
        var property;
        property = mapping.properties[table][i].prefixedName[0];
        switch (literals[property]) {
          case 'Blank Node':
            return lookup[property] = getVar(i, lookup) + ' = bNode(?' + i + ')';
          case 'Plain Literal':
            return lookup[property] = getVar(i, lookup) + ' = plainLiteral(?' + i + ')';
          case 'Typed Literal':
            return lookup[property] = getVar(i, lookup) + ' = typedLiteral(?' + i + ', ' + types[property] + ')';
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
      var baseUris, suggestedUris, suggestions;
      baseUris = ['Prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>', 'Prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>', 'Prefix xsd: <http://www.w3.org/2001/XMLSchema#>'];
      suggestions = _.flatten((_.values(mapping.classes)).concat(_.map(_.values(mapping.properties), _.values)));
      suggestedUris = _.without(_.map(suggestions, function(i) {
        if ((i['vocabulary.prefix'] != null) && (i['vocabulary.uri'] != null)) {
          return "Prefix " + (_.first(i['vocabulary.prefix'])) + ": <" + (_.first(i['vocabulary.uri'])) + ">";
        } else {
          return null;
        }
      }), null);
      return _.foldl(baseUris.concat(suggestedUris), (function(x, y) {
        return (x + '\n').concat(y);
      }));
    };
    return {
      toSml: function(mapping) {
        var lookup, table;
        table = 'products';
        lookup = newLookup();
        return "" + (namespacePrefixes(mapping)) + "\nPrefix tns: <" + mapping.baseUri + ">\n\nCreate View " + table + " As\n    Construct {\n        ?s \n" + (toClasses(mapping, table)) + ";\n" + (toProperties(mapping, table, lookup)) + ".\n    }\n    With\n" + (subjectTemplate(mapping, table)) + "\n" + (propertyLiterals(mapping, table, lookup)) + "\n    From " + table;
      }
    };
  });

}).call(this);

//# sourceMappingURL=sml.js.map
