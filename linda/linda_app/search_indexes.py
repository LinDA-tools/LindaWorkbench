__author__ = 'mpetyx'

import datetime
from haystack import indexes
from linda_app.models import Vocabulary, VocabularyClass, VocabularyProperty


# In haystack backend settings change default min_gram to 4-5 for optimal results
class VocabularyIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.NgramField(document=True, use_template=True)
    title = indexes.NgramField(model_attr='title')
    description = indexes.NgramField(model_attr='description')
    preferredNamespacePrefix = indexes.CharField(model_attr='preferredNamespacePrefix')

    def get_model(self):
        return Vocabulary


class VocabularyClassIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.NgramField(document=True, use_template=True)
    label = indexes.NgramField(model_attr='label')

    def get_model(self):
        return VocabularyClass


class VocabularyPropertyIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.NgramField(document=True, use_template=True)
    label = indexes.NgramField(model_attr='label')

    def get_model(self):
        return VocabularyProperty
