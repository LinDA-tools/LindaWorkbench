# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('linda_app', '0008_auto_20141113_1552'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='vocabularyclass',
            name='ranking',
        ),
        migrations.RemoveField(
            model_name='vocabularyproperty',
            name='ranking',
        ),
        migrations.AddField(
            model_name='vocabularyclass',
            name='comment',
            field=models.CharField(max_length=256, null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='vocabularyproperty',
            name='comment',
            field=models.CharField(max_length=256, null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='vocabulary',
            name='dateCreated',
            field=models.DateField(default=datetime.datetime.now, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='vocabulary',
            name='dateModified',
            field=models.DateField(default=datetime.datetime.now, null=True, blank=True),
        ),
    ]
