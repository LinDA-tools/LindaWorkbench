if (typeof SPARQL == 'undefined') {
    SPARQL = {};
}

SPARQL = {
    prefix : {
        rdf : "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n",
        rdfs : "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> \n",
        owl : "PREFIX owl:<http://www.w3.org/2002/07/owl#> \n",
        all : function(){
            result = "";
            result += SPARQL.prefix.rdf;
            result += SPARQL.prefix.rdfs;
            result += SPARQL.prefix.owl;
            return result;
        }
    },
    result : {
        columns : function(data){
            return data.head.vars;
        },
        rows : function(data){
            return data.results.bindings;
        },
        time_taken : function(data){
            return data.results.time_taken;
        },
        print : function(){
           Utils.alert("The PRINT feature has not been implemented yet."); 
        }
    },
    get_query: function() {
        if (editor) {
            return editor.getSession().getValue();
        } else {
            return $("#txt_sparql_query").val();
        }
    },
    textbox : {
        is_valid : function(){
            var query = SPARQL.get_query();
            if(query == undefined || query.trim() == ''){
                Utils.alert("No SPARQL query inputted in the text box.")
                return false;
            }
            return true;
        }
    },
    download : {
        rdb : function(){
            var download_url = Utils.rdf2any.server+Utils.rdf2any.actions.convert+"rdb-converter.sql?dataset="+QueryBuilder.datasets.get_selected(SPARQL.get_query())+"&query="+encodeURIComponent();
            var selected_class = QueryBuilder.classes.get_selected_class();
            if(selected_class != undefined && selected_class != ''){
               download_url += "&for_class="+selected_class;
               download_url += "&properties="+encodeURIComponent(QueryBuilder.properties.get_checked_properties());
            }
            window.open(download_url);
        },
        csv : function(){
            var download_url = Utils.rdf2any.server+Utils.rdf2any.actions.convert+"csv-converter.csv?dataset="+QueryBuilder.datasets.get_selected()+"&query="+encodeURIComponent(SPARQL.get_query());
            var selected_class = QueryBuilder.classes.get_selected_class();
            if(selected_class != undefined && selected_class != ''){
               download_url += "&for_class="+selected_class;
               download_url += "&properties="+encodeURIComponent(QueryBuilder.properties.get_checked_properties());
            }
            window.open(download_url);
        },
        pdf : function(){
            Utils.alert("The PDF download feature has not been implemented yet.");
        },
        json : function(){
            var download_url = Utils.rdf2any.server+Utils.rdf2any.actions.convert+"json?dataset="+QueryBuilder.datasets.get_selected()+"&query="+encodeURIComponent(SPARQL.get_query());
            var selected_class = QueryBuilder.classes.get_selected_class();
            if(selected_class != undefined && selected_class != ''){
               download_url += "&for_class="+selected_class;
               download_url += "&properties="+encodeURIComponent(QueryBuilder.properties.get_checked_properties());
            }
            window.open(download_url);
        }
    }


};