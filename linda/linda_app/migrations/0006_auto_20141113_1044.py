# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('linda_app', '0005_vocabulary_version'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vocabulary',
            name='dateCreated',
            field=models.DateField(default=datetime.datetime(2014, 11, 13, 10, 44, 10, 867000), null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='vocabulary',
            name='dateModified',
            field=models.DateField(default=datetime.datetime(2014, 11, 13, 10, 44, 10, 867000), null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='vocabulary',
            name='downloads',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='vocabulary',
            name='score',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='vocabulary',
            name='votes',
            field=models.IntegerField(default=0),
        ),
    ]
