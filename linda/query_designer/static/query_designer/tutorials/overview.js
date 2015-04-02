    var tutorial_step = 1;

    //#1: Welcome users to the tutorial
    $('#toolbar .chosen-container').tooltipster({
        content: '<h6>Welcome to LinDA Query designer!</h6>At the end of this tutorial, you\'ll be able to make complex queries on linked data sources with a few easy steps!<br />To start this tutorial, choose the <span class="green-text">IMDB</span> data source.',
        trigger: 'custom', // default is 'hover' which is no good here
        contentAsHTML: true,
        position: 'bottom'
    });

    //show after a while
    setTimeout(function() {$('.chosen-container').tooltipster('show');}, 2000);
    tutorial_step++;

    //#2: User clicks on data sources
    $('#toolbar').on('click', '.chosen-container', function() {
        if (tutorial_step == 2) {
            //remove prev
            $('#toolbar .chosen-container').tooltipster('destroy');

            $('#toolbar .chosen-container').tooltipster({
                content: 'You can also search for a data source by typing<br />Try searching for "<span class=\"green-text\">imdb</span>" and select the result',
                trigger: 'custom',
                contentAsHTML: true,
                position: 'right'
            });
            $('.chosen-container').tooltipster('show');

            //go to next step
            tutorial_step++;
        }
    });

    //#3: Classes appear
    $('#toolbar select').on('change', function() {
        if (tutorial_step == 3) {
            //remove prev
            $('#toolbar .chosen-container').tooltipster('destroy');

            var that = this;
            setTimeout(function() {
                if ($(that).val() == "imdb") {
                    $('#toolbar').tooltipster({
                        content: 'When you select a data source, the different types of objects in the datasource start to appear in the above area (named <i>toolbar</i>).<br />Buttons such as "<span class=\"green-text\">Film</span>" and "<span class=\"green-text\">Actor</span>" should have appeared by now in the toolbar.<br />Drag and drop the "<span class=\"green-text\">Film</span>" button in the white are bellow to find films in IMDB.',
                        trigger: 'custom',
                        contentAsHTML: true,
                        position: 'bottom'
                    });
                    $('#toolbar').tooltipster('show');

                    //go to next step
                    on_toolbar_load();
                    tutorial_step++;
                } else {
                    $('#toolbar').tooltipster({
                        content: 'That doesn\'t really look like IMDB\'s data source, right?<br />Anyway, feel free to play around! We\'ll continue when you choose <b>IMDB</b>.',
                        trigger: 'custom',
                        contentAsHTML: true,
                        position: 'bottom'
                    });
                    $('#toolbar').tooltipster('show');
                }
            }, 2000);
        }
    });

    //#4: User adds a "Film" instance
    function on_toolbar_load() {
        //check every half second if the class was created
        //much simpler than manipulating on drop event, while not really resource gready
        var interval = setInterval(function() {
            if (builder_workbench.instances.length > 0) { //new instance
                //stop waiting
                clearInterval(interval);

                //remove prev
                 $('#toolbar').tooltipster('destroy');

                console.log(builder_workbench.instances[0].uri);
                if (builder_workbench.instances[0].uri == "http://data.linkedmdb.org/resource/movie/film") {
                    $('#class_instance_0').tooltipster({
                        content: 'Adding a <span class=\"green-text\">Film</span> instance in the workspace will create a query that gets all films found in the IMDB data source.',
                        trigger: 'custom',
                        contentAsHTML: true,
                        position: 'top'
                    });
                    $('#class_instance_0').tooltipster('show');

                    //show after a while
                    setTimeout(on_instance_add, 7000);
                }
            }
        }, 500);
    }

    //#5: User adds film properties
    function on_instance_add() {
        //remove prev
        $('#class_instance_0').tooltipster('destroy');

        $('#class_instance_0 .property-control').tooltipster({
            content: 'By default the result will contain the film\'s URI, which works like an ID.<br />We want to really find out about those films, so let\'s add some film <em>properties</em>.<br />Choose <span class="green-text">label</span> and <span class="green-text">release date</span> from the properties.',
            trigger: 'custom',
            contentAsHTML: true,
            position: 'right'
        });
        $('#class_instance_0 .property-control').tooltipster('show');

        var that = $('#class_instance_0 .property-control');
        var position_interval = setInterval(function() {
            $(".tooltipster-base").css('left', $(that).offset().left + (that).outerWidth() + 15);
            $(".tooltipster-base").css('top', $(that).offset().top - 5);
        }, 500);
    }