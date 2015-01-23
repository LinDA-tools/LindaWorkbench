App.DataTableComponent = Ember.Component.extend({
    tagName: 'table',
    list: [],
    columns: [],
    classNames: ['no-wrap'],
    table: null,
    setContent: function() {
        console.log("TABLE COMPONENT - GENERATING PREVIEW");

        var self = this;
        var selection = this.get('preview');
        var datasource = this.get('datasource');

        if (selection.length > 0) {
            var columns = table_data.getColumns(selection, datasource);

            table_data.getContent(selection, datasource).then(function(content) {

                var table = self.get('table');
                if (table) {
                    table.api().clear().destroy();
                    $(self.get('element')).empty();
                }

                var table = $(self.get('element')).dataTable({
                    responsive: {
                        details: {
                            type: 'inline'
                        }
                    },                 
                    "data": content.slice(1),
                    "columns": columns
                });
                self.set('table', table);
            });

        } else {
            var table = self.get('table');
            if (table) {
                table.api().clear().destroy();
                $(self.get('element')).empty();
            }
        }
    }.observes('preview.[]').on('didInsertElement')
});