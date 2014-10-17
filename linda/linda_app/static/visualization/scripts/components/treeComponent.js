// TREE VIEW
App.TreeBranchComponent = Ember.Component.extend({
    tagName: 'ul',
    classNames: ['tree-branch'],
    children: function() {
        var node = this.get('node');

        if (node.getChildren) {
            return node.getChildren(node);
        } else {
            return [];
        }
    }.property('node')
});

App.TreeNodeComponent = Ember.Component.extend({
    tagName: 'li',
    classNames: ['tree-node'],
    init: function() {
        this._super();
        this.set('isExpanded', this.get('node.expanded') || false);
    },
    toggle: function() {
        var selection = this.get('node.selected');
        this.toggleProperty('isExpanded');
    },
    refreshSelection: function() {
        var sel = this.get('node.selected');
        var list = this.get('selection');
        var node = this.get('node');
        if (sel) {
            list.pushObject(node);
        } else {
            list.removeObject(node);
        }
    }.observes('selected').on('init'),
    expand: function() {
        var expanded = this.get('isExpanded');
        var list = this.get('expansion');
        var node = this.get('node');
        var children = node.children;

        if (expanded) {
            list.setObjects(children);
        } 

    }.observes('node.children').on('init'),
    
    collapse: function() {
        var expanded = this.get('isExpanded');

        if (!expanded) {
            this.set('expansion', []);
        }

    }.observes('isExpanded'),
    dragStart: function(event) {
        if (!this.get('draggable')) {
            return;
        }

        event.stopPropagation();
        var data = this.get('node.data');
        
        event.dataTransfer.setData('text/plain', JSON.stringify(data));
        event.dataTransfer.effectAllowed = "copy";
    }
});