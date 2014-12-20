# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('linda_app', '0006_auto_20141113_1044'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vocabulary',
            name='dateCreated',
            field=models.DateField(default=datetime.datetime(2014, 11, 13, 15, 44, 15, 744000), null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='vocabulary',
            name='dateModified',
            field=models.DateField(default=datetime.datetime(2014, 11, 13, 15, 44, 15, 744000), null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='vocabulary',
            name='title',
            field=models.CharField(max_length=256),
        ),
    ]
