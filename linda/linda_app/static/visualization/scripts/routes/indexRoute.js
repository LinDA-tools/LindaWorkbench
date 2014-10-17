App.IndexRoute = Ember.Route.extend({
    renderTemplate: function() {
        this._super(this, arguments);
        this.render('selectData', {
            outlet: 'selectData',
            into: 'index',
            controller: 'selectData'
        });
        this.render('visualizeData', {
            outlet: 'visualizeData',
            into: 'index',
            controller: 'visualizeData'
        });
    },
    setupController: function(controller, model) {   
     var self = this;
       this.store.find('datasource').then(function(response) {
            self.controllerFor('selectData').set('model', response.toArray());
        });       
        // this.controllerFor('visualizeData').set('model', selection);
    }

});
