__author__ = 'dimitris'

from django.apps import AppConfig

class MessagesConfig(AppConfig):
    name = 'messages'
    label = 'linda.messages'  # <-- this is the important line - change it to anything other than the default ('foo' in this case)