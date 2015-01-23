App.Store = DS.Store.extend({
    revision: 13,
    adapter: DS.RESTAdapter.extend({
        host: 'http://' + window.location.hostname + ':3002'
    })
});

