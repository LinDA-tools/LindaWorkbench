/*Get a humanized label from a resource URI*/
uri_to_label = function(uri) {
    if (uri == "URI") return "URI";

    uri = decodeURIComponent(uri);
    var spl = uri.split('/');
    var label = spl.pop();

    var start_pos = 0;
    if (label.indexOf('#') >= 0) {
        if (label.substr( label.indexOf('#') + 1).length > 0) {
            label = label.substr( label.indexOf('#') + 1);
        } else {
            label = label.substr(0, label.indexOf('#'));
        }
    }
    label = label.replace(/_/g, ' ');
    label = label.replace(/-/g, ' ');

    label = label
        // insert a space before all caps
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        // uppercase the first character
        .replace(/^./, function(str){ return str.toUpperCase(); });

    if (label[0] == ' ') {
        return label.substr(1);  //remove the initial space
    } else {
        return label;
    }
}

onmessage = function(e) {
    e.data.sort(function(a, b) {
        return uri_to_label(a.uri).length - uri_to_label(b.uri).length;
    });
    postMessage(e.data);
}