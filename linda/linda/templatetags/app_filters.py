from django import template

register = template.Library()


@register.filter
def nice_name(user):
    return user.get_full_name() or user.username