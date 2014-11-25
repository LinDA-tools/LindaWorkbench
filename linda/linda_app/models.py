from datetime import datetime
import urllib

from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save, post_delete
from django.template.defaultfilters import slugify, random

from rdflib import Graph
import rdflib
from rdflib.util import guess_format
import re

from lists import *
from athumb.fields import ImageWithThumbsField
from pattern.en import pluralize

from settings import RDF2ANY_SERVER, LINDA_HOME

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


# Creates a 'label' from an rdf term uri
def get_label_by_uri(uri):
    label = uri.split('/')[-1]
    start_pos = label.find('#')
    if start_pos < 0:
        start_pos = 0
    else:
        start_pos += 1
    end_pos = label.find('>')
    if end_pos < 0:
        label = label[start_pos:]
    else:
        label = label[start_pos:end_pos]
    label = re.sub(r'([a-z](?=[A-Z])|[A-Z](?=[A-Z][a-z]))', r'\1 ', label)  # insert space for words written in camelCase
    return re.sub('_', ' ', label)


class Vocabulary(models.Model):
    # General information
    title = models.CharField(max_length=256, blank=False, null=False)
    description = models.CharField(max_length=2048, blank=False, null=False)
    category = models.CharField(max_length=256, blank=True,
                                choices=CATEGORIES)  # checkbox-list, PREDEFINED LIST - LIST "CATEGORIES"

    # RDF schema properties
    originalUrl = models.URLField(max_length=256, blank=False,
                                  null=True)  # Location of the original vocabulary - link
    downloadUrl = models.URLField(max_length=256, blank=False,
                                  null=True)  # Location of the rdf download vocabulary
    preferredNamespaceUri = models.URLField(max_length=1024, blank=False, null=True)  # Preferred namespace uri
    preferredNamespacePrefix = models.CharField(max_length=256, blank=False, null=True)  # Preferred namespace prefix

    # Usage statistics
    lodRanking = models.IntegerField(default=0)

    # Vocabulary example
    example = models.CharField(max_length=8196, blank=True, null=False)

    # Logging
    uploader = models.ForeignKey(User)
    datePublished = models.DateField(blank=True, null=True)  # Original vocabulary publish date
    dateCreated = models.DateField(blank=True, null=True, default=datetime.now)  # Vocabulary creation inside LinDa
    dateModified = models.DateField(blank=True, null=True, default=datetime.now)  # Last vocabulary modification

    # Social properties
    score = models.IntegerField(default=0)  # Sum of the votes for the vocabulary
    votes = models.IntegerField(default=0)  # Number of votes for the vocabulary
    downloads = models.IntegerField(default=0)  # Number of downloads for the vocabulary

    # Versioning
    version = models.CharField(max_length=128, blank=False, null=False, default="1.0")

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
        document = urllib.urlopen(self.downloadUrl)

        if document.getcode() == 404:  # not found
            return

        rdf_data = document.read()
        g.parse(data=rdf_data, format=guess_format(self.downloadUrl))

        # Register a temporary SparQL endpoint for this rdf
        '''
        plugin.register('sparql', rdflib.query.Processor, 'rdfextras.sparql.processor', 'Processor')
        plugin.register('sparql', rdflib.query.Result, 'rdfextras.sparql.query', 'SPARQLQueryResult')
        '''

        # Run a query to retrieve all classes
        # Use COALESCE to overcome RDFLib bug of KeyError exceptions on unbound optional fields
        q_classes = g.query(
            """ SELECT ?class (COALESCE(?classLabel, "") AS ?cLabel) (COALESCE(?classComment, "") AS ?cComment)
                WHERE {
                    ?class rdf:type rdfs:Class.
                    OPTIONAL {
                        ?class rdfs:label ?classLabel .
                        ?class rdfs:comment ?classComment.
                    }.
                }""")

        # Store the classes in the database

        for row in q_classes.result:
            if row[1]:
                label = row[1]
            else:
                label = get_label_by_uri(row[0])
            if row[2]:
                description = row[2]
            else:
                description = ""
            try:
                cls = VocabularyClass.objects.create(vocabulary=self, uri=row[0].encode("utf-8"), label=label.encode("utf-8"), description=description.encode("utf-8"))
            except UnicodeEncodeError:
                cls = VocabularyClass.objects.create(vocabulary=self, uri=row[0], label=get_label_by_uri(row[0]), description="")
            cls.save()

        # Run a query to retrieve all properties
        # Use COALESCE to overcome RDFLib bug of KeyError exceptions on unbound optional fields
        q_properties = g.query(
            """ SELECT DISTINCT ?property ?domain ?range (COALESCE(?propertyLabel, "") AS ?pLabel) (COALESCE(?propertyComment, "") AS ?pComment)
                WHERE {
                    ?property rdfs:domain ?domain.
                    ?property rdfs:range ?range.
                    OPTIONAL {
                        ?property rdfs:label ?propertyLabel.
                        ?property rdfs:comment ?propertyComment.
                    }.
                }""")

        # Store the properties in the database
        for row in q_properties.result:
            if row[3]:
                label = row[3]
            else:
                label = get_label_by_uri(row[0])
            if row[4]:
                description = row[4]
            else:
                description = ""
            try:
                prp = VocabularyProperty.objects.create(vocabulary=self, uri=row[0].encode("utf-8"), domain=row[1].encode("utf-8"), range=row[2].encode("utf-8"), label=label.encode("utf-8"), description=description.encode("utf-8"))
            except UnicodeEncodeError:
                prp = VocabularyProperty.objects.create(vocabulary=self, uri=row[0], domain=row[1], range=row[2], label=get_label_by_uri(row[0]), description="")
            prp.save()

    def __unicode__(self):
        return self.title


# Update classes and vocabularies on new vocabulary save
def on_vocabulary_save(sender, instance, created, **kwargs):
    instance.make_classes_properties()

post_save.connect(on_vocabulary_save, sender=Vocabulary)


class VocabularyRanking(models.Model):  # A specific vote for a vocabulary (1-5)
    voter = models.ForeignKey(User)
    vocabularyRanked = models.ForeignKey(Vocabulary)
    vote = models.IntegerField()


class VocabularyClass(models.Model):  # A class inside an RDF vocabulary
    vocabulary = models.ForeignKey(Vocabulary)
    uri = models.URLField(max_length=2048, blank=False, null=True)
    label = models.CharField(max_length=256, blank=False, null=False)
    description = models.CharField(max_length=8196, blank=True, null=True)

    def __unicode__(self):
        return self.label


class VocabularyProperty(models.Model):  # A property inside an RDF vocabulary
    vocabulary = models.ForeignKey(Vocabulary)
    uri = models.URLField(max_length=2048, blank=False, null=True)
    domain = models.URLField(max_length=2048, blank=False, null=True)
    range = models.URLField(max_length=2048, blank=False, null=True)
    label = models.CharField(max_length=256, blank=False, null=False)
    description = models.CharField(max_length=8196, blank=True, null=True)

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
    is_public = models.BooleanField(default=False)  # true if datasource is public
    name = models.CharField(max_length=512, blank=False, null=False)  # datasource name - slug
    uri = models.CharField(max_length=2048, blank=False, null=False)  # sesame uri
    createdOn = models.DateField(blank=False, null=False)  # datasource creation date
    lastUpdateOn = models.DateField(blank=False, null=False)  # datasource last edit date

    def __unicode__(self):
        return self.title

    def get_endpoint(self):
        if self.is_public:
            return self.uri
        else:
            return LINDA_HOME + "sparql/" + self.name + "/"


# Given an endpoint name and a query it creates a description of the query
def create_query_description(dtname, query):
    # create base description
    find_verbs = ["Find", "Search for", "Look up for", "Get", "List"]

    # get class name
    classes = ''
    class_cnt = 0  # no classes yet

    # add constraints
    where_start = re.search('WHERE', query, re.IGNORECASE).end()
    if where_start:
        where_end = re.search('LIMIT', query, re.IGNORECASE).start()
        if not where_end:
            where_end = len(query)

        # split where part to constraints
        where_str = re.sub('({|}|\n)', '', query[where_start:where_end])  # ignore {, } and \n
        where_str = re.sub('(<|>|\n)', '"', where_str)
        r = re.compile(r'(?:[^."]|"[^"]*")+')
        where_constraints = r.findall(where_str)  # split by . outside of "entities"

        constraints_out = ''
        first_constraint = True
        for constraint in where_constraints:
            terms = constraint.split()

            if len(terms) < 3:
                continue

            if terms[1].lower() == 'rdf:type':  # class constraints
                tp_pos = 2
                class_constraint = ''
                old_class_name = ''
                while tp_pos < len(terms):
                    class_name = get_label_by_uri(terms[tp_pos]).lower()

                    # get seperator
                    if tp_pos < len(terms) - 2:
                        sep = ', '
                    else:
                        sep = ' or '

                    if not old_class_name:
                        class_constraint += pluralize(class_name)
                    elif old_class_name.lower() == class_name.lower():
                        class_constraint += sep + pluralize(class_name)
                    else:
                        class_constraint += sep + pluralize(class_name)

                    old_class_name = class_name
                    tp_pos += 4  # move to the next sub-contraint

                # add these classes to total class constraint
                if class_cnt == 0:  # first class
                    classes = class_constraint
                elif class_cnt == 1:  # second class
                    classes += ' that are also ' + class_constraint
                else:
                    classes += ' and ' + class_constraint
                class_cnt += 1

                continue

            if terms[2][0] == '?':
                continue  # ignore static constraints

            tp_pos = 1  # first constraint property
            old_tp_name = ''
            constraint_str = ''
            while tp_pos < len(terms):  # foreach sub-constraint in the union
                tp_name = get_label_by_uri(terms[tp_pos])
                # get seperator
                if tp_pos < len(terms) - 2:
                    sep = ', '
                else:
                    sep = ' or '

                if not old_tp_name:
                    constraint_str += tp_name + ' is '
                elif old_tp_name.lower() == tp_name.lower():
                    constraint_str += sep
                else:
                    constraint_str += sep + tp_name + ' is '
                constraint_str += get_label_by_uri(terms[tp_pos+1])

                old_tp_name = tp_name
                tp_pos += 4  # move to the next sub-contraint

            # add 'and' if it is not the first constraint
            if first_constraint:
                constraints_out += ' where ' + constraint_str
                first_constraint = False
            else:
                constraints_out += ' and ' + constraint_str

    if not classes:  # no class detected
        classes = 'objects'

    description = random(find_verbs) + " " + classes + " in " + dtname + constraints_out

    # add limit
    lim_pos = re.search('LIMIT', query, re.IGNORECASE).start()
    if lim_pos:
        after_lim = query[lim_pos:]
        lim = [int(s) for s in after_lim.split() if s.isdigit()][0]  # first number after limit
        description += ' (first ' + str(lim) + ')'

    return description


class Query(models.Model):
    endpoint = models.URLField(blank=False, null=False)  # the query endpoint
    sparql = models.CharField(max_length=4096, blank=False, null=False)  # the query string (select ?s ?p ?o...)
    description = models.CharField(max_length=512, blank=True, null=True)  # query description (auto-created)
    createdOn = models.DateField(blank=False, null=False)  # query creation date

    def csv_link(self):
        return RDF2ANY_SERVER + '/rdf2any/v1.0/convert/csv-converter.csv?dataset=' + self.endpoint + '&query=' \
            + urllib.quote_plus(self.sparql)

    def get_datasource(self):
        for datasource in DatasourceDescription.objects.all():
            if datasource.get_endpoint() == self.endpoint:
                return datasource

        return None
