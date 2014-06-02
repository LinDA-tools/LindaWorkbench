__author__ = 'mpetyx'


from linda.models import Vocabulary, User

from graphdb import dgraphdbstore


graphdb = dgraphdbstore.DeepGraphStore()
graphdb.open('graphdb/deepGraphFile_321763af3ed32e1bb47233944ef6bc74_140512_191741')


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

select distinct ?title ?description ?creator ?modified ?preferredNamespacePrefix ?preferredNamespaceUri ?shortTitle ?homepage
WHERE{
        ?vocabURI dcterms:title ?title.
        ?vocabURI dcterms:description ?description.
        ?vocabURI dcterms:creator ?creator.
        ?vocabURI dcterms:modified ?modified.
        ?vocabURI vann:preferredNamespacePrefix ?preferredNamespacePrefix.
        ?vocabURI vann:preferredNamespaceUri ?preferredNamespaceUri.
        ?vocabURI bibo:shortTitle ?shortTitle.
        ?vocabURI foaf:homepage ?homepage.
	    ?vocabURI a voaf:Vocabulary.

      # FILTER (REGEX(STR(?shortTitle), "foaf", "i")).
}
"""


results = graphdb.query(DETAILS_ABOUT_VOCABULARY)

uploader = User.objects.get(id=1)

for vocabulary in results:
    linda_vocabulary = Vocabulary(title =vocabulary.title, preferredNamespaceUri = vocabulary.preferredNamespaceUri, preferredNamespacePrefix = vocabulary.preferredNamespacePrefix , description = vocabulary.description, uploader=uploader)
    linda_vocabulary.score = 1
    linda_vocabulary.originalUrl = vocabulary.homepage
    linda_vocabulary.votes = 0
    linda_vocabulary.downloads = 0
    linda_vocabulary.save()

