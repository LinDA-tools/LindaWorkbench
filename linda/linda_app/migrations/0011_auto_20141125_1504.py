# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('linda_app', '0010_auto_20141125_1448'),
    ]

    operations = [
        migrations.AddField(
            model_name='vocabularyproperty',
            name='domain',
            field=models.URLField(max_length=2048, null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='vocabularyproperty',
            name='range',
            field=models.URLField(max_length=2048, null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='vocabularyclass',
            name='comment',
            field=models.CharField(max_length=2048, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='vocabularyproperty',
            name='comment',
            field=models.CharField(max_length=2048, null=True, blank=True),
        ),
    ]
