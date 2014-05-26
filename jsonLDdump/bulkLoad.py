__author__ = 'mpetyx'

import rdflib
from rdflib import Namespace
import dgraphdbstore

# g = rdflib.ConjunctiveGraph()
# # g.parse('LindaDump.json', format='json-ld')
# g.parse('LindaCustom.xml', format="xml")

# start frrom a previous db
graphdb = dgraphdbstore.DeepGraphStore()
graphdb.open('deepGraphFile_321763af3ed32e1bb47233944ef6bc74_140512_191741')

# initialize new db
# graphdb = dgraphdbstore.DeepGraphStore(create=True, parse='LindaCustom.xml')
# graphdb.setUp()


graph = graphdb.graph
# print graphdb.size()
# graphdb.close()
# print len(graph)

# print len(g)
# pyld likes nquads, by default
# expand = jsonld.from_rdf(g.serialize(format="nquads"))
# framed = jsonld.frame(j, json.load(open('example_frame.jsonld', 'r')))
# print json.dumps(framed, indent=1)


query = """
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

select ?vocabURI
WHERE{
	?vocabURI a voaf:Vocabulary.
}
"""

result = graph.query(query)

voaf = Namespace('http://purl.org/vocommons/voaf#')

# pop = graph.value(RDF.type, voaf.Vocabulary)
# print pop

failure = []
new_graph = rdflib.ConjunctiveGraph('SQLite')
new_graph.open('koukli', create=True)

for triple in result:
    vocab = str(triple[0])
    # print vocab
    try:
        new_graph.parse(vocab)
    except:
        failure.append(vocab)
        print vocab
        # for con_triple in new_graph:
        #     print con_triple
        # break
new_graph.commit()
new_graph.close()
# for fail in failure:
#     print fail

thefile = open("failures.txt","w")
for item in failure:
  thefile.write("%s\n" % item)

thefile.close()