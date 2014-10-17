App.SelectDataController = Ember.ArrayController.extend({
    itemController: 'datasource',
    treeContent: function() {
        var dataInfo = this.get('model'); // data sources

        if (!dataInfo || dataInfo.length === 0)
            return{};

        console.log("dataInfo");
        console.dir(dataInfo);

        return tree_data.create(dataInfo);
    }.property('model'),
    tableContent: [],
    dataSelection: [],
    actions: {
        visualize: function(selection) {
        }
    }
});

App.DatasourceController = Ember.ObjectController.extend({});
