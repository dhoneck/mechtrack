from django.db import models
from phonenumber_field.modelfields import PhoneNumberField


# Create your models here.
class Business(models.Model):
    name = models.CharField(max_length=50)


class Branch(models.Model):
    business_id = models.ForeignKey(Business, on_delete=models.CASCADE)
    address = models.CharField(max_length= 100)
    phone = PhoneNumberField()
    email = models.EmailField(max_length=254)


class Car(models.Model):
    make = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    year = models.PositiveIntegerField()
    vin = models.CharField(max_length=17)
    license = models.CharField(max_length=8)


class Customer(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone = PhoneNumberField()
    email = models.EmailField(max_length=254)
    notes = models.TextField()


class Owner(models.Model):
    customer_id = models.ForeignKey(Customer, on_delete=models.CASCADE)
    car_id = models.ForeignKey(Car, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('customer_id', 'car_id')


class Invoice(models.Model):
    customer_id = models.ForeignKey(Customer, on_delete=models.CASCADE)
    date = models.DateField()
    description = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=8, decimal_places=2)
