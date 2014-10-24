# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('linda_app', '0002_vocabulary_lodranking'),
    ]

    operations = [
        migrations.AddField(
            model_name='datasourcedescription',
            name='is_public',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
