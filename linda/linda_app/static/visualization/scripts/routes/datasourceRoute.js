App.DatasourceRoute = Ember.Route.extend({
    model: function(params) {
        var ds = this.store.createRecord('datasource', {
            name: decodeURIComponent(params.name),
            location: decodeURIComponent(params.location),
            graph: decodeURIComponent(params.graph),
            format: decodeURIComponent(params.format)
        });
        return ds.save().then(function(data) {            
            return data._data;
        });
    }
});