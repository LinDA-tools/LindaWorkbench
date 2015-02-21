var sub_Q = {
    colors: ['#FC5006', '#99b433', '#b91d47', '#1e7145', '#CF000F', '#ff0097', '#00a300', '#9f00a7', '#603cba', '#da532c', '#00aba9', '#F27935'],
    inactive_autoscroll_left: [], //disable left scroll if inactive_autoscroll_left[n] is true
    inactive_autoscroll_right: [], //disable right scroll if inactive_autoscroll_right[n] is true

    //get the color corresponding to letter
    get_color: function(letter) {
        var letter_pos = letter.charCodeAt(0) - 'A'.charCodeAt(0);
        return this.colors[letter_pos % this.colors.length];
    },

    //is the subquery selector shown?
    subquery_selector_shown: function(n) {
        return $("#subquery-selector-" + n).length > 0;
    },

    //show the subquery selector
    subquery_selector: function(n) {
        $("#class_instance_" + n).append('<div id="subquery-selector-' + n + '" data-about="' + n + '" class="subquery-selector"><span></span></div>');
        $("#subquery-selector-" + n).append('<span class="subquery-value" data-value="none" style="color: #1d1d1d">none</span>');
        for(var i='A'.charCodeAt(0); i<='Z'.charCodeAt(0); i++) {
            var c = String.fromCharCode(i);
            $("#builder_workspace #subquery-selector-" + n).append('<span class="subquery-value" data-value="' + c + '" style="background-color: ' + this.get_color(c) + '">' + c + '</span>');
        }
    },

    //close the selector
    subquery_selector_close: function(n) {
        return $("#subquery-selector-" + n).remove();
    },

    //util for instance rename
    rename_instance: function(n, m) {
        $("#subquery-selector-" + n).attr("id", '#subquery-selector-' + m);
        $("#subquery-selector-" + m).attr("data-about", m);
        $("#subquery-selector-" + m).data("about", m);
    },

    set_subquery: function(n, c) {
        if ((c != undefined) && (c != "none")) {
            builder_workbench.instances[n].subquery = c;

            $("#class_instance_" + n + " .subquery-select").removeClass("empty");
            $("#class_instance_" + n + " .subquery-select").html(c);
            $("#class_instance_" + n + " .subquery-select").css('background-color', this.get_color(c));
        } else {
            builder_workbench.instances[n].subquery = undefined;

            $("#class_instance_" + n + " .subquery-select").addClass("empty");
            $("#class_instance_" + n + " .subquery-select").html('');
            $("#class_instance_" + n + " .subquery-select").css('background-color', '');
        }
    },
};

//on change subquery
$("#builder_workspace").on('click', '.class-instance > .title > .subquery-select', function(e) {
    var n = $(this).parent().parent().data('n');

    if (sub_Q.subquery_selector_shown(n)) {
        sub_Q.subquery_selector_close(n);
    } else {
        sub_Q.subquery_selector(n);
    }

    e.preventDefault();
    e.stopPropagation();
});

//hide all subquery selectors
$("#builder_workspace").on('click', function(e) {
    $(".subquery-selector").remove();
});

//on subquery selector value select
$("#builder_workspace").on('click', '.subquery-selector .subquery-value', function(e) {
    var val = $(this).data('value');
    var n = $(this).parent().data('about');

    sub_Q.set_subquery(n, val);

    sub_Q.subquery_selector_close(n);
    builder.reset();
});

//auto-scroll
//when mouse move towards the edges of the selector, scroll to next/prev options
$("#builder_workspace").on('mousemove', '.subquery-selector', function(e) {
    var n = $(this).data('about');

    var x = e.pageX - $(this).offset().left;
    var y = e.pageY - $(this).offset().top;

    if ((x >= $(this).width() - 50) && (sub_Q.inactive_autoscroll_right[n] === undefined)) { //right scroll
        sub_Q.inactive_autoscroll_right[n] = true;
        $(this).animate( { scrollLeft: '+=100' }, 100);
        setTimeout(function(){ sub_Q.inactive_autoscroll_right[n] = undefined }, 1000);
    }
    else
    if ((x <= 50) && (sub_Q.inactive_autoscroll_left[n] === undefined)) { //left scroll
        sub_Q.inactive_autoscroll_left[n] = true;
        $(this).animate( { scrollLeft: '-=100' }, 100);
        setTimeout(function(){ sub_Q.inactive_autoscroll_left[n] = undefined }, 1000);
    }

});

//on pattern change recalculate query
$("#builder_pattern > input").on('change', function(e) {
    builder.reset();
});