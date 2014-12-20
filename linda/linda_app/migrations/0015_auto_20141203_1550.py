# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('linda_app', '0014_auto_20141202_1744'),
    ]

    operations = [
        migrations.RenameField(
            model_name='vocabularyproperty',
            old_name='parent',
            new_name='parent_uri',
        ),
    ]
