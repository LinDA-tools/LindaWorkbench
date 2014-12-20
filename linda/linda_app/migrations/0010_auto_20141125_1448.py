# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('linda_app', '0009_auto_20141125_1444'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vocabularyclass',
            name='comment',
            field=models.CharField(max_length=1024, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='vocabularyproperty',
            name='comment',
            field=models.CharField(max_length=1024, null=True, blank=True),
        ),
    ]
