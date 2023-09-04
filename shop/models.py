from django.db import models
from phonenumber_field.modelfields import PhoneNumberField


# Create your models here.
class Business(models.Model):
    name = models.CharField(max_length=50)

    class Meta:
        verbose_name_plural = 'Businesses'

    def __str__(self):
        return self.name


class Branch(models.Model):
    business = models.ForeignKey(Business, on_delete=models.CASCADE)
    address = models.CharField(max_length=100)
    phone = PhoneNumberField()
    email = models.EmailField(blank=True, default='', max_length=254)

    class Meta:
        verbose_name_plural = 'Branches'

    def __str__(self):
        business_name = Business.objects.get(id=self.business.id).name
        return f'{business_name} - {self.address}'


class Car(models.Model):
    make = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    year = models.PositiveIntegerField()
    vin = models.CharField(blank=True, default='', unique=True, max_length=17)
    license = models.CharField(blank=True, default='', unique=True, max_length=8)

    def __str__(self):
        return f'{self.year} {self.make} {self.model}'


class Customer(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone = PhoneNumberField(blank=True, default='', unique=True)
    email = models.EmailField(blank=True, default='', max_length=254)
    notes = models.TextField(blank=True, default='',)

    def __str__(self):
        return f'{self.first_name} {self.last_name}'


class Owner(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    car = models.ForeignKey(Car, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('customer', 'car')

    def __str__(self):
        customer = Customer.objects.get(id=self.customer.id)
        car = Car.objects.get(id=self.car.id)
        return f'{customer.first_name} - {car.make} {car.model}'


class Invoice(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
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
