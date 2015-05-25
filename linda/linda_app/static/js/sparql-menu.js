/*Designer menu button actions*/
$('.designer-menu .run-button').on('click', function(e) {
    $(this).find('.glyphicon').addClass('loading');
    var that = this;
    execute_sparql_query(undefined, function(){$(that).find('.glyphicon').removeClass('loading')});
});

$('.designer-menu #show-source').on('click', function(e) {
    if ($('.qb-equivalent-query-main').css('display') == "block") {
        $('.qb-equivalent-query-main').css('cssText', 'display: none !important');
        $(this).removeClass('checked');
    } else {
        $('.qb-equivalent-query-main').css('cssText', 'display: block !important');
        $(this).addClass('checked');
    }
});