# Generated by Django 5.1.2 on 2024-12-19 05:38

import django.db.models.deletion
import phonenumber_field.modelfields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Business',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('address', models.CharField(max_length=255)),
                ('phone', models.CharField(max_length=20)),
                ('email', models.EmailField(blank=True, default='', max_length=254)),
                ('website', models.URLField(blank=True, default='')),
            ],
            options={
                'verbose_name_plural': 'Businesses',
                'unique_together': {('name', 'address')},
            },
        ),
        migrations.CreateModel(
            name='Branch',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('address', models.CharField(max_length=255)),
                ('phone', models.CharField(max_length=20)),
                ('email', models.EmailField(blank=True, default='', max_length=254)),
                ('website', models.URLField(blank=True, default='')),
                ('business', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='branches', to='shop.business')),
            ],
            options={
                'verbose_name_plural': 'Branches',
            },
        ),
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('first_name', models.CharField(blank=True, max_length=30)),
                ('last_name', models.CharField(blank=True, max_length=30)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('is_superuser', models.BooleanField(default=False)),
                ('business', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='users', to='shop.business')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=50)),
                ('last_name', models.CharField(max_length=50)),
                ('phone', phonenumber_field.modelfields.PhoneNumberField(blank=True, default='', max_length=128, region=None, unique=True)),
                ('email', models.EmailField(blank=True, default='', max_length=254)),
                ('accepts_texts', models.BooleanField(default=False)),
                ('accepts_emails', models.BooleanField(default=False)),
                ('flagged', models.BooleanField(default=False)),
                ('notes', models.TextField(blank=True, default='')),
                ('branch', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='customers', to='shop.branch')),
            ],
        ),
        migrations.CreateModel(
            name='Estimate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('branch', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='estimates', to='shop.branch')),
            ],
        ),
        migrations.CreateModel(
            name='EstimateItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(max_length=200)),
                ('part_price', models.DecimalField(decimal_places=2, default=0.0, max_digits=8)),
                ('labor_price', models.DecimalField(decimal_places=2, default=0.0, max_digits=8)),
                ('estimate', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='shop.estimate')),
            ],
        ),
        migrations.CreateModel(
            name='Service',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('datetime', models.DateTimeField()),
                ('estimated_time', models.CharField(blank=True, choices=[('1 hr', '1 hr'), ('2 hrs', '2 hrs'), ('3 hrs', '3 hrs'), ('4 hrs', '4 hrs'), ('5 hrs', '5 hrs'), ('6 hrs', '6 hrs'), ('7 hrs', '7 hrs'), ('8 hrs', '8 hrs'), ('1+ day', '1+ day')], default='', max_length=30)),
                ('internal_notes', models.TextField(blank=True, default='')),
                ('customer_notes', models.TextField(blank=True, default='')),
                ('mileage', models.PositiveIntegerField(blank=True, null=True)),
                ('status', models.CharField(choices=[('Scheduled', 'Scheduled'), ('Waiting for vehicle', 'Waiting for vehicle'), ('Vehicle ready for repair', 'Vehicle ready for repair'), ('In Progress', 'In Progress'), ('Contact Customer - Approval', 'Contact Customer - Approval'), ('Contact Customer - Pickup', 'Contact Customer - Pickup'), ('Waiting on Pickup', 'Waiting on Pickup'), ('Waiting on Parts', 'Waiting on Parts'), ('Completed', 'Completed'), ('Canceled', 'Canceled')], default='Scheduled', max_length=30)),
                ('branch', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='services', to='shop.branch')),
                ('estimate', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='service', to='shop.estimate')),
            ],
        ),
        migrations.CreateModel(
            name='ServiceItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(max_length=200)),
                ('part_price', models.DecimalField(decimal_places=2, default=0.0, max_digits=8)),
                ('labor_price', models.DecimalField(decimal_places=2, default=0.0, max_digits=8)),
                ('service', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='shop.service')),
            ],
        ),
        migrations.CreateModel(
            name='Vehicle',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('make', models.CharField(max_length=50)),
                ('model', models.CharField(max_length=50)),
                ('year', models.PositiveIntegerField(blank=True, null=True)),
                ('color', models.CharField(blank=True, default='', max_length=50)),
                ('license', models.CharField(blank=True, max_length=8, null=True, unique=True)),
                ('vin', models.CharField(blank=True, max_length=17, null=True, unique=True)),
                ('notes', models.TextField(blank=True, default='')),
                ('branch', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='vehicles', to='shop.branch')),
            ],
        ),
        migrations.AddField(
            model_name='service',
            name='vehicle',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='services', to='shop.vehicle'),
        ),
        migrations.AddField(
            model_name='estimate',
            name='vehicle',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='estimates', to='shop.vehicle'),
        ),
        migrations.CreateModel(
            name='CustomerVehicle',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='shop.customer')),
                ('vehicle', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='shop.vehicle')),
            ],
            options={
                'unique_together': {('customer', 'vehicle')},
            },
        ),
        migrations.AddField(
            model_name='customer',
            name='vehicles',
            field=models.ManyToManyField(blank=True, through='shop.CustomerVehicle', to='shop.vehicle'),
        ),
        migrations.CreateModel(
            name='Vendor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('vendor_name', models.CharField(max_length=50)),
                ('vendor_code', models.CharField(max_length=50)),
                ('phone', phonenumber_field.modelfields.PhoneNumberField(blank=True, default='', max_length=128, region=None, unique=True)),
                ('email', models.EmailField(blank=True, default='', max_length=254)),
                ('website', models.CharField(blank=True, max_length=200)),
                ('notes', models.TextField(blank=True, default='')),
                ('branch', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='vendors', to='shop.branch')),
            ],
        ),
    ]
