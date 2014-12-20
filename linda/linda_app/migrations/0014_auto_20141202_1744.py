# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('linda_app', '0013_auto_20141125_2055'),
    ]

    operations = [
        migrations.AddField(
            model_name='vocabularyproperty',
            name='parent',
            field=models.URLField(max_length=2048, null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='vocabularyproperty',
            name='domain',
            field=models.URLField(max_length=2048, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='vocabularyproperty',
            name='range',
            field=models.URLField(max_length=2048, null=True, blank=True),
        ),
    ]
