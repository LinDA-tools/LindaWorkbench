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
    textbox : {
        is_valid : function(){
            var query = $("#txt_sparql_query").val();
            if(query == undefined || query.trim() == ''){
                Utils.alert("No SPARQL query inputted in the text box.")
                return false;
            }
            return true;
        }
    },
    download : {
        rdb : function(){
            var download_url = Utils.rdf2any.server+Utils.rdf2any.actions.convert+"rdb-converter.sql?dataset="+QueryBuilder.datasets.get_selected()+"&query="+encodeURIComponent($("#txt_sparql_query").val());
            var selected_class = QueryBuilder.classes.get_selected_class();
            if(selected_class != undefined && selected_class != ''){
               download_url += "&for_class="+selected_class;
               download_url += "&properties="+encodeURIComponent(QueryBuilder.properties.get_checked_properties()); 
            }      
            window.open(download_url);
        },
        csv : function(){
            var download_url = Utils.rdf2any.server+Utils.rdf2any.actions.convert+"csv-converter.csv?dataset="+QueryBuilder.datasets.get_selected()+"&query="+encodeURIComponent($("#txt_sparql_query").val());
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
            var download_url = Utils.rdf2any.server+Utils.rdf2any.actions.convert+"json?dataset="+QueryBuilder.datasets.get_selected()+"&query="+encodeURIComponent($("#txt_sparql_query").val());
            var selected_class = QueryBuilder.classes.get_selected_class();
            if(selected_class != undefined && selected_class != ''){
               download_url += "&for_class="+selected_class;
               download_url += "&properties="+encodeURIComponent(QueryBuilder.properties.get_checked_properties()); 
            }
            window.open(download_url);
        },
        configured : function(){
            var download_url = Utils.rdf2any.server+Utils.rdf2any.actions.convert+"configured-converter?dataset="+QueryBuilder.datasets.get_selected()+"&query="+encodeURIComponent($("#txt_sparql_query").val());
            download_url += "&for_class="+QueryBuilder.classes.get_selected_class();
            download_url += "&properties="+encodeURIComponent(QueryBuilder.properties.get_checked_properties()); 
            var str_variable_dictionary = "";
            for(i=0;i<configured_convert.variable_dictionary.length;i++){
                if (i>0)
                    str_variable_dictionary += ",";
                str_variable_dictionary += configured_convert.variable_dictionary[i].variable + "::" + configured_convert.variable_dictionary[i].value;

            }
            download_url += "&variable_dictionary="+encodeURIComponent(str_variable_dictionary);
            download_url += "&header="+encodeURIComponent(configured_convert.header);
            download_url += "&body="+encodeURIComponent(configured_convert.body);
            download_url += "&footer="+encodeURIComponent(configured_convert.footer);
            window.open(download_url);
        }

    }


};