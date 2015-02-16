$(function() {
    $.ajax({  //make an ajax request to install LinDA components
        url: "/api/installer/run/",
        type: "POST",
        data: {
            csrfmiddlewaretoken: csrf_token
        },
        success: function(data, textStatus, jqXHR) {
            $("#installer-load").remove()
            $("#installer-info").addClass("finished success");

            //create the installed component list
            component_list = '<ul class="installed_component_list">';
            component_list += '<li>' + data.n_of_repositories + ' linked data repositories</li>';
            component_list += '<li>' + data.n_of_vocabularies + ' linked data vocabularies</li>';
            component_list += '<li>' + data.n_of_classes + ' classes and ' + data.n_of_properties + ' properties</li>';
            component_list += '<li>' + data.n_of_algorithms + ' analytic algorithms of ' + data.n_of_categories + ' different categories</li>';
            component_list += '</ul>';

            $("#installer-info").html("LinDA components installed successfully:" + component_list);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#installer-load").remove()
            $("#installer-info").addClass("finished error");
            $("#installer-info").html(errorThrown + "<br />Please contact the website administrator");
        }
    });
});