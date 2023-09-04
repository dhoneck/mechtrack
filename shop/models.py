from django.db import models
from phonenumber_field.modelfields import PhoneNumberField


# Create your models here.
class Business(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Branch(models.Model):
    business_id = models.ForeignKey(Business, on_delete=models.CASCADE)
    address = models.CharField(max_length= 100)
    phone = PhoneNumberField()
    email = models.EmailField(max_length=254)

    def __str__(self):
        business_name = Branch.objects.get(id=self.business_id)
        return f'{business_name} - {self.address}'


class Car(models.Model):
    make = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    year = models.PositiveIntegerField()
    vin = models.CharField(max_length=17)
    license = models.CharField(max_length=8)

    def __str__(self):
        return f'{self.year} {self.make} {self.model}'


class Customer(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone = PhoneNumberField()
    email = models.EmailField(max_length=254)
    notes = models.TextField()

    def __str__(self):
        return f'{self.first_name} {self.last_name}'


class Owner(models.Model):
    customer_id = models.ForeignKey(Customer, on_delete=models.CASCADE)
    car_id = models.ForeignKey(Car, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('customer_id', 'car_id')

    def __str__(self):
        customer = Owner.objects.get(id=self.customer_id)
        car = Owner.objects.get(id=self.car_id)
        return f'{customer} - {car}'


class Invoice(models.Model):
    customer_id = models.ForeignKey(Customer, on_delete=models.CASCADE)
    date = models.DateField()
    description = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self):
        customer = Invoice.objects.get(id=self.customer_id)
        return f'''
            Invoice for {customer}
            Date: {self.date}
            Description: {self.description}
            Amount: {self.amount}
        '''
