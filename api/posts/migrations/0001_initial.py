# Generated by Django 3.1.1 on 2020-12-20 23:55

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('author', models.TextField()),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('title', models.TextField(max_length=128)),
                ('content', models.TextField(max_length=2048)),
                ('like_count', models.IntegerField(default=0, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(13371337)])),
                ('deleted', models.BooleanField(default=False)),
            ],
            options={
                'ordering': ('date_created',),
            },
        ),
    ]
