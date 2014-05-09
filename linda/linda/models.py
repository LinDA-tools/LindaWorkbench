from django.db import models
from django.db.models import ImageField
from django.contrib.auth.models import User
from django.template.defaultfilters import slugify

from lists import *
from PIL import Image
from imagekit.models import ImageSpecField
from athumb.fields import ImageWithThumbsField

User.profile = property(lambda u: UserProfile.objects.get_or_create(user=u)[0])

photo_upload_path = 'static/images/photos/'

class UserProfile(models.Model):
	"""
	Extends basic User class in django.contrib.auth
	"""
	user = models.OneToOneField(User)
	
	nameAppearance = models.CharField(max_length=256, blank=True, null=True) #Information on the way the name is displayed in public (for instance, Dimitris Batis or Dimitris G. Batis or Batis Dimitris)
	country = models.CharField(max_length=3, default='--', choices=COUNTRIES) #combobox PREDEFINED LIST. LIST "COUNTRIES"
	facebookUrl = models.URLField(max_length=256, blank=True, null=True) #User's Facebook profile
	twitterUrl = models.URLField(max_length=256, blank=True, null=True) #User's Twitter profile
	googleUrl = models.URLField(max_length=256, blank=True, null=True) #User's Google+ profile
	linkedInUrl = models.URLField(max_length=256, blank=True, null=True) #User's LinkedIn profile
	websiteUrl = models.URLField(max_length=256, blank=True, null=True) #User's personal website
	scientific_background = models.CharField(max_length=10, default='--', choices= SCIENTIFIC_DOMAINS) # PREDEFINED LIST. LIST "SCIENTIFIC DOMAINS"

	
UserProfile.avatar = property(lambda d: Photo.objects.get_or_create(user_profile=d)[0])
	
class Photo(models.Model):
	user_profile = models.ForeignKey(UserProfile)
	photo_original = ImageWithThumbsField(
		upload_to = photo_upload_path,
			thumbs=(
				('48x48', {'size': (48, 48), 'crop': True}),
				('68x68', {'size': (68, 68), 'crop': True}),
				('100x100', {'size': (100, 100), 'crop': True}),
				('150x150', {'size': (150, 150), 'crop': True}),
			),
		blank=True, 
		null=True)

	def __unicode__(self):
		return "%d" % self.id
	
class Vocabulary(models.Model):
	title = models.CharField(max_length=128, blank=False, null=False)
	description = models.CharField(max_length=2048, blank=False, null=False)
	category = models.CharField(max_length=256, blank=True, choices=CATEGORIES)  #checkbox-list, PREDEFINED LIST - LIST "CATEGORIES"
	uploader = models.ForeignKey(User)
	originalUrl = models.URLField(max_length=256, blank=True, null=True) #Location of the original vocabulary (for instance, in the publisher's website)
	downloadUrl = models.URLField(max_length=256, blank=True, null=True) #Location of the original vocabulary (for instance, in the publisher's website)
	datePublished = models.DateField(blank=True, null=True) #Original vocabulary publish date
	dateCreated = models.DateField(blank=True, null=True) #Vocabulary creation inside LinDa
	dateModified = models.DateField(blank=True, null=True) #Last vocabulary modification
	
	#Social properties
	score = models.IntegerField() #Sum of the votes for the vocabulary
	votes = models.IntegerField() #Number of votes for the vocabulary 
	downloads = models.IntegerField() #Number of downloads for the vocabulary
	
	def title_slug(self):
		return slugify(self.title)
		
	def get_absolute_url(self):
		return u'/vocabulary/%d/%s' % (self.id, self.title_slug())
		
	def has_been_voted(self):
		return score > 0
		
	def get_score(self):
		return float(self.score) / self.votes

	def hasVoted(self, user):
		return false
		
class VocabularyRanking(models.Model):
	voter = models.ForeignKey(User)
	vocabularyRanked = models.ForeignKey(Vocabulary)
	vote = models.IntegerField()
	
class VocabularyComments(models.Model):
	commentText = models.CharField(max_length=512, blank=False, null=False)
	vocabularyCommented = models.ForeignKey(Vocabulary)
	user = models.ForeignKey(User)