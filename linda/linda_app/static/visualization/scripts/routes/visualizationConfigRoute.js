App.VisualizationConfigRoute = Ember.Route.extend({
    // "params" contains the parameters for the visualization route.  
    // The parameters are specified in the router.js.
    // The backend needs the datasource id only for the suggestion algorithm.
    model: function (params) {
         console.log("LOAD VISUALIZATION VISUALIZATIONS");
         console.dir(params);
        return this.store.find('visualization', {source_type: "visualizationConfiguration"}).then(function (visualizations) {
            console.log("STORED VISUALIZATIONS");
            console.dir(visualizations);
            return visualizations;
        });
    }
});