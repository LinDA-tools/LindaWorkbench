__author__ = 'mpetyx'

SPECIFIC_VOCABULARY = """
PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>
PREFIX dcterms:<http://purl.org/dc/terms/>
PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl:<http://www.w3.org/2002/07/owl#>
PREFIX skos:<http://www.w3.org/2004/02/skos/core#>
PREFIX foaf:<http://xmlns.com/foaf/0.1/>
PREFIX void:<http://rdfs.org/ns/void#>
PREFIX bibo:<http://purl.org/ontology/bibo/>
PREFIX vann:<http://purl.org/vocab/vann/>
PREFIX voaf:<http://purl.org/vocommons/voaf#>
PREFIX frbr:<http://purl.org/vocab/frbr/core#>
PREFIX lov:<http://lov.okfn.org/dataset/lov/lov#>

SELECT ?vocabPrefix ?vocabURI ?shortTitle
WHERE{
	?vocabURI a voaf:Vocabulary.
	?vocabURI vann:preferredNamespacePrefix ?vocabPrefix.
       ?vocabURI bibo:shortTitle ?shortTitle.
      FILTER (REGEX(STR(?shortTitle), "foaf", "i")).
}
ORDER BY ?vocabPrefix
"""

DETAILS_ABOUT_VOCABULARY = """

PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>
PREFIX dcterms:<http://purl.org/dc/terms/>
PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl:<http://www.w3.org/2002/07/owl#>
PREFIX skos:<http://www.w3.org/2004/02/skos/core#>
PREFIX foaf:<http://xmlns.com/foaf/0.1/>
PREFIX void:<http://rdfs.org/ns/void#>
PREFIX bibo:<http://purl.org/ontology/bibo/>
PREFIX vann:<http://purl.org/vocab/vann/>
PREFIX voaf:<http://purl.org/vocommons/voaf#>
PREFIX frbr:<http://purl.org/vocab/frbr/core#>
PREFIX lov:<http://lov.okfn.org/dataset/lov/lov#>

select ?title ?description ?creator ?modified ?preferredNamespacePrefix ?preferredNamespaceUri ?shortTitle
WHERE{
        ?vocabURI dcterms:title ?title.
        ?vocabURI dcterms:description ?description.
        ?vocabURI dcterms:creator ?creator.
        ?vocabURI dcterms:modified ?modified.
        ?vocabURI vann:preferredNamespacePrefix ?preferredNamespacePrefix.
        ?vocabURI vann:preferredNamespaceUri ?preferredNamespaceUri.
        ?vocabURI bibo:shortTitle ?shortTitle.
	?vocabURI a voaf:Vocabulary.

      FILTER (REGEX(STR(?shortTitle), "foaf", "i")).
}

"""

import json

import dgraphdbstore


graphdb = dgraphdbstore.DeepGraphStore()
graphdb.open('deepGraphFile_321763af3ed32e1bb47233944ef6bc74_140512_191741')

results = graphdb.query(DETAILS_ABOUT_VOCABULARY)

response = {}
for row in results:
    response['description'] = row.description
    response['title'] = row.title
    response['creator'] = row.creator
    response['modified'] = row.modified
    response['preferredNamespacePrefix'] = row.preferredNamespacePrefix
    response['preferredNamespaceUri'] = row.preferredNamespaceUri
    response['shortTitle'] = row.shortTitle
    print json.dumps(response)
    break