# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='DatasourceDescription',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=512)),
                ('name', models.CharField(max_length=512)),
                ('uri', models.CharField(max_length=2048)),
                ('createdOn', models.DateField()),
                ('lastUpdateOn', models.DateField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Photo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('nameAppearance', models.CharField(max_length=256, null=True, blank=True)),
                ('country', models.CharField(default=b'--', max_length=3, choices=[(b'--', 'Please choose a country..'), (b'AD', 'Andorra'), (b'AE', 'United Arab Emirates'), (b'AF', 'Afghanistan'), (b'AG', 'Antigua & Barbuda'), (b'AI', 'Anguilla'), (b'AL', 'Albania'), (b'AM', 'Armenia'), (b'AN', 'Netherlands Antilles'), (b'AO', 'Angola'), (b'AQ', 'Antarctica'), (b'AR', 'Argentina'), (b'AS', 'American Samoa'), (b'AT', 'Austria'), (b'AU', 'Australia'), (b'AW', 'Aruba'), (b'AZ', 'Azerbaijan'), (b'BA', 'Bosnia and Herzegovina'), (b'BB', 'Barbados'), (b'BD', 'Bangladesh'), (b'BE', 'Belgium'), (b'BF', 'Burkina Faso'), (b'BG', 'Bulgaria'), (b'BH', 'Bahrain'), (b'BI', 'Burundi'), (b'BJ', 'Benin'), (b'BM', 'Bermuda'), (b'BN', 'Brunei Darussalam'), (b'BO', 'Bolivia'), (b'BR', 'Brazil'), (b'BS', 'Bahama'), (b'BT', 'Bhutan'), (b'BV', 'Bouvet Island'), (b'BW', 'Botswana'), (b'BY', 'Belarus'), (b'BZ', 'Belize'), (b'CA', 'Canada'), (b'CC', 'Cocos (Keeling) Islands'), (b'CF', 'Central African Republic'), (b'CG', 'Congo'), (b'CH', 'Switzerland'), (b'CI', 'Ivory Coast'), (b'CK', 'Cook Iislands'), (b'CL', 'Chile'), (b'CM', 'Cameroon'), (b'CN', 'China'), (b'CO', 'Colombia'), (b'CR', 'Costa Rica'), (b'CU', 'Cuba'), (b'CV', 'Cape Verde'), (b'CX', 'Christmas Island'), (b'CY', 'Cyprus'), (b'CZ', 'Czech Republic'), (b'DE', 'Germany'), (b'DJ', 'Djibouti'), (b'DK', 'Denmark'), (b'DM', 'Dominica'), (b'DO', 'Dominican Republic'), (b'DZ', 'Algeria'), (b'EC', 'Ecuador'), (b'EE', 'Estonia'), (b'EG', 'Egypt'), (b'EH', 'Western Sahara'), (b'ER', 'Eritrea'), (b'ES', 'Spain'), (b'ET', 'Ethiopia'), (b'FI', 'Finland'), (b'FJ', 'Fiji'), (b'FK', 'Falkland Islands (Malvinas)'), (b'FM', 'Micronesia'), (b'FO', 'Faroe Islands'), (b'FR', 'France'), (b'FX', 'France, Metropolitan'), (b'GA', 'Gabon'), (b'GB', 'United Kingdom (Great Britain)'), (b'GD', 'Grenada'), (b'GE', 'Georgia'), (b'GF', 'French Guiana'), (b'GH', 'Ghana'), (b'GI', 'Gibraltar'), (b'GL', 'Greenland'), (b'GM', 'Gambia'), (b'GN', 'Guinea'), (b'GP', 'Guadeloupe'), (b'GQ', 'Equatorial Guinea'), (b'GR', 'Greece'), (b'GS', 'South Georgia and the South Sandwich Islands'), (b'GT', 'Guatemala'), (b'GU', 'Guam'), (b'GW', 'Guinea-Bissau'), (b'GY', 'Guyana'), (b'HK', 'Hong Kong'), (b'HM', 'Heard & McDonald Islands'), (b'HN', 'Honduras'), (b'HR', 'Croatia'), (b'HT', 'Haiti'), (b'HU', 'Hungary'), (b'ID', 'Indonesia'), (b'IE', 'Ireland'), (b'IL', 'Israel'), (b'IN', 'India'), (b'IO', 'British Indian Ocean Territory'), (b'IQ', 'Iraq'), (b'IR', 'Islamic Republic of Iran'), (b'IS', 'Iceland'), (b'IT', 'Italy'), (b'JM', 'Jamaica'), (b'JO', 'Jordan'), (b'JP', 'Japan'), (b'KE', 'Kenya'), (b'KG', 'Kyrgyzstan'), (b'KH', 'Cambodia'), (b'KI', 'Kiribati'), (b'KM', 'Comoros'), (b'KN', 'St. Kitts and Nevis'), (b'KP', "Korea, Democratic People's Republic of"), (b'KR', 'Korea, Republic of'), (b'KW', 'Kuwait'), (b'KY', 'Cayman Islands'), (b'KZ', 'Kazakhstan'), (b'LA', "Lao People's Democratic Republic"), (b'LB', 'Lebanon'), (b'LC', 'Saint Lucia'), (b'LI', 'Liechtenstein'), (b'LK', 'Sri Lanka'), (b'LR', 'Liberia'), (b'LS', 'Lesotho'), (b'LT', 'Lithuania'), (b'LU', 'Luxembourg'), (b'LV', 'Latvia'), (b'LY', 'Libyan Arab Jamahiriya'), (b'MA', 'Morocco'), (b'MC', 'Monaco'), (b'MD', 'Moldova, Republic of'), (b'MG', 'Madagascar'), (b'MH', 'Marshall Islands'), (b'ML', 'Mali'), (b'MN', 'Mongolia'), (b'MM', 'Myanmar'), (b'MO', 'Macau'), (b'MP', 'Northern Mariana Islands'), (b'MQ', 'Martinique'), (b'MR', 'Mauritania'), (b'MS', 'Monserrat'), (b'MT', 'Malta'), (b'MU', 'Mauritius'), (b'MV', 'Maldives'), (b'MW', 'Malawi'), (b'MX', 'Mexico'), (b'MY', 'Malaysia'), (b'MZ', 'Mozambique'), (b'NA', 'Namibia'), (b'NC', 'New Caledonia'), (b'NE', 'Niger'), (b'NF', 'Norfolk Island'), (b'NG', 'Nigeria'), (b'NI', 'Nicaragua'), (b'NL', 'Netherlands'), (b'NO', 'Norway'), (b'NP', 'Nepal'), (b'NR', 'Nauru'), (b'NU', 'Niue'), (b'NZ', 'New Zealand'), (b'OM', 'Oman'), (b'PA', 'Panama'), (b'PE', 'Peru'), (b'PF', 'French Polynesia'), (b'PG', 'Papua New Guinea'), (b'PH', 'Philippines'), (b'PK', 'Pakistan'), (b'PL', 'Poland'), (b'PM', 'St. Pierre & Miquelon'), (b'PN', 'Pitcairn'), (b'PR', 'Puerto Rico'), (b'PT', 'Portugal'), (b'PW', 'Palau'), (b'PY', 'Paraguay'), (b'QA', 'Qatar'), (b'RE', 'Reunion'), (b'RO', 'Romania'), (b'RU', 'Russian Federation'), (b'RW', 'Rwanda'), (b'SA', 'Saudi Arabia'), (b'SB', 'Solomon Islands'), (b'SC', 'Seychelles'), (b'SD', 'Sudan'), (b'SE', 'Sweden'), (b'SG', 'Singapore'), (b'SH', 'St. Helena'), (b'SI', 'Slovenia'), (b'SJ', 'Svalbard & Jan Mayen Islands'), (b'SK', 'Slovakia'), (b'SL', 'Sierra Leone'), (b'SM', 'San Marino'), (b'SN', 'Senegal'), (b'SO', 'Somalia'), (b'SR', 'Suriname'), (b'ST', 'Sao Tome & Principe'), (b'SV', 'El Salvador'), (b'SY', 'Syrian Arab Republic'), (b'SZ', 'Swaziland'), (b'TC', 'Turks & Caicos Islands'), (b'TD', 'Chad'), (b'TF', 'French Southern Territories'), (b'TG', 'Togo'), (b'TH', 'Thailand'), (b'TJ', 'Tajikistan'), (b'TK', 'Tokelau'), (b'TM', 'Turkmenistan'), (b'TN', 'Tunisia'), (b'TO', 'Tonga'), (b'TP', 'East Timor'), (b'TR', 'Turkey'), (b'TT', 'Trinidad & Tobago'), (b'TV', 'Tuvalu'), (b'TW', 'Taiwan, Province of China'), (b'TZ', 'Tanzania, United Republic of'), (b'UA', 'Ukraine'), (b'UG', 'Uganda'), (b'UM', 'United States Minor Outlying Islands'), (b'US', 'United States of America'), (b'UY', 'Uruguay'), (b'UZ', 'Uzbekistan'), (b'VA', 'Vatican City State (Holy See)'), (b'VC', 'St. Vincent & the Grenadines'), (b'VE', 'Venezuela'), (b'VG', 'British Virgin Islands'), (b'VI', 'United States Virgin Islands'), (b'VN', 'Viet Nam'), (b'VU', 'Vanuatu'), (b'WF', 'Wallis & Futuna Islands'), (b'WS', 'Samoa'), (b'YE', 'Yemen'), (b'YT', 'Mayotte'), (b'YU', 'Yugoslavia'), (b'ZA', 'South Africa'), (b'ZM', 'Zambia'), (b'ZR', 'Zaire'), (b'ZW', 'Zimbabwe')])),
                ('facebookUrl', models.URLField(max_length=256, null=True, blank=True)),
                ('twitterUrl', models.URLField(max_length=256, null=True, blank=True)),
                ('googleUrl', models.URLField(max_length=256, null=True, blank=True)),
                ('linkedInUrl', models.URLField(max_length=256, null=True, blank=True)),
                ('websiteUrl', models.URLField(max_length=256, null=True, blank=True)),
                ('scientific_background', models.CharField(default=b'--', max_length=10, choices=[(b'--', 'My background is...'), (b'MAT', 'Mathematics'), (b'CIS', 'Computer and information sciences'), (b'PHYS', 'Physical sciences'), (b'CHES', 'Chemical sciences'), (b'ERES', 'Earth and related environmental sciences'), (b'BIS', 'Biological sciences'), (b'ONS', 'Other natural sciences'), (b'CIE', 'Civil engineering'), (b'ELE', 'Electrical engineering, electronic'), (b'EIE', 'engineering, information engineering'), (b'MCE', 'Mechanical engineering'), (b'CHE', 'Chemical engineering'), (b'MAE', 'Materials engineering'), (b'MEE', 'Medical engineering'), (b'ENE', 'Environmental engineering'), (b'ENB', 'Environmental biotechnology'), (b'INB', 'Industrial Biotechnology'), (b'NTE', 'Nano-technology'), (b'OET', 'Other engineering and technologies'), (b'BAM', 'Basic medicine'), (b'CLM', 'Clinical medicine'), (b'HSC', 'Health sciences'), (b'HBI', 'Health biotechnology'), (b'OMS', 'Other medical sciences'), (b'AFF', 'Agriculture, forestry, and fisheries'), (b'ADS', 'Animal and dairy science'), (b'VES', 'Veterinary science'), (b'AGB', 'Agricultural biotechnology'), (b'OAS', 'Other agricultural sciences'), (b'PSY', 'Psychology'), (b'EB', 'Economics and business'), (b'EDS', 'Educational sciences'), (b'SOC', 'Sociology'), (b'LAW', 'Law'), (b'PS', 'Political Science'), (b'SEG', 'Social and economic geography'), (b'MC', 'Media and communications'), (b'OSC', 'Other social sciences'), (b'HA', 'History and archaeology'), (b'LANG', 'Languages and literature'), (b'PHIL', 'Philosophy, ethics and religion'), (b'ART', 'Art (arts, history of arts, performing arts, music)'), (b'OH', 'Other humanities')])),
                ('user', models.OneToOneField(to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Vocabulary',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=128)),
                ('description', models.CharField(max_length=2048)),
                ('category', models.CharField(blank=True, max_length=256, choices=[(b'AG', 'Agriculture'), (b'ART', 'Arts, Recreation and Travel'), (b'BFI', 'Banking, Finance and Insurance'), (b'BDMD', 'Births, Deaths, Marriages and Divorces'), (b'BE', 'Business / Enterprises'), (b'CE', 'Census'), (b'CH', 'Construction and Housing'), (b'CO', 'Contributors'), (b'DI', 'Diplomacy'), (b'EC', 'Economic'), (b'ED', 'Education'), (b'EL', 'Elections'), (b'EM', 'Employment'), (b'EU', 'Energy and Utilities'), (b'EN', 'Environment'), (b'FA', 'Farming'), (b'FI', 'Financials'), (b'FCA', 'Foreign Commerce and Aid'), (b'FT', 'Foreign Trade'), (b'GE', 'Geography and Environment'), (b'HN', 'Health and Nutrition'), (b'IEPW', 'Income, Expenditures, Poverty, and Wealth'), (b'IC', 'Information and Communications'), (b'IS', 'International Statistics'), (b'LFEE', 'Labor Force, Employment, and Earnings'), (b'LECP', 'Law Enforcement, Courts, and Prisons'), (b'MA', 'Manufactures'), (b'MI', 'Military'), (b'NSVA', 'National Security and Veterans Affairs'), (b'NR', 'Natural Resources'), (b'OT', 'Other'), (b'PO', 'Population'), (b'PR', 'Prices'), (b'PABF', 'Public Agencies Budget and Finances'), (b'PAE', 'Public Agencies Employment'), (b'ST', 'Science and Technology'), (b'SIHS', 'Social Insurance and Human Services'), (b'SP', 'Space'), (b'TA', 'Taxation'), (b'TR', 'Transportation'), (b'WE', 'Welfare'), (b'WRT', 'Wholesale and Retail Trade')])),
                ('originalUrl', models.URLField(max_length=256, null=True)),
                ('downloadUrl', models.URLField(max_length=256, null=True)),
                ('preferredNamespaceUri', models.URLField(max_length=1024, null=True)),
                ('preferredNamespacePrefix', models.CharField(max_length=256, null=True)),
                ('example', models.CharField(max_length=8196, blank=True)),
                ('datePublished', models.DateField(null=True, blank=True)),
                ('dateCreated', models.DateField(null=True, blank=True)),
                ('dateModified', models.DateField(null=True, blank=True)),
                ('score', models.IntegerField()),
                ('votes', models.IntegerField()),
                ('downloads', models.IntegerField()),
                ('uploader', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='VocabularyClass',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('uri', models.URLField(max_length=1024, null=True)),
                ('label', models.CharField(max_length=128)),
                ('ranking', models.FloatField()),
                ('vocabulary', models.ForeignKey(to='linda_app.Vocabulary')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='VocabularyComments',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('commentText', models.CharField(max_length=512)),
                ('timePosted', models.DateTimeField(null=True, blank=True)),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
                ('vocabularyCommented', models.ForeignKey(to='linda_app.Vocabulary')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='VocabularyProperty',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('uri', models.URLField(max_length=1024, null=True)),
                ('label', models.CharField(max_length=128)),
                ('ranking', models.FloatField()),
                ('vocabulary', models.ForeignKey(to='linda_app.Vocabulary')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='VocabularyRanking',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('vote', models.IntegerField()),
                ('vocabularyRanked', models.ForeignKey(to='linda_app.Vocabulary')),
                ('voter', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='photo',
            name='user_profile',
            field=models.ForeignKey(to='linda_app.UserProfile'),
            preserve_default=True,
        ),
    ]
