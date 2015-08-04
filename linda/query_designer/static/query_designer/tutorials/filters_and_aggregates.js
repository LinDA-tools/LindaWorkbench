
    //automatically choose linked geodata
    $().ready(function() {
        $("#toolbar select").val('http%3A%2F%2Fwifo5-04.informatik.uni-mannheim.de%2Feurostat%2Fsparql').trigger("chosen:updated");
        update_tree_toolbar();
        on_datasource_select();
    });

    //#1: Welcome users to the tutorial
    setTimeout(function() {
        //scroll to top
        $('html,body').animate({
            scrollTop: 0
        });

        tooltip('#toolbar',
                'In this tutorial, you will learn how to filter results and calculate aggregates like sum or average.',
                'bottom'
        );

        setTimeout(function() {
            tooltip('#toolbar',
                'Start by adding a <span class="green-text">Countries</span> instance having the <span class="green-text">Level of internet access</span> and <span class="green-text">Geocode</span> property.',
                'bottom'
            );

            //wait for countries with geocode & internet access levels
            interval =  setInterval(function() {
                if (builder_workbench.instances.length == 1) { //new instance
                    if (builder_workbench.instances[0].uri == "http://wifo5-04.informatik.uni-mannheim.de/eurostat/resource/eurostat/countries") {
                        if (builder_workbench.instances[0].selected_properties.length == 3) {
                            if (check_properties(0, ["http://wifo5-04.informatik.uni-mannheim.de/eurostat/resource/eurostat/level_of_internet_access", "http://wifo5-04.informatik.uni-mannheim.de/eurostat/resource/eurostat/geocode"])) {
                                //stop waiting
                                clearInterval(interval);

                                tooltip('#class_instance_0',
                                    '<span class="green-text">Run</span> this query.',
                                    'left'
                                );

                                //wait for query to run
                                wait_initial_query();
                            }
                        }
                    }
                }
            }, 500);
        }, INTERVAL_VERY_LONG);
    }, INTERVAL_SHORT);

    function wait_initial_query() {
        //wait for results to fill
        interval =  setInterval(function() {
            if ($("#sparql_results_table tbody tr").length > 0) {
                clearInterval(interval);

                //mark results that must be removed
                $("#sparql_results_table tbody tr:nth-of-type(1)").addClass('result-removable');
                $("#sparql_results_table tbody tr:nth-of-type(2)").addClass('result-removable');
                $("#sparql_results_table tbody tr:nth-of-type(33)").addClass('result-removable');
                $("#sparql_results_table tbody tr:nth-of-type(34)").addClass('result-removable');

                tooltip('#sparql_results_table tbody',
                        'For this tutorial, we need to work only with actual countries, so we have to exclude regions like eu27, eu25 or the Euro area',
                        'top'
                );

                setTimeout(function() {
                    //scroll to countries
                    $('html,body').animate({
                        scrollTop: $("#class_instance_0").offset().top - 200
                    });

                    tooltip('#class_instance_0 .property-table .header-row span:nth-of-type(5)',
                        'On the Filter column, click the <span class="green-text">edit</span> link of the <span class="green-text">Geocode</span> property.',
                        'top'
                    );

                    //wait for filter dialog to open
                    wait_filter_dialog();
                }, INTERVAL_VERY_LONG);
            }
        }, 500);
    }

    function wait_filter_dialog() {
        interval =  setInterval(function() {
            if ($('.ui-dialog[aria-describedby="property-filters"]').css('display') != 'none') {
                clearInterval(interval);

                tooltip('.ui-dialog[aria-describedby="property-filters"]',
                        'In the filter dialog you can specify constraints to allow or exclude results.',
                        'left'
                );

                setTimeout(function() {
                    tooltip('.ui-dialog[aria-describedby="property-filters"] .select-filter-type select',
                            'Select the <em>String</em> filter type for the Geocode property.',
                            'top'
                    );

                    //wait for string type to be selected
                    interval =  setInterval(function() {
                        if ($('.ui-dialog[aria-describedby="property-filters"] .filter-type-str').css('display') != 'none') {
                            clearInterval(interval);

                            tooltip('.ui-dialog[aria-describedby="property-filters"] .filter-type-str',
                                    'In order to exclude all countries with a geocode starting with <em>eu</em>, follow these steps:<ul style="list-style: square; padding-left: 20px;"><li>From the list after <em>Values</em>, choose <em>starts with</em>.</li><li>Type <em>eu</em> in the input on the right, and</li><li>Click the <span class="green-text">+Add filter</span> button.</li></ul>',
                                    'top'
                            );

                            wait_for_filter_add();
                        }
                    }, 500);
                }, INTERVAL_VERY_LONG);
            }
        }, 500);
    }

    function wait_for_filter_add() {
        interval =  setInterval(function() {
            if (builder_workbench.property_selection.filters.length > 0) { //filter added
                var f = builder_workbench.property_selection.filters[0];
                if ((f.type == "str") && (f.operator == "starts") && (f.value == "eu")) { //check filter
                    clearInterval(interval);

                    tooltip('.ui-dialog[aria-describedby="property-filters"] #all-filters',
                            '<p>Now, let\'s create one more filter for countries that start with <em>ea</em>.</p><em>Hint: You can remove a filter by clicking on the X button that appears when you move the cursor in the filter\'s tag.</em>',
                            'top'
                    );

                    //wait for all filters
                    interval =  setInterval(function() {
                        if (builder_workbench.property_selection.filters.length == 2) {
                            var fs = builder_workbench.property_selection.filters;
                            if ((fs[1].type == "str") && (fs[1].operator == "starts") && (fs[1].value == "ea")) {
                                clearInterval(interval);

                                tooltip('.ui-dialog[aria-describedby="property-filters"] .filter-object:nth-of-type(2)',
                                        'Great!',
                                        'right'
                                );
                                setTimeout(function() {
                                    tooltip('.ui-dialog[aria-describedby="property-filters"] .filter-prototype',
                                            'Notice that we want all countries with geocodes that are <em>not</em> starting with the prefixes we specified.<br />We must specify that we want all these filters to be <span class="red" style="padding: 0 2px; font-family: \'Consolas\';">FALSE</span>.<br /><br />Choose the <em>All filters must be false</em> option.',
                                            'top'
                                    );

                                    //wait for user to choose nand
                                    interval =  setInterval(function() {
                                        if ($(".filter-prototype select").val() == "nand") {
                                            clearInterval(interval);

                                            //clear results table
                                            $("#sparql_results_table tbody").html('');

                                            tooltip('.ui-dialog[aria-describedby="property-filters"] .button.orange',
                                                    'Finally click save <b>Save & close</b> button.',
                                                    'right'
                                            );

                                            //wait for dialog to close
                                            interval =  setInterval(function() {
                                                if ($('.ui-dialog[aria-describedby="property-filters"]').css('display') == 'none') {
                                                    clearInterval(interval);

                                                    //scroll to query
                                                    $('html,body').animate({
                                                        scrollTop: $(".designer-button.run-button").offset().top - 200
                                                    });

                                                    tooltip('.designer-button.run-button',
                                                            'Run the query again!',
                                                            'right'
                                                    );

                                                    wait_for_results();
                                                }
                                            }, 500);
                                        }
                                    }, 500);
                                }, INTERVAL_VERY_SHORT);
                            }
                        }
                    }, 500);
                } else { //wrong filter
                    //remove the wrong filter
                    $(".filter-remove").click();
                    builder_workbench.property_selection.filters = [];

                    tooltip('.ui-dialog[aria-describedby="property-filters"] .filter-type-str',
                            '<p><span class="red" style="padding: 5px 10px;">Not the filter we wanted, let\'s try again</span></p>In order to exclude all countries with a geocode starting with <em>eu</em>, follow these steps:<ul style="list-style: square; padding-left: 20px;"><li>From the list after <em>Values</em>, choose <em>starts with</em>.</li><li>Type <em>eu</em> in the input on the right, and</li><li>Click the <span class="green-text">+Add filter</span> button.</li></ul>',
                            'top'
                    );
                }
            }
        }, 500);
    }

    function wait_for_results() {
        interval =  setInterval(function() {
            if ($("#sparql_results_table tbody tr").length > 0) {
                clearInterval(interval);

                tooltip('#sparql_results_table',
                        'Awesome!',
                        'top'
                );

                setTimeout(function() {
                    tooltip('#sparql_results_table',
                            'You can see that now we have the level of internet access (%) for each EU country.',
                            'top'
                    );

                    setTimeout(function() {
                        tooltip('#sparql_results_table',
                                'Now let\'s see how you can calculate the <span class="green-text">average</span> internet access for all EU countries.',
                                'top'
                        );

                        setTimeout(function() {
                            //scroll to countries
                            $('html,body').animate({
                                scrollTop: $("#class_instance_0").offset().top - 200
                            });

                            tooltip('#class_instance_0',
                                    'First of all we have to hide all properties that are not common for the average that we\'ll calculate.<br /><span class="green-text">Hide</span> the URI and the geocode.<br /><br /><em>Hint: Notice that while we\'re hidding the geocodes from the results they\'re not actually removed, so all the filters we set still apply.',
                                    'right'
                            );

                            wait_for_hide();
                        }, INTERVAL_LONG);
                    }, INTERVAL_LONG);
                }, INTERVAL_VERY_SHORT);
            }
        }, 500);
    }

    //wait user to hide the URI & geocode
    function wait_for_hide() {
        interval =  setInterval(function() {
            var sp = builder_workbench.instances[0].selected_properties;
            var hidden = true;
            var row_n;

            for (var i=0; i<sp.length; i++) {
                if ((sp[i].uri == "URI") || (sp[i].uri == "http://wifo5-04.informatik.uni-mannheim.de/eurostat/resource/eurostat/geocode")) {
                    if (sp[i].show) {
                        hidden = false;
                        break;
                    }
                } else if (sp[i].uri == "http://wifo5-04.informatik.uni-mannheim.de/eurostat/resource/eurostat/level_of_internet_access"){
                    row_n = i;
                    if (!sp[i].show) {
                        hidden = false;
                        break;
                    }
                }
            }

            if (hidden) { //the other properties have been hidden
                clearInterval(interval);

                tooltip('#class_instance_0 .property-table .property-row:nth-of-type(' + (row_n+2) + ')',
                        'Now right click on the <em>Level of internet access</em> property and click <span class="green-text">Options</span>.',
                        'right'
                );

                //wait user to click options
                interval =  setInterval(function() {
                    if ($('.ui-dialog[aria-describedby="property-options"]').css('display') != 'none') {
                        clearInterval(interval);

                        tooltip('.ui-dialog[aria-describedby="property-options"] .property-aggregate',
                                'From the aggregate functions list select <em>Average</em> and click the <em>OK</em> button.',
                                'right'
                        );

                        //clear results table
                        $("#sparql_results_table tbody").html('');

                        //wait for dialog to close
                        interval =  setInterval(function() {
                            console.log($('.ui-dialog[aria-describedby="property-options"]').css('display'));
                            if ($('.ui-dialog[aria-describedby="property-options"]').css('display') == 'none') {
                                clearInterval(interval);

                                //scroll to query
                                $('html,body').animate({
                                    scrollTop: $(".designer-button.run-button").offset().top - 200
                                });

                                tooltip('.designer-button.run-button',
                                        'Run the query to find the average.',
                                        'right'
                                );

                                interval =  setInterval(function() {
                                    if ($("#sparql_results_table tbody tr").length > 0) {
                                        clearInterval(interval);

                                        tooltip('#sparql_results_table',
                                                '<b>Congratulations!</b><br /><br />With what you learned on this tutorial, you can create composite queries with number, string, date or URI filters on multiple properties.<br/>You can also extract aggregates directly from the remote endpoints or the RDF datasets.<br/><br/>Click <a href="/query-designer/tutorials/filters_and_aggregates/">here</a> to move to the next tutorial!',
                                                'top'
                                        );
                                    }
                                }, 500);
                            }
                        }, 500);
                    }
                }, 500);
            }
        }, 500);
    }