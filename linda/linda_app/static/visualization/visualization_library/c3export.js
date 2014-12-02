var exportC3 = function() {

    function export_PNG() {
        var svg = get_SVG();
        var image = $('<img />', {'id': 'c3_chart', "style": "display:none", 'src': 'data:image/svg+xml,' + escape(svg)});
        image.appendTo($('#visualization'));
        /*console.log("C3 CHART IMAGE");
         console.dir(image);*/

        var dfd = new jQuery.Deferred();

        $("#c3_chart").one("load", function() {
            var canvas = $('<canvas/>', {'id': 'canvas'});
            canvas[0].width = 1050;
            canvas[0].height = 510;
            canvas.appendTo($('#visualization'));
            /* console.log("C3 CHART CANVAS");
             console.dir(canvas);
             console.dir(this);*/

            var context = canvas[0].getContext('2d');
            /*console.log("CANVAS CONTEXT");
             console.dir(context);*/

            /* Generate a PNG with canvg. */
            context.drawSvg(svg, 0, 0, 1050, 510);

            var pngURL = canvas[0].toDataURL("image/png");
            var downloadURL = pngURL.replace(/^data:image\/png/, 'data:application/octet-stream');
            /*console.log("CANVAS CONTEXT downloadURL");
             console.dir(downloadURL);*/

            dfd.resolve(downloadURL);

            canvas.remove();
            $(this).remove();
        }).each(function() {
            if (this.complete)
                $(this).load();
        });

        var imgURL = dfd.promise();
        /*console.log("C3 CHART - PNG - PROMISE");
         console.dir(imgURL);*/

        return(imgURL);
    }

    function export_SVG() {
        var svg = get_SVG();
        var svgURL = 'data:application/octet-stream,' + escape(svg);
        /*console.log("C3 CHART - SVG URL");
         console.dir(svgURL);*/

        return(svgURL);
    }

    function get_SVG() {
        var svg = $("#visualization").find('svg');
        /* console.log("C3 CHART SVG");
         console.dir(svg);*/

        if (svg.length === 0) {
            return;
        }

        var serializer = new XMLSerializer();
        var xml = serializer.serializeToString(svg[0]);
        /*console.log("C3 CHART SVG - ORIGINAL");
         console.dir(xml);*/

        svg.find('defs').remove();

        svg.attr('version', "1.1");
        svg.attr('xmlns', "http://www.w3.org/2000/svg");
        svg.attr('xmlns:xlink', "http://www.w3.org/1999/xlink");

        var c3CSS = "";

        /* 1. Take all the styles from c3.js and make them inline on most of the SVG elements. */
        $.each(document.styleSheets, function(sheetIndex, sheet) {
            //console.log("Looking at styleSheet[" + sheetIndex + "]:" + " href: " + sheet.href);
            if ((sheet.href !== null) && endsWith(sheet.href, "c3.css")) {
                $.each(sheet.cssRules || sheet.rules, function(ruleIndex, rule) {
                    // console.log("rule[" + ruleIndex + "]: " + rule.cssText);
                    c3CSS += rule.cssText + "\n";
                });
            }
        });

        /*console.log("c3.css as string");
         console.dir(c3CSS);*/

        var style = $('<style />', {"type": "text/css"});
        style.prependTo(svg);

        /* 2. Find any elements that have "hidden" for the CSS "visibility" property and set those to "display: none". 
         *    This hide all of C3's unused axes.*/
        svg.find('*').each(function() {
            if ($(this).css('visibility') === 'hidden' || $(this).css('opacity') === '0') {
              //  $(this).css('display', 'none');
            }
        });

        /* 3. Set fill: none on all SVG data paths so they you don't get the weird bezier clipping effect.*/
        svg.find('.c3-chart path').each(function() {
            $(this).attr('fill', $(this).css('fill'));
        });

        var serializer = new XMLSerializer();
        var svg_ = serializer.serializeToString(svg[0]);
        svg_ = svg_.replace('</style>', '<![CDATA[' + c3CSS + ']]></style>');
        /*console.log("C3 CHART SVG - TWEAKED");
         console.dir(svg_);*/

        return svg_;
    }

    function endsWith(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

    return {
        export_PNG: export_PNG,
        export_SVG: export_SVG,
        get_SVG: get_SVG
    };

}();