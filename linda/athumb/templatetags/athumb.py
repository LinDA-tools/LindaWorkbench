from django.template import Library
from thumbnail2 import thumbnail

register = Library()

register.tag(thumbnail)
