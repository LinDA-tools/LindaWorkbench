App.SlideShowView = Ember.View.extend({
    slides: null,
    templateName:'slideShow',
    classNames:['slider'],
    didInsertElement: function() {
        this._super();
        $('.slider').slick({
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 1
        });   
    }
});


