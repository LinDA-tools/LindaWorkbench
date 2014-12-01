App.Store = DS.Store.extend({
    revision: 13,
    adapter: DS.RESTAdapter.extend({
        host: 'http://localhost:3002'
    })
});

