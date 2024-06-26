# Generated by Django 4.2.4 on 2024-04-17 02:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0008_alter_service_services'),
    ]

    operations = [
        migrations.CreateModel(
            name='Estimate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('vehicle', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='estimates', to='shop.vehicle')),
            ],
        ),
        migrations.CreateModel(
            name='EstimateItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(max_length=200)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=8)),
                ('estimate', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='shop.estimate')),
            ],
        ),
    ]
