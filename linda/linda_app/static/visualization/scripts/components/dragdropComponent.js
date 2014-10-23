// DRAG AND DROP 
App.DroppableAreaComponent = Ember.Component.extend({
    dragOver: function(event) {
        event.stopPropagation();
        event.preventDefault();
    },
    drop: function(event) {
        event.stopPropagation();
        event.preventDefault();
        var droppableJSON = event.dataTransfer.getData('text/plain');
        console.log('DROPPABLE');
        console.dir(JSON.parse(droppableJSON));
        var droppable = JSON.parse(droppableJSON);
        var inArea = this.get('inArea');
        for (var i = 0; i < inArea.length; i++) {
            if (inArea[i].id === droppable.id) {
                return;
            }
        }
        this.get('inArea').pushObject(droppable);
    }
});

// ITEMS COMPONENT 
App.PropertyItemComponent = Ember.Component.extend({
    remove: function() {
        console.log('REMOVE');
        var collection = this.get('collection'); //collection = inArea
        var item = this.get('item');

        console.dir(collection);
        console.dir(item);

        collection.removeObject(item);

    }
});
