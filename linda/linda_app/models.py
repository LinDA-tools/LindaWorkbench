import urllib

from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save, post_delete
from django.template.defaultfilters import slugify

import rdflib
from rdflib import Graph, plugin
from rdflib.util import guess_format

from lists import *
from athumb.fields import ImageWithThumbsField

from settings import SESAME_LINDA_URL

User.profile = property(lambda u: UserProfile.objects.get_or_create(user=u)[0])

photo_upload_path = 'static/images/photos/'


class UserProfile(models.Model):
    """
    Extends basic User class in django.contrib.auth
    """
    user = models.OneToOneField(User)

    nameAppearance = models.CharField(max_length=256, blank=True,
                                      null=True)  # Information on the way the name is displayed in public
    country = models.CharField(max_length=3, default='--',
                               choices=COUNTRIES)  # combobox PREDEFINED LIST. LIST "COUNTRIES"
    facebookUrl = models.URLField(max_length=256, blank=True, null=True)  # User's Facebook profile
    twitterUrl = models.URLField(max_length=256, blank=True, null=True)  # User's Twitter profile
    googleUrl = models.URLField(max_length=256, blank=True, null=True)  # User's Google+ profile
    linkedInUrl = models.URLField(max_length=256, blank=True, null=True)  # User's LinkedIn profile
    websiteUrl = models.URLField(max_length=256, blank=True, null=True)  # User's personal website
    scientific_background = models.CharField(max_length=10, default='--',
                                             choices=SCIENTIFIC_DOMAINS)  # PREDEFINED LIST. LIST "SCIENTIFIC DOMAINS"


UserProfile.avatar = property(lambda d: Photo.objects.get_or_create(user_profile=d)[0])


class Photo(models.Model):
    user_profile = models.ForeignKey(UserProfile)
    '''photo_original = ImageWithThumbsField(
        upload_to=photo_upload_path,
        thumbs=(
            ('48x48', {'size': (48, 48), 'crop': True}),
            ('68x68', {'size': (68, 68), 'crop': True}),
            ('100x100', {'size': (100, 100), 'crop': True}),
            ('150x150', {'size': (150, 150), 'crop': True}),
        ),
        blank=True,
        null=True)'''

    def __unicode__(self):
        return "%d" % self.id


class Vocabulary(models.Model):
    #General information
    title = models.CharField(max_length=128, blank=False, null=False)
    description = models.CharField(max_length=2048, blank=False, null=False)
    category = models.CharField(max_length=256, blank=True,
                                choices=CATEGORIES)  # checkbox-list, PREDEFINED LIST - LIST "CATEGORIES"

    #RDF schema properties
    originalUrl = models.URLField(max_length=256, blank=False,
                                  null=True)  # Location of the original vocabulary - link
    downloadUrl = models.URLField(max_length=256, blank=False,
                                  null=True)  # Location of the rdf download vocabulary
    preferredNamespaceUri = models.URLField(max_length=1024, blank=False, null=True)  # Preferred namespace uri
    preferredNamespacePrefix = models.CharField(max_length=256, blank=False, null=True)  # Preferred namespace prefix

    #Usage statistics
    lodRanking = models.IntegerField(default=0)

    #Vocabulary example
    example = models.CharField(max_length=8196, blank=True, null=False)

    #Logging
    uploader = models.ForeignKey(User)
    datePublished = models.DateField(blank=True, null=True)  # Original vocabulary publish date
    dateCreated = models.DateField(blank=True, null=True)  # Vocabulary creation inside LinDa
    dateModified = models.DateField(blank=True, null=True)  # Last vocabulary modification

    #Social properties
    score = models.IntegerField()  # Sum of the votes for the vocabulary
    votes = models.IntegerField()  # Number of votes for the vocabulary
    downloads = models.IntegerField()  # Number of downloads for the vocabulary

    def title_slug(self):
        return slugify(self.title)

    def get_absolute_url(self):
        return u'/vocabulary/%d/%s' % (self.id, self.title_slug())

    def has_been_voted(self):
        return self.score > 0

    def get_score(self):
        return float(self.score) / self.votes

    def has_voted(self, user):
        return len(VocabularyRanking.objects.filter(voter=user, vocabularyRanked=self)) > 0

    def make_classes_properties(self):
        # Remove all classes and properties from this vocabulary
        VocabularyClass.objects.filter(vocabulary=self).delete()
        VocabularyProperty.objects.filter(vocabulary=self).delete()

        # Load the rdf
        g = Graph()
        rdf_dta = urllib.urlopen(self.downloadUrl).read()
        g.parse(data=rdf_dta, format=guess_format(self.downloadUrl))

        # Register a temporary SparQL endpoint for this rdf
        #plugin.register('sparql', rdflib.query.Processor, 'rdfextras.sparql.processor', 'Processor')
        #plugin.register('sparql', rdflib.query.Result, 'rdfextras.sparql.query', 'SPARQLQueryResult')

        # Run a query to retrieve all classes
        q_classes = g.query(
            """ SELECT ?class ?classLabel
                WHERE {
                    ?class rdf:type rdfs:Class.
                    ?class rdfs:label ?classLabel.
                }""")

        # Store the classes in the database
        for row in q_classes.result:
            cls = VocabularyClass.objects.create(vocabulary=self, uri=row[0], label=row[1], ranking=0)
            cls.save()

        # Run a query to retrieve all properties
        q_properties = g.query(
            """ SELECT DISTINCT ?property ?propertyLabel
                WHERE {
                    ?property rdfs:domain ?class .
                    ?property rdfs:label ?propertyLabel.
                }""")

        # Store the properties in the database
        for row in q_properties.result:
            prp = VocabularyProperty.objects.create(vocabulary=self, uri=row[0], label=row[1], ranking=0)
            prp.save()

    def __unicode__(self):
        return self.title


# Update classes and vocabularies on new vocabulary save
def on_vocabulary_save(sender, instance, created, **kwargs):
    instance.make_classes_properties()


# Remove classes and vocabularies on vocabulary delete
def on_vocabulary_delete(sender, instance, created, **kwargs):
    # Remove all classes and properties from this vocabulary
    VocabularyClass.objects.filter(vocabulary=instance).delete()
    VocabularyProperty.objects.filter(vocabulary=instance).delete()


post_save.connect(on_vocabulary_save, sender=Vocabulary)
post_delete.connect(on_vocabulary_delete, sender=Vocabulary)


class VocabularyRanking(models.Model):  # A specific vote for a vocabulary (1-5)
    voter = models.ForeignKey(User)
    vocabularyRanked = models.ForeignKey(Vocabulary)
    vote = models.IntegerField()


class VocabularyClass(models.Model):  # A class inside an RDF vocabulary
    vocabulary = models.ForeignKey(Vocabulary)
    uri = models.URLField(max_length=1024, blank=False, null=True)
    label = models.CharField(max_length=128, blank=False, null=False)
    ranking = models.FloatField()

    def __unicode__(self):
        return self.label


class VocabularyProperty(models.Model):  # A property inside an RDF vocabulary
    vocabulary = models.ForeignKey(Vocabulary)
    uri = models.URLField(max_length=1024, blank=False, null=True)
    label = models.CharField(max_length=128, blank=False, null=False)
    ranking = models.FloatField()

    def __unicode__(self):
        return self.label

Vocabulary.property = property(lambda d: VocabularyProperty.objects.get_or_create(vocabulary=d)[0])

class VocabularyComments(models.Model):
    commentText = models.CharField(max_length=512, blank=False, null=False)  # Comment content
    vocabularyCommented = models.ForeignKey(Vocabulary)  # Vocabulary-discussion
    user = models.ForeignKey(User)  # Comment author
    timePosted = models.DateTimeField(blank=True, null=True)  # Comment timestamp


class DatasourceDescription(models.Model):
    title = models.CharField(max_length=512, blank=False, null=False)  # datasource title
    is_public = models.BooleanField(default=False) #true if datasource is public
    name = models.CharField(max_length=512, blank=False, null=False)  # datasource name - slug
    uri = models.CharField(max_length=2048, blank=False, null=False)  # sesame uri
    createdOn = models.DateField(blank=False, null=False)  # daatasource creation date
    lastUpdateOn = models.DateField(blank=False, null=False)  # daatasource last edit date

    def __unicode__(self):
        return self.title


