# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('linda_app', '0012_auto_20141125_2055'),
    ]

    operations = [
        migrations.RenameField(
            model_name='vocabularyclass',
            old_name='comment',
            new_name='description',
        ),
        migrations.RenameField(
            model_name='vocabularyproperty',
            old_name='comment',
            new_name='description',
        ),
    ]
