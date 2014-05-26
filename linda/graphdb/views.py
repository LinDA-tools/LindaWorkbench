# Create your views here.

import dgraphdbstore
from queries import DETAILS_ABOUT_VOCABULARY

def query():
    graphdb = dgraphdbstore.DeepGraphStore()
    graphdb.open('deepGraphFile_321763af3ed32e1bb47233944ef6bc74_140512_191741')

    results = graphdb.query(DETAILS_ABOUT_VOCABULARY)

    return results

# TODO Create actual tests for this method
# results = query()
#
# for result in results:
#     print result


