__author__ = 'mpetyx'

import datetime
from haystack import indexes
from models import Vocabulary


class VocabularyIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True)
    # description = indexes.CharField(model_attr='description')
    title = indexes.CharField(model_attr='title')
    title_auto = indexes.EdgeNgramField(model_attr='title')
    description = indexes.CharField(model_attr='description')
    preferredNamespacePrefix = indexes.CharField(model_attr='preferredNamespacePrefix')

    def get_model(self):
        return Vocabulary