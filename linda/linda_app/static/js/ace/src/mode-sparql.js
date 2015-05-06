define("ace/mode/sparql_highlight_rules",["require","exports","module","ace/lib/oop","ace/lib/lang","ace/mode/text_highlight_rules"], function(require, exports, module) {
/*var _ = {require: require, exports: exports, module: module};
exports = undefined; module = undefined;
function define(name, deps, m) {
    if (typeof name == "function") {
        m = name; deps = ["require", "exports", "module"]; name = _.module.id
    }
    if (typeof name == "object") {
        m = deps; deps = name; name = _.module.id
    }
    if (typeof deps == "function") {
        m = deps; deps = [];
    }
   var ret = m.apply(_.module, deps.map(function(n){return _[n] || require(n)}))
   if (ret) _.module.exports = ret;
}
define.amd = true;define("ace/mode/sparql_highlight_rules", function(require, exports, module) {*/

var oop = require("../lib/oop");
var lang = require("../lib/lang");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var SparqlHighlightRules = function() {

  var builtinFunctions_str = "str|lang|langmatches|datatype|bound|sameterm|isiri|isuri|isblank|isliteral|a|count|number|sum|min|max|avg";
  var builtinFunctions = lang.arrayToMap(builtinFunctions_str.split("|"));
  var keyword_str = "BASE|PREFIX|SELECT|ASK|CONSTRUCT|DESCRIBE|WHERE|FROM|REDUCED|NAMED|ORDER|GROUP|LIMIT|OFFSET|FILTER|OPTIONAL|GRAPH|BY|ASC|DESC|UNION|MINUS|SERVICE|DISTINCT|AS";
  
  var keywords = lang.arrayToMap(keyword_str.split("|"));

  var buildinConstants = "true|false".split("|");

  this.$keywords = keyword_str.split("|");
  Array.prototype.push.apply(this.$keywords, builtinFunctions_str.split("|"));
  
  var builtinVariables = lang.arrayToMap(
    ("").split("|")
  );

  this.$rules = {
    "start" : [
      {
        token : "comment",
        regex : "#.*$"
      }, {
        token : "sparql.constant.uri",
        regex : "\\<\\S+\\>"
      }, {
        token : "sparql.variable",
        regex : "[\\?\\$][a-zA-Z_][a-zA-Z_0-9]*"
      }, {
        token : "sparql.prefix.constant.language",
        regex : "[a-zA-Z][a-zA-Z0-9]+:"
      }, {
        token : "string.regexp",
        regex : "[/](?:(?:\\[(?:\\\\]|[^\\]])+\\])|(?:\\\\/|[^\\]/]))*[/]\\w*\\s*(?=[).,;]|$)"
      }, {
        token : "string", // single line
        regex : '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
      }, {
        token : "string", // single line
        regex : "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
      }, {
        token : "constant.numeric", // hex
        regex : "0[xX][0-9a-fA-F]+\\b"
      }, {
        token : "constant.numeric", // float
        regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
      }, {
        token : "constant.language.boolean",
        regex : "(?:true|false)\\b"
      }, {
        token : function(value) {
          if (value == "self")
            return "variable.language";
          else if (keywords.hasOwnProperty(value.toUpperCase()))
            return "keyword";
          else if (buildinConstants.hasOwnProperty(value.toUpperCase()))
            return "constant.language";
          else if (builtinVariables.hasOwnProperty(value))
            return "variable.language";
          else if (builtinFunctions.hasOwnProperty(value.toLowerCase()))
            return "support.function";
          else if (value == "debugger")
            return "invalid.deprecated";
          else
            return "identifier";
        },
        regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
      }, {
        token : "keyword.operator",
        regex : "\\*|\\+|\\|\\-|\\<|\\>|=|&|\\|"
      }, {
        token : "lparen",
        regex : "[\\<({]"
      }, {
        token : "rparen",
        regex : "[\\>)}]"
      }, {
        token : "text",
        regex : "\\s+"
      }, {
		caseInsensitive: true
	  }
    ],
    "comment" : [
      {
        token : "comment", // comment spanning whole line
        regex : ".+"
      }
    ]
  };
};

oop.inherits(SparqlHighlightRules, TextHighlightRules);
exports.SparqlHighlightRules = SparqlHighlightRules;
});//});

define("ace/mode/matching_brace_outdent",["require","exports","module","ace/range"], function(require, exports, module) {
"use strict";

var Range = require("../range").Range;

var MatchingBraceOutdent = function() {

(function() {

    this.checkOutdent = function(line, input) {
        if (! /^\s+$/.test(line))
            return false;

        return /^\s*\}/.test(input);
    };

    this.autoOutdent = function(doc, row) {
        var line = doc.getLine(row);
        var match = line.match(/^(\s*\})/);

        if (!match) return 0;

        var column = match[1].length;
        var openBracePos = doc.findMatchingBracket({row: row, column: column});

        if (!openBracePos || openBracePos.row == row) return 0;

        var indent = this.$getIndent(doc.getLine(openBracePos.row));
        doc.replace(new Range(row, 0, row, column-1), indent);
    };

    this.$getIndent = function(line) {
        return line.match(/^\s*/)[0];
    };

}).call(MatchingBraceOutdent.prototype);

exports.MatchingBraceOutdent = MatchingBraceOutdent;
};
});

define("ace/mode/sparql",["require","exports","module","ace/lib/oop","ace/mode/text","ace/tokenizer","ace/mode/sparql_highlight_rules","ace/mode/matching_brace_outdent","ace/range"], function(require, exports, module) {
/*var _ = {require: require, exports: exports, module: module};
exports = undefined; module = undefined;
function define(name, deps, m) {
    if (typeof name == "function") {
        m = name; deps = ["require", "exports", "module"]; name = _.module.id
    }
    if (typeof name == "object") {
        m = deps; deps = name; name = _.module.id
    }
    if (typeof deps == "function") {
        m = deps; deps = [];
    }
   var ret = m.apply(_.module, deps.map(function(n){return _[n] || require(n)}))
   if (ret) _.module.exports = ret;
}

define.amd = true;define("ace/mode/sparql", function(require, exports, module) {*/
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var Tokenizer = require("../tokenizer").Tokenizer;
var SparqlHighlightRules = require("./sparql_highlight_rules").SparqlHighlightRules;
var MatchingBraceOutdent = require("./matching_brace_outdent").MatchingBraceOutdent;
var Range = require("../range").Range;

var Mode = function() {
  this.$tokenizer = new Tokenizer(new SparqlHighlightRules().getRules());
  this.$highlightRules = new SparqlHighlightRules();
  this.$highlightRules.$meta = "SPARQL Core";
  this.$highlightRules.$keywordList = this.$highlightRules.$keywords;
};
oop.inherits(Mode, TextMode);

exports.Mode = Mode;

});
//});
