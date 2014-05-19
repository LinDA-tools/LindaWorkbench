from django import template
from django.template.defaultfilters import stringfilter

register = template.Library()


@register.filter
def nice_name(user):
    return user.get_full_name() or user.username