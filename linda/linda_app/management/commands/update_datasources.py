__author__ = 'dimitris'

import time
from datetime import datetime
from django.db.models import Q
from django.core.management import BaseCommand
from linda_app.models import DatasourceDescription
from linda_app.views import update_rss


class Command(BaseCommand):
    help = 'Update existing datasources'

    def handle(self, *args, **options):
        while True:
            # only update RSS datasources
            for datasource in DatasourceDescription.objects.filter(~Q(rss_info=None)):
                diff = datetime.now() - datasource.rss_info.lastDataFetchOn.replace(tzinfo=None)
                if diff.total_seconds() >= datasource.rss_info.interval:
                    # update rss
                    update_rss(datasource)
                    # update info & save
                    datasource.rss_info.lastDataFetchOn = datetime.now()
                    datasource.rss_info.save()
                    print(datasource.rss_info.lastDataFetchOn.strftime("%Y-%m-%d %H:%M:%S") + ' updated ' +
                          datasource.title)

            # sleep for a minute
            time.sleep(60)