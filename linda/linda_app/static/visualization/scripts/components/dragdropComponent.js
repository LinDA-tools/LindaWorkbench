App.DraggableItemComponent = Ember.Component.extend({
    tagName: 'span',
    classNames: ['draggable-item'],
    attributeBindings: ['draggable'],
    draggable: 'true',
    dragStart: function (event) {
        event.stopPropagation();
        var data = this.get('data');
        var jsonData = JSON.stringify(data);
        event.dataTransfer.setData('text/plain', jsonData);
        event.dataTransfer.effectAllowed = "copy";
    },
});

App.DroppableAreaComponent = Ember.Component.extend({
    dragOver: function (event) {
        event.stopPropagation();
        event.preventDefault();
    },
    drop: function (event, ui) {
        event.stopPropagation();
        event.preventDefault();
        var droppableJSON = event.dataTransfer.getData('text/plain');
        console.log('DROPPED: ' + droppableJSON);

        var droppable;
        try {
            droppable = JSON.parse(droppableJSON);
        } catch (error) {
            console.log(error);
            return;
        }

        var inArea = this.get('inArea');

        if (this.isFull()) {
            return;
        }

        for (var i = 0; i < inArea.length; i++) {
            var existingJSON = JSON.stringify(inArea[i]);
            if (existingJSON === droppableJSON) {
                return;
            }
        }
        inArea.pushObject(droppable);
    },
    classNames: ['droppable-area'],
    classNameBindings: ['full', 'active'],
    active: false,
    isFull: function () {
        // var maxNumItems = this.get('maxNumItems')
        // var inArea = this.get('inArea');
        // if (typeof maxNumItems !== 'undefined' && inArea.length >= maxNumItems) {
        //     return true;
        // }
        return false;
    },
    full: function () {
        return this.isFull();
    }.property('maxNumItems', 'inArea.@each'),
    dragEnter: function (event) {
        console.log(event.type);
        this.set('active', true);
    },
    deactivate: function (event) {
        console.log(event.type);
        this.set('active', false);
    }.on('dragLeave', 'dragStop', 'drop')
});

App.PropertyItemComponent = Ember.Component.extend({
    remove: function () {
        console.log('REMOVE');
        var collection = this.get('collection'); //collection = inArea
        var item = this.get('item');

        console.dir(collection);
        console.dir(item);

        collection.removeObject(item);

    }
});
