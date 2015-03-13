import time
from django.core.management import BaseCommand
from endpoint_monitor.app_settings import MONITOR_INTERVAL
from endpoint_monitor.views import monitor_datasources


class Command(BaseCommand):
    args = ''
    help = 'Monitors all remote sparql endpoints'

    def handle(self, *args, **options):
        while True:
            monitor_datasources()
            time.sleep(MONITOR_INTERVAL)