App.LoadVisualizationRoute = Ember.Route.extend({
    // "params" contains the parameters for the visualization route.  
    // The parameters are specified in the router.js.
    // The backend needs the datasource id only for the suggestion algorithm.
    model: function (params) {
        return this.store.find('visualization', {source_type: "visualizationConfiguration"}).then(function (visualizations) {
            console.log("Stored visualizations:");
            console.dir(visualizations);
            return visualizations;
        });
    }
});