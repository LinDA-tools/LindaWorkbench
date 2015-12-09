from django.core.management import BaseCommand

from linda_app.installer.views import install_repositories

__author__ = 'dipap'


class Command(BaseCommand):
    help = 'Install required RDF repositories'

    def handle(self, *args, **options):
        install_repositories()
