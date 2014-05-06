from django.db import models
from django.contrib.auth.models import User
from lists import *
from django.db.models import ImageField
from imagekit.models import ImageSpecField
from PIL import Image
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
		