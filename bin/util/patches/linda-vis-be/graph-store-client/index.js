var utile = require('utile')
	, url = require('url')
	, request = require('request')
	, debug = require("debug")("graph-store-client")
	, Q = require('q')
	, jsonld = require('jsonld').promises()
	, rest = require('rest')
	, Resolver = require('./Resolver')
	, StringDecoder = require('string_decoder').StringDecoder
;

var jsonConverter = require("rest/mime/type/application/json");
var textConverter = require("rest/mime/type/text/plain")

var sparqlJsonConverter = {
	read: function (str, opts) {
	    var obj = JSON.parse(str);
	    return obj.boolean === undefined ? obj.results.bindings : obj.boolean;
	},
	write: function (obj, opts) {
	    return JSON.stringify(str);
	}
};

var sparqlXmlConverter = {
	read: function (str, opts) {
	    return /(>true<\/)/.test(str);
	},
	write: function (obj, opts) {
	    return obj;
	}
};
var registry = require("rest/mime/registry");

registry.register("application/ld+json", jsonConverter)
registry.register("application/sparql-results+json", sparqlJsonConverter)
// registry.register("application/sparql-results+xml", sparqlXmlConverter)

registry.register("application/nquads", textConverter)
registry.register("text/x-nquads", textConverter)
registry.register("text/turtle", textConverter)
registry.register("application/sparql-query", textConverter)
registry.register("application/sparql-update", textConverter)

var GraphStoreClient = module.exports = function(endpoint, graphStoreEndpoint){

	this.endpoint = endpoint;
	this.graphStoreEndpoint = graphStoreEndpoint;
	this.ns = new Resolver;
	this._request = rest
		.wrap(require("rest/interceptor/mime"), {accept: "application/sparql-results+json"})
		.wrap(sparqlInterceptor())
	this._del_request = rest
		.wrap(sparqlInterceptor())
}

GraphStoreClient.prototype = {
	query: function(sparql, bindings){
		return this._sparql("application/sparql-query", sparql, bindings)
	},
	update: function(sparql, bindings){
		return this._sparql("application/sparql-update", sparql, bindings)
	},
	_sparql: function(type, sparql, bindings){
		if(bindings && bindings instanceof Object){
			for(var i in bindings){
				sparql = sparql.replace(new RegExp('(\\?|\\$)('+i+')', 'g'), bindings[i]);
			}
		}

		debug("Running SPARQL: %s", sparql);
		
		var d = Q.defer();
		if (type == "application/sparql-query") {
			var callback = function (error, response) {
				var result;
				if (error) {
					throw new Error("SPARQL Endpoint Error: (" + response.statusCode + ") "+ error);
				} else {
					result = JSON.parse(response.body);
				}
						
				d.resolve(result.results.bindings);
			};
		
			var options = {
				url: this.endpoint + '?query=' + encodeURIComponent(sparql),
				headers: {
					'Accept': 'application/sparql-results+json'
				}
			};
			
			request.get(options, callback);
		} else {
			var callback = function (error, response) {
				var result;
				if (error) {
					throw new Error("SPARQL Endpoint Error: (" + response.statusCode + ") "+ error);
				}
						
				d.resolve([]);
			};
			
			var options = {
				url: this.endpoint,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: 'update=' + encodeURIComponent(sparql)
			};
			request.post(options, callback);
		}
		
		return d.promise;
	},
	put: function(iri, graph, type){
		var type = type || "text/turtle", self = this;
		if(typeof graph == "object"){
			var type = "text/x-nquads";
			var graph = jsonld.toRDF(graph, {format: 'application/nquads'});
		}
		return Q.when(graph)
		.then(function(graph){
			return self._request({
				method: "PUT",
				path: self.graphStoreEndpoint,
				headers: {"Content-Type": type},
				params: {graph: url.resolve(self.ns.base, iri)},
				entity: graph
			});
		});
	},
	post: function(iri, graph, type){
		var type = type || "text/turtle", self = this;
		if(typeof graph == "object"){
			var type = "text/x-nquads";
			var graph = jsonld.toRDF(graph, {format: 'application/nquads'});
		}
		return Q.when(graph)
		.then(function(graph){
			return self._request({
				method: "POST",
				path: self.graphStoreEndpoint,
				headers: {"Content-Type": type},
				params: {graph: url.resolve(self.ns.base, iri)},
				entity: graph
			});
		});
	},

	delete: function(iri){
		return this._del_request({
			method: "DELETE",
			path: this.graphStoreEndpoint,
			params: {graph: url.resolve(this.ns.base, iri)},
		});
	},
	get: function(iri){
		return this._request
		({
			method: "GET",
			path: this.graphStoreEndpoint,
			params: {graph: url.resolve(this.ns.base, iri)},
		});
	}
}

function debugInterceptor(){
	return require('rest/interceptor')({
		response: function (response) {
				debug("SPARQL Result Response:", response);
				return response;
		}
	});
}

function sparqlInterceptor(){
    return require('rest/interceptor')({
            response: function (response) {
								if(response.error){
									debug("SPARQL response Error", response.error)
									return Q.reject(response.error);
								}
                if (response.status && response.status.code >= 400) {
									debug("SPARQL response Code >=400", response.status)
	            		var e = {
	            			message: "SPARQL Endpoint Error:" + response.status.code + " " + response.entity,
	            			stack: "Request:\n" +
	            				JSON.stringify(response.request, null, " ") + "---------\nResponse:" +
	            				response.status.code +"\n" +JSON.stringify(response.headers, null, " ") +
	            				response.entity,
	            			status: response.status.code,
	            			headers: response.headers,
	            		}
                  return Q.reject(e);
                }
				console.log(response.entity);
								var decoder = new StringDecoder('utf8');
								var entity = response.entity + ""
								entity = unescape(entity.replace(/\\u/g, '%u') );

								debug("SPARQL Result Entity:", entity)
                return response.headers['Content-Type'].indexOf('text/plain') == 0 ? jsonld.fromRDF(entity, {format: 'application/nquads'}) : response.entity;
            }
    });

}

String.prototype.iri = function(base, bare){
	var v = base ? url.resolve(base, this + "") : this +"";
	return bare ? v : "<" + decodeURI(v) + ">";
}

String.prototype.lit = function(){
	return '"' + this + '"';
}
