
    //introductory text
    $().ready(function() {
        tooltip('#toolbar',
                'In this tutorial, we will explore how you can combine data from multiple data sources using sub-queries.',
                'bottom'
        );

        setTimeout(function(){
            tooltip('#toolbar',
                'Assume finding yourself in a situation where your customer data can be found in two different locations.<br /><br />' +
                'If you explore the data sources, you will see two different sources named <span class="text-green">Clients #1</span> and <span class="text-green">Clients #2</span>.<br />' +
                'Let\'s find out how we can <span class="text-red">combine</span> both client bases in a single query.',
                'bottom'
            );

            //prompt to add clients from #1
            setTimeout(function(){
                tooltip('#toolbar .chosen-container',
                    'Open <span class="text-green">Clients #1</span> and add a Person instance by dragging the "Person" button to the workspace.',
                    'bottom'
                );

                //wait for the class to be added
                wait_new_instance("http://xmlns.com/foaf/0.1/Person", function() {
                    tooltip('#class_instance_0',
                        'Nice!',
                        'right'
                    );

                    setTimeout(function(){
                        tooltip('#toolbar .chosen-container',
                            'Now open <span class="text-green">Clients #2</span> and also add the Person class.',
                            'bottom'
                        );

                         //wait for the second class to be added
                         wait_new_instance("http://xmlns.com/foaf/0.1/Person", function() {
                            tooltip('#class_instance_1',
                                'In both classes add the <span class="text-green">Has Tax Id</span> property and run the query (F9).',
                                'top'
                            );

                            //wait for results to fill
                            var interval =  setInterval(function() {
                                if ($("#sparql_results_table tbody tr").length > 0) {
                                    clearInterval(interval);

                                    tooltip('#sparql_results_table',
                                        'As you can see, there is a <em>small</em> problem here...',
                                        'top'
                                    );

                                    setTimeout(function(){
                                        tooltip('#sparql_results_table',
                                            'Without any further information on how to combine the clients from the two different data sources, the Query Designer believes you want a <span class="text-red">join</span> of the results.',
                                            'top'
                                        );

                                        setTimeout(function(){
                                            tooltip('#sparql_results_table',
                                                'We must specify that we want to <em>append</em> people from the Clients <span class="text-red">#1</span> and <span class="text-red">#2</span> sources.<br />' +
                                                'We can achieve this if we use two <span class="text-red">subqueries</span>, <b>A</b> and <b>B</b>, and get their <em>Union</em> as a result.',
                                                'top'
                                            );

                                            //scroll to query options & wait user to click it
                                            $('html,body').animate({
                                                scrollTop: $("#show-query-options").offset().top - 200
                                            });

                                            tooltip('#show-query-options',
                                                'Click the <span class="text-red">Query options</span> button.',
                                                'left'
                                            );

                                            wait_query_options_show()
                                        }, INTERVAL_VERY_LONG);
                                    }, INTERVAL_SHORT);
                                }
                            }, 500);
                         });
                    }, INTERVAL_VERY_SHORT);
                });
            }, INTERVAL_VERY_LONG);
        }, INTERVAL_VERY_LONG);
    });

    function wait_query_options_show() {
        var interval = setInterval(function(){
            if ($('.ui-dialog[aria-describedby="builder-options"]').css('display') == "block") {
                clearInterval(interval);

                //query_pattern
                tooltip('#query_pattern',
                    '<p>In the pattern box, fill out how the different sub-queries should be combined. Type <span class="text-green">A+B</span> and click OK.</p>' +
                    '<em>Hint: The + symbol stands for <span class="red text-white">UNION</span> and - for <span class="red text-white">MINUS</span>. You can also use parenthesis to prioritize operations.</em>',
                    'right'
                );

                //wait dialog to hide
                var interval2 = setInterval(function(){
                    if ($('.ui-dialog[aria-describedby="builder-options"]').css('display') == "none") {
                        clearInterval(interval2);

                        tooltip('#class_instance_0 .subquery-select',
                            '<p>Now let\'s specify how to create the sub-queries A and B. Click on the upper-left corner of the Person from Clients #1 bellow and choose the <span class="text-green">A</span> sub-query.',
                            'bottom'
                        );

                        //wait for selection
                        var interval3 = setInterval(function(){
                            if ($('#class_instance_0 .subquery-select').text() === "A") {
                                clearInterval(interval3);

                                tooltip('#class_instance_1 .subquery-select',
                                    'Do the same for the Person instance from Clients #2 data source but this time select the sub-query <span class="text-green">B</span>.',
                                    'bottom'
                                );

                                var interval4 = setInterval(function(){
                                    if ($('#class_instance_1 .subquery-select').text() === "B") {
                                        clearInterval(interval4);

                                        tooltip('.designer-button.run-button',
                                            'Run the query.',
                                            'right'
                                        );

                                        wait_for_results();
                                    }
                                }, 500);
                            }
                        }, 500);
                    }
                }, 500);
            }
        }, 500);
    }

    function wait_for_results() {
        //clear results table
        $("#sparql_results_table tbody").html('');

        //wait for it to fill again
        var interval = setInterval(function() {
            if ($("#sparql_results_table tbody tr").length > 0) {
                clearInterval(interval);

                tooltip('#sparql_results_table',
                    'Fantastic!',
                    'top'
                );

                setTimeout(function(){
                    tooltip('#sparql_results_table',
                        'The Tax Id property was also automatically merged in one column as it was based on the same URI.<br />' +
                        'If you wanted to merge completely different properties, right click on them, select <span class="text-green">Options</span> and give them the same name.',
                        'top'
                    );

                    setTimeout(function(){
                        tooltip('#sparql_results_table',
                            'In order to limit the number of results, we have to also change some query options. Click on the <span class="text-green">Query options</span> button again.',
                            'top'
                        );

                        var interval = setInterval(function(){
                            if ($('.ui-dialog[aria-describedby="builder-options"]').css('display') == "block") {
                                clearInterval(interval);

                                tooltip('#query_limit',
                                    'Type <span class="text-green">3</span> in the <span class="text-red">Limit</span> option to limit the number of results.',
                                    'left'
                                );

                                //wait for user to type "3"
                                var interval2 = setInterval(function(){
                                    if ($("#query_limit").val() == "3") {
                                        clearInterval(interval2);

                                        tooltip('#query_offset',
                                            'You can also skip some results using the <span class="text-red">Offset</span> option. Type <span class="text-green">1</span> and click <span class="text-green">OK</span>.',
                                            'left'
                                        );

                                        var interval3 = setInterval(function(){
                                            if ($('.ui-dialog[aria-describedby="builder-options"]').css('display') == "none") {
                                                clearInterval(interval3);

                                                tooltip('.designer-button.run-button',
                                                    'Run the query once again.',
                                                    'right'
                                                );
                                            }
                                        }, 500);
                                    }
                                }, 500);
                            }
                        }, 500);
                    }, INTERVAL_VERY_LONG)
                }, INTERVAL_VERY_SHORT);
            }
        }, 500);
    }
