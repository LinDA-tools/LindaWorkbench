App.DatasourceController = Ember.ObjectController.extend({
    treeContent: function () {
        console.log('DATASOURCE CONTROLLER');
        // console.log(this.get('model'));

        var dataInfo = this.get('model'); // data sources

        if (!dataInfo)
            return{};

        this.set('selectedDatasource', dataInfo);
        // console.log('DATASOURCE');
        // console.dir(dataInfo);

        var previousSelection = this.get('previousSelection');
        //this.set('dataSelection', []);

        if (previousSelection.length === 0) {
            return treeselection_data.initialize(dataInfo);
        } else {
            return treeselection_data.restore(dataInfo, previousSelection);
        }
    }.property('model', 'previousSelection'),
    previousSelection: [],
    dataSelection: [],
    selectedDatasource: null,
    resetSelection: function () {
        this.get('dataSelection').length = 0;
    }.observes('model'),
    actions: {
        visualize: function () {
            var self = this;
            var selection = this.get('dataSelection');
            var datasource = this.get('selectedDatasource');
            var selected = treeselection_data.getDataSelection(selection, datasource);
            var dataselection = this.store.createRecord('dataselection', selected);

            dataselection.save().then(function (responseDataselection) {
                console.log("SAVED DATA SELECTION. TRANSITION TO VISUALIZATION ROUTE .....");
                console.dir(responseDataselection);
                self.transitionToRoute('visualization', 'dataselection', responseDataselection.id);
            });
        }
    }
});
