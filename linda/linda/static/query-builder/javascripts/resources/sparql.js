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
            window.open(Utils.rdf2any.server+Utils.rdf2any.actions.convert+"rdb-converter.sql?dataset="+QueryBuilder.datasets.get_selected()+"&query="+encodeURIComponent($("#txt_sparql_query").val()));
        },
        csv : function(){
            window.open(Utils.rdf2any.server+Utils.rdf2any.actions.convert+"csv-converter.csv?dataset="+QueryBuilder.datasets.get_selected()+"&query="+encodeURIComponent($("#txt_sparql_query").val()));
        },
        pdf : function(){
            Utils.alert("The PDF download feature has not been implemented yet.");
        },
        json : function(){
            window.open(Utils.rdf2any.server+Utils.rdf2any.actions.convert+"json?dataset="+QueryBuilder.datasets.get_selected()+"&query="+encodeURIComponent($("#txt_sparql_query").val()));
        }
    }


};