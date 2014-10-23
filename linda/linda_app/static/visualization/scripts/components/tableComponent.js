App.DataTableComponent = Ember.Component.extend({
    tagName: 'table',
    content: [],
    columns: [],
    table: null,
    setContent: function() {
        var self = this;
        var list = this.get('list');

        if (list.length > 0) {
            var columns = table_data.getColumns(list);

            table_data.getContent(list).then(function(content) {
                var table = self.get('table');

                if (table) {
                    table.api().clear().destroy();
                    $(self.get('element')).empty();
                }

                var table = $(self.get('element')).dataTable({
                    "data": content,
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

    }.observes('list.[]')
});