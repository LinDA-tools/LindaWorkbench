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
    for (var i=0; i<vs.length; i++) {
        if (vs[i].slug == v.slug) {
            return vs[i];
        }
    }

    return null;
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

                    var new_vocabs = new Array();
                    var changed_vocabs = new Array();
                    var deleted_vocabs = new Array();

                    vs_local.forEach(function(v_local) {
                        v_repo = getEquivalent(v_local, vs_repo);

                        if (v_repo && (v_local.version != v_repo.version)) { //find changed/removed vocabularies -- ignore locals-only
                            chg_counter++;
                            if (v_repo.version == "DELETED") {
                                deleted_vocabs.push(v_local);
                            } else {
                                changed_vocabs.push({"old": v_local, "new": v_repo});
                            }
                        }
                    });

                    vs_repo.forEach(function(v_repo) {
                        v_local = getEquivalent(v_repo, vs_local);

                        if (!v_local) { //new vocabularies
                            chg_counter++;
                            new_vocabs.push(v_repo);
                        }
                    });

                    if (chg_counter == 0) { //no changes detected
                        $(".vocabulary-updates .info").html('Local repository is already up to date.');
                        return;
                    }

                    console.log(new_vocabs);
                    console.log(changed_vocabs);
                    console.log(deleted_vocabs);
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