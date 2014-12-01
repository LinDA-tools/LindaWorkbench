App.ConfigureVisualizationView = Ember.View.extend({
    strOptionsConfVis: null, 
    confVis: null,
    dsConfVis: null,
    templateName:'configureVisualization',
    createTreeContent: function() {
        console.log('configure visualization view');
        var datasource = this.get('dsConfVis'); 

        if (!datasource)
            return {};

        console.log("datasource");
        console.dir(datasource);

        var treedata = tree_data.create(datasource);
        console.log("treedata: ");
        console.dir(treedata);
        return treedata;
    }.property('datasource')
});


