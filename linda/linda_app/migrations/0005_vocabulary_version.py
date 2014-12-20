# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('linda_app', '0004_query'),
    ]

    operations = [
        migrations.AddField(
            model_name='vocabulary',
            name='version',
            field=models.CharField(default=b'1.0', max_length=128),
            preserve_default=True,
        ),
    ]
