App.VisualizationRoute = Ember.Route.extend({
    // "params" contains the parameters for the visualization route.  
    // The parameters are specified in the router.js.
    // The backend needs the datasource id only for the suggestion algorithm.
    model: function(params) { 
        console.log("Requesting visualization model and recommendations from the backend for the data source " + params.name);
        return this.store.find('visualization', {name: params.name, location: params.location, graph: params.graph, format:params.format}).then(function(recommendations) {
            console.log("Recommendations:");
            console.dir(recommendations);
            return recommendations;
        });
    }
});