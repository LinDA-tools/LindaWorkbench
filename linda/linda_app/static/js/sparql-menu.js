/* Run button actions */
$('.designer-menu .run-button').on('click', function(e) {
    function manage_ui(e, signal) {
        if (signal == 'start') {
            $(e).removeClass('stop');
            $(e).find('.glyphicon').removeClass('text-red').removeClass('glyphicon-stop').addClass('glyphicon-play').addClass('text-green');
            $(e).find('.text').html('Start');
            $(e).attr('title', 'Run the query (F9)');

            $(".run-query-info").addClass('hidden').hide();
            clearInterval(SPARQL.query_timer);
        } else {
            $(e).addClass('stop');
            $(e).find('.glyphicon').removeClass('glyphicon-play').removeClass('text-green').addClass('text-red').addClass('glyphicon-stop');
            $(e).find('.text').html('Stop');
            $(e).attr('title', 'Stop query execution (F9)');

            //loading bar
            SPARQL.query_execution_time = 0;
            $(".run-query-info .time-info").html('00:00:00');
            $(".run-query-info").removeClass('hidden').show();
            SPARQL.query_timer = setInterval(function() {
                SPARQL.query_execution_time++;

                //get hours, minutes & seconds from total execution time
                var hours = ("0" + Math.floor(SPARQL.query_execution_time/3600)).slice(-2);
                var minutes = ("0" + Math.floor(SPARQL.query_execution_time/60 - hours*60)).slice(-2);
                var seconds = ("0" + SPARQL.query_execution_time % 60).slice(-2);

                $(".run-query-info .time-info").html(hours + ':' + minutes + ':' + seconds);
            }, 1000);
        }
    }

    if ($(this).hasClass('stop') == false) { // on run query
        manage_ui(this, 'stop');
        var that = this;

        SPARQL.jqXHR = execute_sparql_query(undefined, function(){
            manage_ui(that, 'start');
            SPARQL.jqXHR = undefined;
        });
    } else { // on stop query
        // abort latest query
        if (typeof(SPARQL.jqXHR) !== "undefined") {
            SPARQL.jqXHR.abort();
            SPARQL.jqXHR = undefined;
        }

        manage_ui(this, 'start');
    }

});

/* View source button actions */
$('.designer-menu #show-source').on('click', function(e) {
    if ($('.qb-equivalent-query-main').css('display') == "block") {
        $('.qb-equivalent-query-main').css('cssText', 'display: none !important');
        $(this).removeClass('checked');
    } else {
        $('.qb-equivalent-query-main').css('cssText', 'display: block !important');
        $(this).addClass('checked');
    }
});