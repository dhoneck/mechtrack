# Generated by Django 5.1.2 on 2025-03-02 18:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0002_remove_customer_branch_remove_vehicle_branch_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='business',
            name='default_pricing',
            field=models.JSONField(blank=True, default=dict),
        ),
    ]
