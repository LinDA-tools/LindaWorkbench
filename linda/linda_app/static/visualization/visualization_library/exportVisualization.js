var exportVis = function() {

    function export_PNG() {
        var svg = get_SVG();
        var image = $('<img />', {'id': 'chart', "style": "display:none", 'src': 'data:image/svg+xml,' + escape(svg)});
        image.appendTo($('#visualization'));
        /*console.log("CHART IMAGE");
         console.dir(image);*/

        var dfd = new jQuery.Deferred();

        $("#chart").one("load", function() {
            var canvas = $('<canvas/>', {'id': 'canvas'});
            canvas[0].width = 1050;
            canvas[0].height = 510;
            canvas.appendTo($('#visualization'));
            /* console.log("CHART CANVAS");
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
        /*console.log("CHART - PNG - PROMISE");
         console.dir(imgURL);*/

        return(imgURL);
    }

    function export_SVG() {
        var svg = get_SVG();
        var svgURL = 'data:application/octet-stream,' + escape(svg);
        /*console.log("CHART - SVG URL");
         console.dir(svgURL);*/

        return(svgURL);
    }

    function get_SVG(cssFilename) {
        var svg = $("#visualization").find('svg');
        /* console.log("CHART SVG");
         console.dir(svg);*/

        if (svg.length === 0) {
            return;
        }

        var serializer = new XMLSerializer();
        var xml = serializer.serializeToString(svg[0]);
        /*console.log("CHART SVG - ORIGINAL");
         console.dir(xml);*/

        svg.find('defs').remove();

        svg.attr('version', "1.1");
        svg.attr('xmlns', "http://www.w3.org/2000/svg");
        svg.attr('xmlns:xlink', "http://www.w3.org/1999/xlink");

        if (cssFilename) {
            var css = "";

            /* Take all the styles from your visualization library and make them inline. */
            $.each(document.styleSheets, function(sheetIndex, sheet) {
                //console.log("Looking at styleSheet[" + sheetIndex + "]:" + " href: " + sheet.href);
                if ((sheet.href !== null) && endsWith(sheet.href, cssFilename)) {
                    $.each(sheet.cssRules || sheet.rules, function(ruleIndex, rule) {
                        // console.log("rule[" + ruleIndex + "]: " + rule.cssText);
                        css += rule.cssText + "\n";
                    });
                }
            });

            /*console.log("css file as string");
             console.dir(css);*/

            var style = $('<style />', {"type": "text/css"});
            style.prependTo(svg);
            
            var serializer = new XMLSerializer();
            var svg_ = serializer.serializeToString(svg[0]);
            svg_ = svg_.replace('</style>', '<![CDATA[' + css + ']]></style>');
            /*console.log("CHART SVG - TWEAKED");
             console.dir(svg_);*/

        } else {

            var serializer = new XMLSerializer();
            var svg_ = serializer.serializeToString(svg[0]);

        }

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