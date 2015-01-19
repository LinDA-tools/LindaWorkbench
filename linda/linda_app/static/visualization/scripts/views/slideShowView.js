App.SlideShowView = Ember.View.extend({
    slides: null,
    templateName:'slideShow',
    classNames:['slider'],
    didInsertElement: function() {
        this._super();
        
        console.log("Inserted slideshow: ");
        console.dir(this.get('slides'));
        
        this.$().slick({
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 1
        });   
    },
    willDestroyElement: function() {
        console.log("Removing slideshow");
        this.$().unslick(); 
    }
});


