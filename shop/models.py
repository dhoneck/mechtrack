from django.db import models
from django.core import serializers
from django.http import HttpResponse

from multiselectfield.utils import get_max_length
from multiselectfield import MultiSelectField
from phonenumber_field.modelfields import PhoneNumberField


# Create your models here.
class Vehicle(models.Model):
    make = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    year = models.PositiveIntegerField(blank=True, null=True)
    color = models.CharField(blank=True, default='', max_length=50)
    license = models.CharField(blank=True, null=True, unique=True, max_length=8)
    vin = models.CharField(blank=True, null=True, unique=True, max_length=17)
    notes = models.TextField(blank=True, default='')

    def owner_count(self):
        return self.customer_set.count()

    def list_owners(self):
        # Join customer_set into a string
        return ', '.join([str(customer) for customer in self.customer_set.all()])

    def service_count(self):
        return self.services.count()

    # def list_services(self):
    #     # Return service_set as a JSON string
    #     return serializers.serialize('json', self.service_set.all())
    #     # return self.service_set.count()

    def __str__(self):
        description = ''
        if self.year:
            description += f' {self.year}'

        description += f' {self.make} {self.model}'

        if self.color:
            description += f' | Color: {self.color.upper()}'
        if self.license:
            description += f' | LICENSE: {self.license.upper()}'
        if self.vin:
            description += f' | VIN: {self.vin.upper()}'

        return description


class Customer(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone = PhoneNumberField(blank=True, default='', unique=True)
    email = models.EmailField(blank=True, default='', max_length=254)
    accepts_texts = models.BooleanField(default=False)
    accepts_emails = models.BooleanField(default=False)
    flagged = models.BooleanField(default=False)
    notes = models.TextField(blank=True, default='')
    vehicles = models.ManyToManyField(Vehicle, blank=True, through='CustomerVehicle')

    def __str__(self):
        return f'{self.first_name} {self.last_name}'


class CustomerVehicle(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('customer', 'vehicle')

    def __str__(self):
        customer = Customer.objects.get(id=self.customer.id)
        vehicle = Vehicle.objects.get(id=self.vehicle.id)
        return f'{customer.first_name} - {vehicle.make} {vehicle.model}'


TIME_CHOICES = (('1 hr', '1 hr'),
                ('2 hrs', '2 hrs'),
                ('3 hrs', '3 hrs'),
                ('4 hrs', '4 hrs'),
                ('5 hrs', '5 hrs'),
                ('6 hrs', '6 hrs'),
                ('7 hrs', '7 hrs'),
                ('8 hrs', '8 hrs'),
                ('1+ day', '1+ day'))

SERVICE_CHOICES = (('Oil lube and filter', 'Oil lube and filter'),
                   ('Diagnostic', 'Diagnostic'),
                   ('Tire rotation', 'Tire rotation'),
                   ('Brake replacement', 'Brake replacement'),
                   ('Alignment', 'Alignment'),
                   ('Transmission', 'Transmission'),
                   ('Electrical systems', 'Electrical systems'),
                   ('Other', 'Other'))


class Service(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='services')
    datetime = models.DateTimeField()
    estimated_time = models.CharField(choices=TIME_CHOICES, max_length=30, blank=True, default='')
    # MultiSelectField has bug that requires max_length to be specified
    # More info: https://github.com/goinnn/django-multiselectfield/issues/131
    services = MultiSelectField(choices=SERVICE_CHOICES, max_length=get_max_length(SERVICE_CHOICES, None))
    internal_notes = models.TextField(blank=True, default='')
    customer_notes = models.TextField(blank=True, default='')
    mileage = models.PositiveIntegerField(blank=True, null=True)
    completed = models.BooleanField(default=False)

    def __str__(self):
        vehicle = Vehicle.objects.get(id=self.vehicle.id)
        return f'''
            Service for {vehicle}
            Datetime: {self.datetime}
            Services: {self.services}
        '''


class Estimate(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='estimates')
    updated_at = models.DateTimeField(auto_now=True)

    def get_total(self):
        total = sum(item.amount for item in self.items.all())
        return total

    def get_total_items(self):
        return self.items.count()

    def __str__(self):
        vehicle = Vehicle.objects.get(id=self.vehicle.id)
        return f'Estimate for {vehicle} | Updated at: {self.updated_at}'


class EstimateItem(models.Model):
    estimate = models.ForeignKey(Estimate, on_delete=models.CASCADE, related_name='items')
    description = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self):
        return f'''
            Description: {self.description}
            Amount: {self.amount}
        '''
