from django.db import models
from django.core import serializers
from django.http import HttpResponse

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

    def __str__(self):
        description = ''
        if self.color:
            description += f'{self.color}'
        if self.year:
            description += f' {self.year}'

        description += f' {self.make} {self.model}'

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


class Invoice(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='invoices')
    date = models.DateField()
    description = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self):
        customer = Customer.objects.get(id=self.customer.id)
        return f'''
            Invoice for {customer}
            Date: {self.date}
            Description: {self.description}
            Amount: {self.amount}
        '''
