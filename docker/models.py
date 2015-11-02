from datetime import datetime
from time import timezone
import urllib
from urllib.parse import quote
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.template.defaultfilters import slugify, random
from django.utils.http import urlquote
from rdflib import Graph, OWL, RDFS
from rdflib.util import guess_format
import requests
from lxml import etree as et
from linda_app.multiple_choice_field import MultiSelectField
from query_designer.models import Design
from urllib.error import HTTPError
import re
from linda_app.lists import *

from linda_app.settings import LINDA_HOME

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
    end_pos = label.find('"')
    if end_pos < 0:
        label = label[start_pos:]
    else:
        label = label[start_pos:end_pos]
    label = re.sub(r'([a-z](?=[A-Z])|[A-Z](?=[A-Z][a-z]))', r'\1 ',
                   label)  # insert space for words written in camelCase
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

    def __init__(self, *args, **kwargs):
        self.prevent_default_make = kwargs.pop('prevent_default_make', False)
        super(Vocabulary, self).__init__(*args, **kwargs)

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
        try:
            document = urllib.request.urlopen(self.downloadUrl)

            if document.getcode() == 404:  # not found
                return

            rdf_data = document.read()
            g.parse(data=rdf_data, format=guess_format(self.downloadUrl))
            g.bind("rdfs", RDFS)
            g.bind("owl", OWL)

            # Register a temporary SparQL endpoint for this rdf
            '''
            plugin.register('sparql', rdflib.query.Processor, 'rdfextras.sparql.processor', 'Processor')
            plugin.register('sparql', rdflib.query.Result, 'rdfextras.sparql.query', 'SPARQLQueryResult')
            '''

            # Run a query to retrieve all classes
            # Use COALESCE to overcome RDFLib bug of KeyError exceptions on unbound optional fields
            q_classes = g.query(
                """
                    SELECT ?class (COALESCE(?classLabel, "") AS ?cLabel) (COALESCE(?classComment, "") AS ?cComment)
                    WHERE {
                        {?class rdf:type rdfs:Class} UNION {?class rdf:type owl:Class}.
                        OPTIONAL {?class rdfs:label ?classLabel}.
                        OPTIONAL {?class rdfs:comment ?classComment}.
                    }""")

            # Store the classes in the database

            for row in q_classes.result:
                if not row[0].startswith(self.preferredNamespaceUri):
                    # don't allow vocabularies define classes outside of their scope
                    continue

                # update label for class that exists
                class_objects = VocabularyClass.objects.filter(uri=row[0])
                if class_objects:
                    label = row[1].encode("utf-8")
                    class_object = class_objects[0]
                    if (label and (not class_object.label)) or (label and row[1].language == 'en'):
                        class_object.label = label
                        class_object.save()

                    continue

                if row[1]:
                    label = row[1]
                else:
                    label = get_label_by_uri(row[0])
                if row[2]:
                    description = row[2]
                else:
                    description = ""
                try:
                    cls = VocabularyClass.objects.create(vocabulary=self, uri=row[0].encode("utf-8"),
                                                         label=label.encode("utf-8"),
                                                         description=description.encode("utf-8"))
                except UnicodeEncodeError:
                    cls = VocabularyClass.objects.create(vocabulary=self, uri=row[0], label=get_label_by_uri(row[0]),
                                                         description="")
                cls.save()

            # Run a query to retrieve all properties
            # Use COALESCE to overcome RDFLib bug of KeyError exceptions on unbound optional fields
            q_properties = g.query(
                """ SELECT DISTINCT ?property
                                    (COALESCE(?domain, "") AS ?d)
                                    (COALESCE(?range, "") AS ?r)
                                    (COALESCE(?propertyLabel, "") AS ?pLabel)
                                    (COALESCE(?propertyComment, "") AS ?pComment)
                                    (COALESCE(?parent, "") AS ?p)
                    WHERE {
                        VALUES ?propertyType { rdf:Property owl:ObjectProperty owl:DatatypeProperty owl:AnnotationProperty }
                        ?property rdf:type ?propertyType.

                        OPTIONAL {?property rdfs:domain ?domain}.
                        OPTIONAL {?property rdfs:range ?range}.
                        OPTIONAL {?property rdfs:subPropertyOf ?parent}.
                        OPTIONAL {?property rdfs:label ?propertyLabel}.
                        OPTIONAL {?property rdfs:comment ?propertyComment}.
                    }
                    """)
            # Store the properties in the database
            for row in q_properties.result:
                if not row[0].startswith(self.preferredNamespaceUri):
                    # don't allow vocabularies define properties outside of their scope
                    continue

                # update label for properties that exist
                property_objects = VocabularyProperty.objects.filter(uri=row[0])
                if property_objects:
                    label = row[3].encode("utf-8")
                    property_object = property_objects[0]
                    if (label and (not property_object.label)) or (label and row[3].language == 'en'):
                        property_object.label = label
                        property_object.save()

                    continue

                if row[3]:
                    label = row[3]
                else:
                    label = get_label_by_uri(row[0])
                if row[4]:
                    description = row[4]
                else:
                    description = ""
                try:
                    prp = VocabularyProperty.objects.create(vocabulary=self, uri=row[0].encode("utf-8"),
                                                            domain=row[1].encode("utf-8"), range=row[2].encode("utf-8"),
                                                            label=label.encode("utf-8"),
                                                            description=description.encode("utf-8"), parent_uri=row[5])
                except UnicodeEncodeError:
                    prp = VocabularyProperty.objects.create(vocabulary=self, uri=row[0], domain=row[1], range=row[2],
                                                            label=get_label_by_uri(row[0]), description="",
                                                            parent_uri=row[5])
                prp.save()

        except:
            pass

    def __unicode__(self):
        return self.title


# Update classes and vocabularies on new vocabulary save
def on_vocabulary_save(sender, instance, created, **kwargs):
    if not instance.prevent_default_make:  # use an attribute to allow overriding the default action
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

    def get_absolute_url(self):
        return u'/class/%d/' % self.id

    def domain_of(self, limit=None):
        return VocabularyProperty.objects.filter(domain=self.uri)

    def range_of(self, limit=None):
        return VocabularyProperty.objects.filter(range=self.uri)


class VocabularyProperty(models.Model):  # A property inside an RDF vocabulary
    vocabulary = models.ForeignKey(Vocabulary)  # the vocabulary defining the property
    uri = models.URLField(max_length=2048, blank=False, null=True)  # the URI of the property
    parent_uri = models.URLField(max_length=2048, blank=True, null=True)  # the parent property if it is a sub-property
    domain = models.URLField(max_length=2048, blank=True, null=True)  # the domain URI
    range = models.URLField(max_length=2048, blank=True, null=True)  # the range URI
    label = models.CharField(max_length=256, blank=False, null=False)  # property label
    description = models.CharField(max_length=8196, blank=True, null=True)  # long description

    def __unicode__(self):
        return self.label

    def get_absolute_url(self):
        return u'/property/%d/' % self.id

    # Gets the domain of the property
    # For sub-properties without a domain defined, it returns the domain of its parent
    def domain_uri(self):
        if self.domain:
            return self.domain
        else:
            parent_object = self.get_parent_object()
            if parent_object:
                return parent_object.domain_uri()

        return ""

    # Gets the range of the property
    # For sub-properties without a range defined, it returns the range of its parent
    def range_uri(self):
        if self.range:
            return self.range
        else:
            parent_object = self.get_parent_object()
            if parent_object:
                return parent_object.range_uri()

        return ""

    # Returns the domain as a VocabularyClass instance (if it exists)
    def get_domain_object(self):
        domain_objects = VocabularyClass.objects.filter(uri=self.domain_uri())
        if domain_objects:
            return domain_objects[0]
        else:
            return None

    # Returns the range as a VocabularyClass instance (if it exists)
    def get_range_object(self):
        range_objects = VocabularyClass.objects.filter(uri=self.range_uri())
        if range_objects:
            return range_objects[0]
        else:
            return None

    # Returns the parent as a VocabularyProperty instance (if it exists)
    def get_parent_object(self):
        if not self.parent_uri:
            return None

        parent_objects = VocabularyProperty.objects.filter(uri=self.parent_uri)
        if parent_objects:
            return parent_objects[0]
        else:
            return None

    # Gets the redirect url when domain is clicked
    def get_domain_url(self):
        domain_object = self.get_domain_object()
        if domain_object:
            return '/class/' + str(domain_object.id) + '/'
        else:
            return self.domain_uri()

    # Gets the redirect url when range is clicked
    def get_range_url(self):
        range_object = self.get_range_object()
        if range_object:
            return '/class/' + str(range_object.id) + '/'
        else:
            return self.range_uri()

    # Gets the redirect url when parent property is clicked
    def get_parent_url(self):
        if not self.parent_uri:
            return ""

        parent_object = self.get_parent_object()
        if parent_object:
            return '/property/' + str(parent_object.id) + '/'
        else:
            return self.parent_uri


Vocabulary.property = property(lambda d: VocabularyProperty.objects.get_or_create(vocabulary=d)[0])


class VocabularyComments(models.Model):
    commentText = models.CharField(max_length=512, blank=False, null=False)  # Comment content
    vocabularyCommented = models.ForeignKey(Vocabulary)  # Vocabulary-discussion
    user = models.ForeignKey(User)  # Comment author
    timePosted = models.DateTimeField(blank=True, null=True)  # Comment timestamp


class RSSInfo(models.Model):
    url = models.URLField(max_length=2048, blank=False, null=False)  # RSS url
    lastDataFetchOn = models.DateTimeField(blank=False, null=False, default=datetime.now)  # datasource creation date
    interval = models.IntegerField(default=3600)  # update every RSS feed every hour by default


# transform rss to rdf
def rss2rdf(rss_url):
    # create the parser
    parser = et.XMLParser(ns_clean=True, recover=True, encoding='utf-8')

    # parse the original RSS XML document
    rss_str = requests.get(rss_url).text.encode('utf-8')
    rss = et.fromstring(rss_str, parser=parser)

    if rss.tag == 'rdf':
        # already rss 1.0
        return rss_str
    elif rss.tag == 'feed':
        # atom to rss 2.0
        xslt_str = b'<?xml version="1.0" encoding="UTF-8"?>\n<xsl:stylesheet\n              xmlns:xsl="http://www.w3.org/1999/XSL/Transform"\n              xmlns:atom="http://www.w3.org/2005/Atom"\n              version="1.0">\n  <xsl:output method="xml" version="1.0" encoding="UTF-8"\n              indent="no"\n              media-type="application/rss+xml" />\n\n  <xsl:template match="@*|node()">\n    <xsl:copy><xsl:apply-templates select="@*|node()"/></xsl:copy>\n  </xsl:template>\n\n  <xsl:template match="/atom:feed">\n    <rss version="2.0">\n      <channel>\n        <xsl:apply-templates select="node()"/>\n        <xsl:if test="not(atom:summary)">\n          <description><xsl:value-of select="atom:title"/></description>\n        </xsl:if>\n      </channel>\n    </rss>\n  </xsl:template>\n\n  <xsl:template match="atom:feed">\n    <channel><xsl:apply-templates select="node()"/></channel>\n  </xsl:template>\n\n  <xsl:template match="atom:title">\n    <title><xsl:apply-templates select="node()"/></title>\n  </xsl:template>\n\n  <xsl:template match="atom:link[@rel=\'self\']">\n    <xsl:copy><xsl:apply-templates select="@*|node()"/></xsl:copy>\n  </xsl:template>\n\n  <xsl:template match="atom:link[1]">\n    <link><xsl:value-of select="@href"/></link>\n  </xsl:template>\n\n  <xsl:template match="atom:category">\n    <category><xsl:value-of select="@term"/></category>\n  </xsl:template>\n\n  <xsl:template match="atom:summary">\n    <description><xsl:apply-templates select="node()"/></description>\n  </xsl:template>\n\n  <xsl:template match="atom:entry">\n    <item><xsl:apply-templates select="node()"/></item>\n  </xsl:template>\n\n  <xsl:template match="atom:published">\n    <pubDate><xsl:apply-templates select="node()"/></pubDate>\n  </xsl:template>\n\n  <xsl:template match="atom:entry/atom:id">\n    <guid><xsl:apply-templates select="node()"/></guid>\n  </xsl:template>\n\n  <xsl:template match="atom:source"/>\n</xsl:stylesheet>'
        xslt = et.fromstring(xslt_str)
        transform = et.XSLT(xslt)
        rss_dom = transform(rss)
        rss = et.tostring(rss_dom, pretty_print=True)

    # rss 2.0 to rss 1.0
    xslt_str = b'<?xml version="1.0" encoding="UTF-8"?>\n<xsl:stylesheet version="1.0"\nxmlns:xsl="http://www.w3.org/1999/XSL/Transform"\nxmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"\nxmlns="http://purl.org/rss/1.0/"\nxmlns:dc="http://purl.org/dc/elements/1.1/"\nxmlns:sy="http://purl.org/rss/1.0/modules/syndication/"\nxmlns:admin="http://webns.net/mvcb/">\n	<xsl:output method="xml" indent="yes"/>\n	<xsl:template match="rss">\n		<rdf:RDF\nxmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">\n			<xsl:apply-templates select="channel"/>\n			<xsl:apply-templates select="channel/image"/>\n			<xsl:apply-templates select="channel/item"/>\n			<xsl:apply-templates\nselect="channel/textinput"/>\n		</rdf:RDF>\n	</xsl:template>\n	<xsl:template match="channel">\n		<channel rdf:about="{link}">\n			<xsl:apply-templates select="title | description\n| link"/>\n			<xsl:copy-of select="dc:* | sy:* | admin:*"/>\n			<xsl:apply-templates select="image"\nmode="channel"/>\n			<items>\n				<rdf:Seq>\n					<xsl:for-each select="item">\n						<rdf:li>\n							<xsl:attribute\nname="rdf:resource">\n\n<xsl:value-of select="link"/>\n							</xsl:attribute>\n						</rdf:li>\n					</xsl:for-each>\n				</rdf:Seq>\n			</items>\n			<textinput>\n				<xsl:value-of select="textinput"/>\n			</textinput>\n		</channel>\n	</xsl:template>\n	<xsl:template match="channel/image">\n		<image>\n			<xsl:attribute name="rdf:about">\n				<xsl:value-of select="url"/>\n			</xsl:attribute>\n			<xsl:apply-templates select="title"/>\n			<xsl:apply-templates select="link"/>\n			<url>\n				<xsl:value-of select="image/url"/>\n			</url>\n		</image>\n	</xsl:template>\n	<xsl:template match="channel/image" mode="channel">\n		<image rdf:resource="{image/url}"/>\n	</xsl:template>\n	<xsl:template match="channel/item">\n		<item>\n			<xsl:attribute name="rdf:about">\n				<xsl:value-of select="link"/>\n			</xsl:attribute>\n			<xsl:apply-templates select="title"/>\n			<xsl:apply-templates select="link"/>\n			<xsl:apply-templates select="description"/>\n			<xsl:copy-of select="dc:* | sy:* | admin:*"/>\n		</item>\n	</xsl:template>\n	<xsl:template match="channel/textinput">\n		<textinput>\n			<xsl:attribute name="rdf:about">\n				<xsl:value-of select="url"/>\n			</xsl:attribute>\n			<xsl:apply-templates select="title"/>\n			<xsl:apply-templates select="description"/>\n			<xsl:apply-templates select="name"/>\n			<xsl:apply-templates select="link"/>\n		</textinput>\n	</xsl:template>\n	<xsl:template match="title | description | link | name">\n		<xsl:element name="{local-name()}"\nnamespace="http://purl.org/rss/1.0/">\n			<xsl:apply-templates/>\n		</xsl:element>\n	</xsl:template>\n</xsl:stylesheet>'

    # parse the XSLT document
    xslt = et.fromstring(xslt_str)

    # apply the xslt and create the new dom
    transform = et.XSLT(xslt)
    rdf_dom = transform(rss)

    # get the RDF/XML string
    return et.tostring(rdf_dom, pretty_print=True)


class DatasourceDescription(models.Model):
    title = models.CharField(max_length=512, blank=False, null=False)  # datasource title
    is_public = models.BooleanField(default=False)  # true if datasource is public
    name = models.CharField(max_length=512, blank=False, null=False)  # datasource name - slug
    uri = models.CharField(max_length=2048, blank=False, null=False)  # sesame uri or endpoint
    createdOn = models.DateField(blank=False, null=False)  # datasource creation date
    updatedOn = models.DateField(blank=False, null=False)  # datasource last edit date
    rss_info = models.ForeignKey(RSSInfo, null=True, blank=True, default=None)  # info for RSS datasources
    createdBy = models.ForeignKey(User, null=True, blank=True, default=None)  # user who created the datasource

    def __unicode__(self):
        return self.title

    def get_endpoint(self):
        if self.is_public:
            return self.uri
        else:
            return LINDA_HOME + "sparql/" + self.name + "/"

    def update_rss(self):
        if self.rss_info:
            # replace the local rdf copy
            headers = {'accept': 'application/json'}
            data = {"content": rss2rdf(self.rss_info.url)}
            callReplace = requests.post(LINDA_HOME + "api/datasource/" + self.name +
                                           "/replace/?append=false", headers=headers, data=data)


# Transform [x1,x2,...,xN] to "x1, x2, ... and/or xN"
def str_extend(array, op_join='and'):
    result = array[0]

    for x in array[1:-1]:
        result += ', ' + x

    if len(array) > 1:
        result += ' ' + op_join + ' ' + array[-1]

    return result


# temporary
def pluralize(s):
    return s + 's'


# Given an endpoint name and a query it creates a description of the query
def create_query_description(dtname, query):
    # TODO : Update description constructor to cover more queries and be more descriptive
    # create base description
    find_verbs = ["Find", "Search for", "Look up for", "Get", "List"]

    # class instances
    instances = []

    # add constraints
    constraints_out = ''
    where_start_o = re.search('WHERE', query, re.IGNORECASE)

    if where_start_o:
        where_start = where_start_o.end()
        where_end_f = re.search('LIMIT', query, re.IGNORECASE)  # where can end at a LIMIT
        if not where_end_f:
            where_end_f = re.search('ORDER BY', query, re.IGNORECASE)  # at an ORDER BY
        if not where_end_f:
            where_end_f = re.search('GROUP BY', query, re.IGNORECASE)  # at a GROUP BY
        if not where_end_f:
            where_end = len(query)  # or at the end of the query
        else:
            where_end = where_end_f.start()

        # split where part to constraints
        where_str = re.sub('({|}|\n)', '', query[where_start:where_end])  # ignore {, } and \n
        where_str = re.sub('(<|>|\n)', '"', where_str)
        r = re.compile(r'(?:[^."]|"[^"]*")+')
        where_constraints = r.findall(where_str)  # split by . outside of "entities"

        first_constraint = True
        for constraint in where_constraints:
            terms = constraint.split()

            if len(terms) < 3:
                continue

            if terms[1].lower() == 'rdf:type' or terms[1].lower() == 'a':  # class instances
                instances.append(pluralize(get_label_by_uri(terms[2]).lower()))

            if terms[2][0] == '?':
                continue  # ignore variable constraints

    if not instances:  # no class detected
        classes = 'objects'
    else:
        classes = str_extend(instances)
    description = random(find_verbs) + " " + classes + " in " + dtname + constraints_out

    # add limit
    lim_pos_f = re.search('LIMIT', query, re.IGNORECASE)
    if lim_pos_f:
        lim_pos = lim_pos_f.start()
        after_lim = query[lim_pos:]
        lim = [int(s) for s in after_lim.split() if s.isdigit()][0]  # first number after limit
        description += ' (first ' + str(lim) + ')'

    return description


def datasource_from_endpoint(endpoint):
    if endpoint == LINDA_HOME + "sparql/all/":
        return DatasourceDescription(title="All private data dources", name="all", is_public=False
                                     , uri=LINDA_HOME + "sparql/all/", createdOn=datetime.today(),
                                     updatedOn=datetime.today())
    for datasource in DatasourceDescription.objects.all():
        if datasource.get_endpoint() == endpoint:
            return datasource

    return None


class Query(models.Model):
    endpoint = models.URLField(blank=False, null=False)  # the query endpoint
    sparql = models.CharField(max_length=4096, blank=False, null=False)  # the query string (select ?s ?p ?o...)
    description = models.CharField(max_length=512, blank=True, null=True)  # query description (auto-created)
    createdOn = models.DateField(blank=False, null=False)  # query creation date
    updatedOn = models.DateField(blank=False, null=True)  # query last update date
    design = models.ForeignKey(Design, blank=True, null=True)  # the json object produced in the Query Designer
    createdBy = models.ForeignKey(User, null=True, blank=True, default=None)  # user who created the query

    def __str__(self):
        return self.description

    def csv_link(self):
        return '/rdf2any/v1.0/convert/csv-converter.csv?dataset=' + urllib.parse.quote_plus(self.endpoint) + '&query=' \
               + urllib.parse.quote_plus(self.sparql.replace('\n', ' '))   

    def get_datasource(self):
        return datasource_from_endpoint(self.endpoint)

    def visualization_link(self):
        return "/visualizations/#/datasource/Query" + str(self.pk) + "/" + urllib.parse.quote_plus(urllib.parse.quote_plus(self.csv_link())) + "/-/csv"

    def analytics_link(self):
        return "/analytics?q_id=" + str(self.pk)


class Configuration(models.Model):
    # Vocabulary Repository
    # In local business installations it will be different than the LINDA_SERVER_IP
    vocabulary_repository = models.URLField(blank=False, null=False, default='http://linda.epu.ntua.gr/')
    # LinDA repository in Sesame (OpenRDF) url, in order to access private data sources
    sesame_url = models.URLField(blank=False, null=False,
                                 default='http://localhost:8080/openrdf-sesame/')
    # LinDA private resources SparQL endpoint
    private_sparql_endpoint = models.URLField(blank=False, null=False,
                                              default='http://localhost:8080/openrdf-sesame/repositories/linda')
    # QueryBuilder Fronted
    query_builder_server = models.URLField(blank=False, null=False, default='http://localhost:3100/')
    # Rdf2any Server
    rdf2any_server = models.URLField(blank=False, null=False, default='http://localhost:8081/')
    # Visualization backend
    visualization_backend = models.URLField(blank=False, null=False, default='http://localhost:3002/')
    # default categories
    default_categories = MultiSelectField(max_length=512, blank=True, null=False, default='', choices=CATEGORIES)


# returns the configuration object
# creates default configuration if it does not exist
def get_configuration():
    configs = Configuration.objects.all()
    if configs:
        return configs[0]
    else:
        return Configuration.objects.create()


class DefaultDatasources(models.Model):
    # A collection of default endpoints automatically fetched by the http://datahub.io/ project
    # Created whenever linda_app.views.get_endpoints_from_datahub() is run

    # The title of the datasource
    title = models.CharField(max_length=1024, blank=False, null=False)
    # A description of the datasource
    description = models.CharField(max_length=8128, blank=True, null=True, default='')
    # The format of the datasource (e.g api/sparql, application/rdf+xml etc.)
    format = models.CharField(max_length=128, blank=False, null=False)
    # Where it was defined by
    defined_at = models.URLField(blank=False, null=False)
    # The resource url
    url = models.URLField(blank=False, null=False, unique=True)
    # Size of the datasource
    # For SPARQL endpoints, this represents the number of triples
    size = models.IntegerField(blank=True, null=True, default=None)

    def is_endpoint(self):
        return self.format == 'api/sparql'

    def is_added(self):
        if self.format == 'api/sparql':
            return DatasourceDescription.objects.filter(uri=self.url).exists()
        else:
            return DatasourceDescription.objects.filter(title=self.title).exists()

    def get_default_action(self):
        if self.is_endpoint():
            return '/query-designer/?endpoint=' + quote(self.url, safe='')

        return None

    class Meta:
        ordering = ['-size']
