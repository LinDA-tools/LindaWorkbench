__author__ = 'mpetyx'

from rdflib import Graph, ConjunctiveGraph

# import rdflib.plugin
# from django.conf import settings
import datetime
import os
# register('SQLite', Store, 'rdflib.store.SQLite', 'SQLite')

def random_file_generating():
    basename = "deepGraphFile"
    suffix = datetime.datetime.now().strftime("%y%m%d_%H%M%S")
    middle = os.urandom(16).encode('hex')
    filename = "_".join([basename, middle, suffix])
    return filename


class DeepGraphStore():
    store_name = 'SQLite'

    def __init__(self, create=False, parse=None):
        self.parse = parse
        self.create = create
        self.graph = None

    def setUp(self):
        self.path = "" + random_file_generating()
        self.graph = Graph(store=self.store_name)
        self.graph.open(self.path, create=self.create)

        if self.create:
            if not self.parse:
                self.graph.parse("http://njh.me/foaf.rdf", format='xml')
            else:
                self.graph.parse(self.parse)
            self.graph.commit()

    def open(self, path):
        self.graph = ConjunctiveGraph(self.store_name)
        self.path = path
        self.graph.open(self.path, create=False)

    def query(self, sparql_query):
        return self.graph.query(sparql_query)

    def parse(self, path_to_file_):
        self.graph.parse(path_to_file_)

    def load(self, triples):
        self.graph.load(triples)

    def close(self):
        self.graph.close()

    def size(self):
        size = self.graph.__len__()
        size = len(self.graph)
        # self.close()
        return size
