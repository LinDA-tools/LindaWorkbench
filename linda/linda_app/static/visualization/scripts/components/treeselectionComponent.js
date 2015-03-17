App.TreeSelectionComponent = Ember.Component.extend({
    tagName: 'div',
    tree: null,
    setContent: function() {
        console.log("TREE SELECTION COMPONENT - CREATING SELECTION TREE");
        var content = this.get('treedata');
        var selection = this.get('selection');
        console.dir(JSON.stringify(selection));

        //selection = []; todo needs to be reset
        this.set('selection', selection);

        var self = this;

        $(this.get('element')).fancytree({
            extensions: ["filter", "glyph", "edit", "wide"],
            source: content,
            checkbox: true,
            icons:false,
            selectMode: 3,
            glyph: {
                map: {
                    //doc: "glyphicon glyphicon-file",
                    //docOpen: "glyphicon glyphicon-file",
                    checkbox: "glyphicon glyphicon-unchecked",
                    checkboxSelected: "glyphicon glyphicon-check",
                    checkboxUnknown: "glyphicon glyphicon-share",
                    error: "glyphicon glyphicon-warning-sign",
                    expanderClosed: "glyphicon glyphicon-plus-sign",
                    expanderLazy: "glyphicon glyphicon-plus-sign",
                    // expanderLazy: "glyphicon glyphicon-expand",
                    expanderOpen: "glyphicon glyphicon-minus-sign",
                    // expanderOpen: "glyphicon glyphicon-collapse-down",
                    //folder: "glyphicon glyphicon-folder-close",
                    //folderOpen: "glyphicon glyphicon-folder-open",
                    loading: "glyphicon glyphicon-refresh"
                            // loading: "icon-spinner icon-spin"
                }
            },
            wide: {
                iconWidth: "0.3em", // Adjust this if @fancy-icon-width != "16px"
                iconSpacing: "0.5em", // Adjust this if @fancy-icon-spacing != "3px"
                levelOfs: "1.5em"     // Adjust this if ul padding != "16px"
            },
            filter: {
                mode: "dimm",
                autoApply: true
            },
            lazyLoad: function(event, data) {
                console.log("TREE SELECTION COMPONENT - LOADING CHILDREN");
                console.log("DATA");
                console.dir(data);
                var node = data.node;
                var node_path = self.getNodePath(node);

                data.result = data.node.data._children.loadChildren(node_path.slice().reverse());
            },
            select: function(event, data) {
                console.log("TREE SELECTION COMPONENT - GENERATING PREVIEWS");
                var tree = data.tree;
                var node = data.node;
                var branch_root = self.getBranchRoot(node);
                var branch_root_title = branch_root.title;

                console.log('NODE');
                console.dir(node);
//
                var selected = tree.getSelectedNodes();

                console.log('SELECTED NODES');
                console.dir(selected);
//
                if (node.selected) {
                    tree.filterBranches(function(node) {
                        if (node.title === branch_root_title) {
                            return true;
                        } else {
                            node.hideCheckbox = true;
                            node.render(true);
                        }
                    });

                    var selected = tree.getSelectedNodes();

                    console.log('SELECTED NODES');
                    console.dir(selected);

                    for (var i = 0; i < selected.length; i++) {
                        var node_ = selected[i];
                        var node_path = self.getNodePath(node_).slice().reverse();
                        var path_labels = self.getNodePath(node_).slice().reverse();
                        var node_label = node_.title;
                        var node_key = node_.key;
                        var node_type = node_.data.type;
                        var node_role = node_.data.role;
                        var node_datatype = node_.data.datatype;

                        var already_selected = _.some(selection, function(value) {
                            return _.isEqual(value.parent, node_path);
                        });

                        if (!already_selected
                                && (node_.hideCheckbox === false)
                                && (node_type !== 'Class')) {

                            selection.pushObject(
                                    {
                                        label: node_label,
                                        key: node_key,
                                        type: node_type,
                                        role: node_role,
                                        parent: path_labels,
                                        datatype:node_datatype
                                    }
                            );
                        }
                    }
                } else {
                    var selected = tree.getSelectedNodes();

                    console.log('SELECTED NODES - ELSE');
                    console.dir(selected);

                    console.log('SELECTION');
                    console.dir(selection);

                    selection = _.filter(selection, function(item) {

                        var is_selected = false;

                        for (var i = 0; i < selected.length; i++) {
                            var node_ = selected[i];
                            var node_path = self.getNodePath(node_).slice().reverse();

                            if (!is_selected) {
                                is_selected = _.isEqual(item.parent, node_path);
                            }
                        }

                        return is_selected;
                    });

                    if (selected.length === 0) {
                        tree.clearFilter();
                        tree.visit(function(node) {
                            var type = node.data.type;
                            node.hideCheckbox = self.hideCheckbox(type);
                            node.render(true);
                        });
                    }
                }

                //console.log('DATA SELECTION');
                //console.dir(selection);

                self.set('selection', selection);
            }
        });
    }.observes('treedata').on('didInsertElement'),
    getNodePath: function(node) {
        var node_path_with_labels = [];
        node_path_with_labels.push({id: node.key, label: node.title});

        while (node.parent !== null) {
            node_path_with_labels.push({id: node.parent.key, label: node.parent.title});
            node = node.parent;
        }

        node_path_with_labels.pop(); // root id is not relevant

        return  node_path_with_labels;
    },
    getBranchRoot: function(node) {
        while (node.parent.title !== "root") {
            node = node.parent;
        }
        return node;
    },
    hideCheckbox: function(type) {
        switch (type) {
            case "Quantitative":
            case "Interval":
            case "Categorical":
            case "Nominal":
            case "Class":
                return false;
            case "Resource":
            case "Nothing":
                return true;
        }
        return null;
    }
});  