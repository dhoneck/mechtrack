# Generated by Django 4.2.4 on 2024-02-27 03:39

from django.db import migrations, models
import django.db.models.deletion
import multiselectfield.db.fields


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Service',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('estimated_time', models.TimeField(blank=True, null=True)),
                ('services', multiselectfield.db.fields.MultiSelectField(choices=[(1, 'Oil, lube, and filter'), (2, 'Diagnostic'), (3, 'Tire rotation'), (4, 'Brake replacement'), (5, 'Alignment'), (6, 'Transmission'), (7, 'Electrical systems'), (8, 'Other')], max_length=15)),
                ('internal_notes', models.TextField(blank=True, default='')),
                ('customer_notes', models.TextField(blank=True, default='')),
                ('mileage', models.PositiveIntegerField(blank=True, null=True)),
                ('completed', models.BooleanField(default=False)),
                ('vehicle', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='shop.vehicle')),
            ],
        ),
        migrations.DeleteModel(
            name='Invoice',
        ),
    ]