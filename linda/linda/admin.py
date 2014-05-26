from django.contrib import admin

from models import *


class VocabularyAdmin(admin.ModelAdmin):
	pass
	
admin.site.register(Vocabulary, VocabularyAdmin)

class VocabularyRankingAdmin(admin.ModelAdmin):
	pass
	
admin.site.register(VocabularyRanking, VocabularyRankingAdmin)

class VocabularyCommentsAdmin(admin.ModelAdmin):
	pass
	
admin.site.register(VocabularyComments, VocabularyCommentsAdmin)