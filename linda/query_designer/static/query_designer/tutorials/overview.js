    var tutorial_step = 1;

    //#1: Welcome users to the tutorial
    setTimeout(function() {
        tooltip('#toolbar .chosen-container',
                '<h6>Welcome to LinDA Query designer!</h6>At the end of this tutorial, you\'ll be able to make complex queries on linked data sources with a few easy steps!<br />To start this tutorial, choose the <span class="green-text">IMDB</span> data source.',
                'bottom'
        );
    }, 1000);
    tutorial_step++;

    //#2: User clicks on data sources
    $('#toolbar').on('click', '.chosen-container', function() {
        if (tutorial_step == 2) {
            tooltip('#toolbar .chosen-container',
                    'You can also search for a data source by typing<br />Try searching for "<span class=\"green-text\">imdb</span>" and select the result',
                    'right'
            );

            //go to next step
            tutorial_step++;
        }
    });

    //#3: Classes appear
    $('#toolbar select').on('change', function() {
        if (tutorial_step == 3) {
            toolbar_destroy();

            var that = this;
            setTimeout(function() {
                if ($(that).val() == "http%3A%2F%2Fdata.linkedmdb.org%2Fsparql") {
                    tooltip('#toolbar',
                            'When you select a data source, the different types of objects in the datasource start to appear in the above area (named <i>toolbar</i>).<br />Buttons such as "<span class=\"green-text\">Film</span>" and "<span class=\"green-text\">Actor</span>" should have appeared by now in the toolbar.<br />Drag and drop the "<span class=\"green-text\">Film</span>" button in the white are bellow to find films in IMDB.',
                            'bottom'
                    );

                    //go to next step
                    on_toolbar_load();
                    tutorial_step++;
                } else {
                    tooltip('#toolbar',
                            'That doesn\'t really look like IMDB\'s data source, right?<br />Anyway, feel free to play around! We\'ll continue when you choose <b>IMDB</b>.',
                            'bottom'
                    );
                }
            }, 2000);
        }
    });

    //#4: User adds a "Film" instance
    function on_toolbar_load() {
        //check every half second if the class was created
        //much simpler than manipulating on drop event, while not really resource greedy
        var interval = setInterval(function() {
            if (builder_workbench.instances.length > 0) { //new instance
                if (builder_workbench.instances[0].uri == "http://data.linkedmdb.org/resource/movie/film") {
                    //stop waiting
                    clearInterval(interval);

                    tooltip('#class_instance_0',
                            'Adding a <span class=\"green-text\">Film</span> instance in the workspace will create a query that gets all films found in the IMDB data source.',
                            'top'
                    );

                    //show after a while
                    setTimeout(on_film_add, INTERVAL_VERY_LONG);
                }
            }
        }, 500);
    }

    //#5: User adds film properties
    function on_film_add() {
        tooltip('#class_instance_0 .property-control',
                'By default the result will contain the film\'s URI, which works like an ID.<br />We want to really find out about those films, so let\'s add some film <em>properties</em>.<br />Choose <span class="green-text">label</span> and <span class="green-text">initial release date</span> from the properties.<br /><br /><em>Hint: You can search for properties by typing in the <span class="green-text">find property</span> box.</em>',
                'right'

        );

        var that = $('#class_instance_0 .property-control');
        var interval = setInterval(function() {
            //$(".tooltipster-base").css('left', $(that).offset().left + (that).outerWidth() + 10);
            //$(".tooltipster-base").css('top', $(that).offset().top - 7);
            $('#class_instance_0 .property-control').tooltipster('reposition');

            if (check_properties(0, ["http://www.w3.org/2000/01/rdf-schema#label", "http://data.linkedmdb.org/resource/movie/initial_release_date"])) {
                //stop waiting
                clearInterval(interval);

                //move to step 6
                tutorial_step = 6;
                run_query();
            }
        }, 500);
    }

    //#6: Run query
    function run_query() {
        tooltip('.designer-button.run-button',
                'With the <span class="green-text">run</span> button, you can execute the query.<br />Click run to view the results!',
                'right'
        );

        var interval = setInterval(function() {
            if ($("#sparql_results_table tbody tr").length > 0) { //results have been returned
                clearInterval(interval);
                tutorial_step++;
                results_appear();
            }
        }, 500);
    }

    //#7: Results appear
    function results_appear() {
        tooltip('#sparql_results_table th:nth-of-type(3)',
                'Can you see all these films? Nice job!<br />',
                'top'
        );

        setTimeout(function() {
            tooltip("#sparql_results_table tbody tr:nth-of-type(10) td:nth-of-type(4)",
                    'Wow, some of these movies are <em>old</em>...',
                    'left'
            );

            setTimeout(function() {
                tooltip(".results-next-container",
                        'By default you can only see the first 100 results, but you can always move between result pages from here.',
                        'bottom'
                );

                //scroll to paginator
                $('html,body').animate({
                    scrollTop: $(".results-next-container").offset().top - 40
                });

                setTimeout(hide_uris, INTERVAL_LONG);
            }, INTERVAL_LONG);
        }, INTERVAL_SHORT);
    }

    //#8: Hide URIs
    function hide_uris() {
        tutorial_step++;

        tooltip("#sparql_results_table th:nth-of-type(2)",
                'Is there any real need for those URIs to mess up with our pretty table? Let\'s throw them away!',
                'top'
        );

        setTimeout(function() {
            //scroll to film
            $('html,body').animate({
                scrollTop: $("#class_instance_0").offset().top - 200
            });

            tooltip("#class_instance_0 .header-row span:nth-of-type(1)",
                'From the <span class="green-text">shown</span> column you can decide if a property will be shown in the results or not.<br />The film\'s URI is still in the query to identify each film, but it\'s not presented.<br />Try to <span class="green-text">uncheck</span> the shown option of the URI and <span class="green-text">run</span> the query again.<br /><br /><em>Hint: you may also press <span class="green-text">F9</span> to run the query</em>',
                'top'
            );

            //wait for new results
            var interval = setInterval(function () {
                var th = $("#sparql_results_table th");
                var uri_removed = true;
                for (var i=0; i<th.length; i++) {
                    if ($(th[i]).html() == "Film") { //nope - still there
                        uri_removed = false;
                        break;
                    }
                }

                if (uri_removed) {
                    clearInterval(interval);
                    on_uri_removed();
                }
            }, 500);
        }, INTERVAL_NORMAL);
    }

    //#9: New results
    function on_uri_removed() {
        tooltip("#sparql_results_table",
                'There you go!',
                'top'
        );

        setTimeout(function() {
            tooltip("#sparql_results_table",
                'Now let\'s try something new! What if we wanted to see which actors have performed in every film?',
                'top'
            );

            setTimeout(function() {
                //scroll to instance
                $('html,body').animate({
                    scrollTop: 0
                });

                tooltip("#toolbar",
                    'Drag and drop the <span class="green-text">Actor</span> class in the workspace.',
                    'bottom'
                );

                //wait for actor
                var interval = setInterval(function() {
                    if (builder_workbench.instances.length > 1) { //new instance
                        if (builder_workbench.instances[1].uri == "http://data.linkedmdb.org/resource/movie/actor") {
                            //stop waiting
                            clearInterval(interval);

                            tooltip('#toolbar input[type="search"]',
                                    'You can always use this search to find <em>classes</em> in your data source',
                                    'bottom'
                            );

                            //show after a while
                            setTimeout(on_actor_added, INTERVAL_NORMAL);
                        }
                    }
                }, 500);
            }, INTERVAL_LONG);
        }, INTERVAL_SHORT);
    }

    //#10: Create connection between films and actors
    function on_actor_added() {
        tutorial_step++;

        tooltip('#class_instance_1',
                'Here you have also added <span class="green-text">Actors</span> in the query. You have to specify a <b><em>connection</em><b> between films and their actors...',
                'top'
        );

        setTimeout(function() {
            tooltip('#class_instance_0 .property-control',
                'Add the actor property to the film.',
                'right'
            );

            //wait for the actor property to be added
            var interval = setInterval(function() {
                if (check_properties(0, ["http://www.w3.org/2000/01/rdf-schema#label", "http://data.linkedmdb.org/resource/movie/initial_release_date", "http://data.linkedmdb.org/resource/movie/actor"])) {
                    tutorial_step++;

                    clearInterval(interval);
                    add_connection();
                }
            }, 500);
        }, INTERVAL_VERY_LONG);
    }

    function add_connection() {
        tooltip('#class_instance_0 .header-row span:nth-of-type(6)',
                'The <em>Foreign</em> column is used to add <span class="green-text">foreign key</span> connections.<br />When the arrow enters a property you can see an <b>add</b> link.',
                'top'
        );

        setTimeout(function() {
            tooltip('#class_instance_0 .property-row:last-of-type',
                    'Click the <span class="green-text">add</span> foreign key link',
                    'right'
            );

            //wait for the actor property to be added
            var interval = setInterval(function() {
                if (typeof(builder_workbench.connection_from) != "undefined") {
                    clearInterval(interval);

                    tooltip('#class_instance_1 .title',
                            'Now click the Actor\'s title to create the connection',
                            'top'
                    );

                    //wait for the connection to be created
                    var interval2 = setInterval(function() {
                        if ((arrows.connections.length > 0) && (builder_workbench.connection_from === undefined)) {
                            tutorial_step++;

                            clearInterval(interval2);
                            add_actor_label();
                        }
                    }, 500);
                }
            }, 500);
        }, INTERVAL_NORMAL)
    }

    function add_actor_label() {
        tooltip('#class_instance_1 .property-control',
                'Fantastic!<br />Now add the actor\'s label, hide their URI and run the query again.',
                'right'
        );

        //clear results table
        $("#sparql_results_table tbody").html('');

        //wait for it to fill again
        var interval = setInterval(function() {
            if ($("#sparql_results_table tbody tr").length > 0) {
                clearInterval(interval);

                tooltip('#sparql_results_table',
                        'Alright! Now let\'s order the results by film name, shall we?',
                        'top'
                );

                setTimeout(function(){
                    //scroll to film
                    $('html,body').animate({
                        scrollTop: $("#class_instance_0").offset().top - 200
                    });

                    tooltip('#class_instance_0 .header-row span:nth-of-type(4)',
                            'You can order results by setting the <span class="green-text">order by</span> option.<br />Set the label\'s order by to <span class="green-text">ASC</span> and run one more time.<br />There are also options for numbers and dates, no need for them right now...',
                            'top'
                    );

                    //clear results table
                    $("#sparql_results_table tbody").html('');

                    //wait for it to fill again
                    var interval2 = setInterval(function() {
                        if ($("#sparql_results_table tbody tr").length > 0) {
                            clearInterval(interval2);

                            tooltip('#sparql_results_table',
                                    'Awesome!',
                                    'top'
                            );

                            setTimeout(function() {
                                tooltip('#sparql_results_table',
                                        'It seems you\'re querying like a boss! Click <a href="/query-designer/tutorials/filters_and_aggregates/">here</a> to move to the next tutorial!',
                                        'top'
                                );
                            }, INTERVAL_VERY_SHORT);
                        }
                    }, 500);
                }, INTERVAL_NORMAL);
            }
        }, 500);
    }