function set_percentage(percent) {
    var $ppc = $('.progress-pie-chart');
    $ppc.data('percent', percent);

    deg = 360*percent/100;
    if (percent > 50) {
        $ppc.addClass('gt-50');
    }

    $('.ppc-progress-fill').css('transform','rotate('+ deg +'deg)');
    $('.ppc-percents span').html(percent+'%');
}

function getEquivalent(v, vs) {
    vs.forEach(function(ve) {
        if (ve.slug == v.slug) {
            return ve
        }
    });
}

$(function(){
    //retrieve local vocabularies
    $.ajax({
        url: '/api/vocabularies/versions/',
        type: "GET",

        success: function(vs_local, textStatus, jqXHR) {
            //retrieve repositiory vocabularies
            $.ajax({
                url: '/api/vocabulary-repo/vocabularies/versions/',
                type: "GET",

                success: function(vs_repo, textStatus, jqXHR) {
                    $("#initial-fetch").remove();
                    $(".vocabulary-updates .info").html('Applying changes...');

                    //first pass to count changes
                    var chg_counter = 0;
                    console.log('VS_REPO = ' + vs_repo);
                    vs_local.forEach(function(v_local) {
                        v_repo = getEquivalent(v_local, vs_repo);
                        if (v_repo && (v_local.version != v_repo.version)) { //find changed/removed vocabularies -- ignore locals-only
                            chg_counter++;
                        }
                    });

                    vs_repo.forEach(function(v_repo) {
                        v_local = getEquivalent(v_local, vs_local);
                        if (!v_local) { //new vocabularies
                            chg_counter++;
                        }
                    });

                    if (chg_counter == 0) { //no changes detected
                        $(".vocabulary-updates .info").html('Local repository is already up to date.');
                    }

                    //second pass to apply changes
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $("#initial-fetch").remove();
                    $(".vocabulary-updates .info").html('Could not get vocabulary list from repository server.');
                }

            });
        },

        error: function (jqXHR_out, textStatus, errorThrown) {
            $("#initial-fetch").remove();
            $(".vocabulary-updates .info").html('Could not get local vocabulary list. Please try again later.');
        }
    });
});