var tree_data = function() {
    // first level: csv dummy or classes second ... n level: class properties or columns
    // iterate over subsets (in case of csv is just one subset; in case of RDF the subset are the classes        
    function create(dataInfo) {
        var treeContent = Ember.Object.create({
            ID: '0000',
            label: 'ROOT',
            children: [],
            type: 'root',
            selected: false,
            getChildren: function(node) {
                return node.children;
            },
            data: {}
        });

        for (var i = 0; i < dataInfo.length; i++) { 
            var datasource = dataInfo[i];
            var node = Ember.Object.create({
                ID: datasource.get('id'),
                label: datasource.get('title'),
                expanded: false,
                selected: false,
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
                    label: datasource.get('title'),
                    location: datasource.get('location'),
                    format: datasource.get('format')
                }
            });
            treeContent.children.push(node);
        }
        return treeContent;
    }

    function branch(node, subsets, parent, format, location) {
        var children = [];

        for (var i = 0; i < subsets.length; i++) {
            var subset = subsets[i];
            children.push(Ember.Object.create({
                ID: subset.id,
                label: subset.label,
                draggable: false,
                selected: false,
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

