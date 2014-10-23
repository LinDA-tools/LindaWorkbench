# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('linda_app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='vocabulary',
            name='lodRanking',
            field=models.IntegerField(default=0),
            preserve_default=True,
        ),
    ]
