var url = require("url");

var Resolver = module.exports = function Resolver(base){
	this.base = base;
	this.prefixes = {
		"rdf:": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
		"rdfs:": "http://www.w3.org/2000/01/rdf-schema#",
		"owl:": "http://www.w3.org/2002/07/owl#",
		"ldp:": "http://www.w3.org/ns/ldp#"
	};
};

Resolver.prototype = {
	register: function(prefix, iri){
		if(arguments.length <2){
			iri = prefix;
			prefix = "";
		}

		this.prefixes[prefix+":"] = iri;
	},
	resolve: function(iri){
		var parts = /^([^:]*:)([^\/:]*)$/.exec(iri);
		if(parts){
			if(!this.prefixes[parts[1]]){
				throw new Error("Unknown prefix: " + parts[1]);
			}
			return this.prefixes[parts[1]] + parts[2]
		}
		return url.resolve(this.base, iri);
	}
}
