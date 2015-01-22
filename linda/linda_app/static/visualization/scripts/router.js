// router
App.Router.map(function() {
    this.route("visualization", {
        path: '/visualization/:source_type/:id'
    });
    this.route("datasource", {
        path: '/datasource/:name/:location/:graph/:format'
    });
    this.route("dataselection", {
        path: '/dataselection/:selection/:datasource'
    });
    this.route("visualizationConfig");
    this.route("configure");
});