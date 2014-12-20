# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('linda_app', '0003_datasourcedescription_is_public'),
    ]

    operations = [
        migrations.CreateModel(
            name='Query',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('endpoint', models.URLField()),
                ('sparql', models.CharField(max_length=4096)),
                ('description', models.CharField(max_length=512, null=True, blank=True)),
                ('createdOn', models.DateField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
