App.VisualizationRoute = Ember.Route.extend({
    // "params" contains the parameters for the visualization route.  
    // The parameters are specified in the router.js.
    // The backend needs the datasource id only for the suggestion algorithm.
    model: function (params) {
        console.log("Requesting visualization model and recommendations from the backend for {" + params.source_type + ", " + params.id + "}");
        console.dir(params);
        return this.store.find('visualization', {source_type: params.source_type, id: params.id}).then(function (visualizations) {
            console.log("Visualizations:");
            console.dir(visualizations);
            return visualizations;
        });
    }
});