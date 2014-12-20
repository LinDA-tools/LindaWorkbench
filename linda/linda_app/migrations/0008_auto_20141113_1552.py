# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('linda_app', '0007_auto_20141113_1544'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vocabulary',
            name='dateCreated',
            field=models.DateField(default=datetime.datetime(2014, 11, 13, 15, 52, 46, 703000), null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='vocabulary',
            name='dateModified',
            field=models.DateField(default=datetime.datetime(2014, 11, 13, 15, 52, 46, 703000), null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='vocabularyclass',
            name='label',
            field=models.CharField(max_length=256),
        ),
        migrations.AlterField(
            model_name='vocabularyclass',
            name='uri',
            field=models.URLField(max_length=2048, null=True),
        ),
        migrations.AlterField(
            model_name='vocabularyproperty',
            name='label',
            field=models.CharField(max_length=256),
        ),
        migrations.AlterField(
            model_name='vocabularyproperty',
            name='uri',
            field=models.URLField(max_length=2048, null=True),
        ),
    ]
