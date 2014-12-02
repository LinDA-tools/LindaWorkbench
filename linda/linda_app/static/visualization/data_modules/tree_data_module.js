var tree_data = function() {

    /* first level: data source
     *  second level: csv dummy or classes 
     *  third ... n level: class properties or columns
     *  Iterate over subsets (in case of csv is just one subset; in case of RDF the subset are the classes */
    function create(datasource) {
        console.log('Creating tree content ...');
        console.dir(datasource);

        var treeContent = Ember.Object.create({
            label: 'ROOT',
            children: [],
            type: 'root',
            getChildren: function(node) {
                return node.children;
            },
            data: {}
        });

        var node = Ember.Object.create({
            label: datasource.name,
            expanded: true,
            draggable: "false",
            children: [],
            type: "datasource",
            getChildren: function(node) {
                var result = DS.PromiseArray.create({
                    promise: getNodeChildren(node)
                });
                return result;
            },
            data: {
                parent: [],
                label: datasource.name,
                location: datasource.location,
                format: datasource.format
            }
        });
        treeContent.children.push(node);

        return treeContent;
    }

    function branch(node, subsets, parent, format, location) {
        var children = [];

        for (var i = 0; i < subsets.length; i++) {
            var subset = subsets[i];
            children.push(Ember.Object.create({
                label: subset.label,
                expanded: (subsets.length === 1),
                draggable: (parent.length > 0) ? "true" : "false", // only properties are draggable, classes are not
                children: [],
                type: "item",
                parentNode: node,
                getChildren: function(node) {
                    var result = DS.PromiseArray.create({
                        promise: getNodeChildren(node).then(function(children) {
                            node.set('children', children);
                            return children;
                        })
                    });
                    return result;
                },
                data: {
                    parent: parent.concat([subset.id]),
                    id: subset.id,
                    label: subset.label,
                    format: format,
                    location: location
                }
            }));
        }

        return children;
    }

    function getDataModule(format) {
        switch (format) {
            case 'csv':
                return csv_data_module;
            case 'rdf':
                return sparql_data_module;
        }
        console.error("Unknown data format '" + format + "'");
        return null;
    }

    function getNodeChildren(node) {
        var data_module = getDataModule(node.data.format);
        var _class = node.data.parent[0];
        var _properties = node.data.parent.slice(1, node.data.parent.length);

        return data_module.queryData(node.data.location, _class, _properties).then(function(subsetInfo) {
            if (subsetInfo.length === 0) {
                node.isLeaf = true;
                return [];
            } else {
                var children = branch(node, subsetInfo, node.data.parent, node.data.format, node.data.location);
                return children;
            }
        });
    }

    return {
        create: create
    };
}();

