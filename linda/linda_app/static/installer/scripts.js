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
            $("#installer-info").html("LinDA components installed successfully.");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#installer-load").remove()
            $("#installer-info").addClass("finished error");
            $("#installer-info").html(errorThrown + "<br />Please contact the website administrator");
        }
    });
});