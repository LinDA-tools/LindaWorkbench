/* Run button actions */
$('.designer-menu .run-button').on('click', function(e) {
    if ($(this).hasClass('stop') == false) { // on run query
        $(this).addClass('stop');
        $(this).find('.glyphicon').removeClass('glyphicon-play').removeClass('text-green').addClass('text-red').addClass('glyphicon-stop');
        $(this).find('.text').html('Stop');
        var that = this;

        SPARQL.jqXHR = execute_sparql_query(undefined, function(){
            $(that).removeClass('stop');
            $(that).find('.glyphicon').removeClass('text-red').removeClass('glyphicon-stop').addClass('glyphicon-play').addClass('text-green');
            $(that).find('.text').html('Start');
            SPARQL.jqXHR = undefined;
        });
    } else { // on stop query
        // abort latest query
        if (typeof(SPARQL.jqXHR) !== "undefined") {
            SPARQL.jqXHR.abort();
            SPARQL.jqXHR = undefined;
        }

        $(this).removeClass('stop');
        $(this).find('.glyphicon').removeClass('text-red').removeClass('glyphicon-stop').addClass('glyphicon-play').addClass('text-green');
        $(this).find('.text').html('Start');
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