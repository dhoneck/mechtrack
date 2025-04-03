import uuid
from decimal import Decimal
import random
import string

from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from phonenumber_field.modelfields import PhoneNumberField

class Business(models.Model):
    """Business model is the main business entity."""
    name = models.CharField(max_length=255)
    address = models.CharField(blank=True, max_length=255)
    phone = models.CharField(blank=True, max_length=20)
    email = models.EmailField(blank=True, default='')
    website = models.URLField(blank=True, default='')
    default_pricing = models.JSONField(blank=True, default=dict)

    class Meta:
        verbose_name_plural = 'Businesses'
        unique_together = ('name', 'address')

    def __str__(self):
        return self.name

class Branch(models.Model):
    """Branch model is a location of the auto shop."""
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='branches')
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True, default='')
    website = models.URLField(blank=True, default='')

    class Meta:
        verbose_name_plural = 'Branches'

    def __str__(self):
        if self.name:
            return self.name + ' - ' + self.address
        else:
            return self.business.name + ' - ' + self.address


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser):
    """CustomUser model is a staff member of the auto shop."""
    business = models.ForeignKey(Business, on_delete=models.CASCADE, blank=True, null=True, related_name='users')
    current_branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, blank=True, null=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def save(self, *args, **kwargs):
        """Override save method to ensure the current branch belongs to the user's business."""
        if self.current_branch and self.current_branch.business != self.business:
            raise ValidationError("The selected branch does not belong to the user's business.")
        super().save(*args, **kwargs)

    def __str__(self):
        return self.email

    def all_branches(self):
        return Branch.objects.filter(business=self.business)


    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser

    def business_name(self):
        """Returns the name of the business."""
        return self.business.name

    def full_name(self):
        """Returns the full name of the user if available."""
        full_name = ''
        if self.first_name:
            full_name += self.first_name
            if self.last_name:
                full_name += ' ' + self.last_name
        return full_name

class Vehicle(models.Model):
    """Vehicle model is a vehicle being worked on by an auto shop."""
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='vehicles')
    make = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    year = models.PositiveIntegerField(blank=True, null=True)
    color = models.CharField(blank=True, default='', max_length=50)
    license = models.CharField(blank=True, null=True, unique=True, max_length=8)
    vin = models.CharField(blank=True, null=True, unique=True, max_length=17)
    notes = models.TextField(blank=True, default='')

    def owner_count(self):
        """Returns the number of customers linked to the vehicle."""
        return self.customer_set.count()

    def list_owners(self):
        """Returns a comma separated list of owners."""
        return ', '.join([str(customer) for customer in self.customer_set.all()])

    def service_count(self):
        """Returns the number of services for the vehicle."""
        return self.services.count()

    def __str__(self):
        """Returns '<Year> <Make> <Model> | <Color> | <License> | <VIN>' unless information is missing."""
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
    """Customer model is a customer of the auto shop."""
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='customers')
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
    """CustomerVehicle model joins customers and vehicles to show ownership."""
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('customer', 'vehicle')

    def __str__(self):
        """Returns '<Customer First Name> - <Vehicle Make> <Vehicle Model>'."""
        return f'{self.customer.first_name} {self.customer.last_name} - {self.vehicle.make} {self.vehicle.model}'


class Estimate(models.Model):
    """Estimate model is unscheduled vehicle work."""
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='estimates')
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='estimates')
    updated_at = models.DateTimeField(auto_now=True)

    def scheduled(self):
        if self.service.exists():
            return 'Yes'
        return 'No'

    def estimate_items_str(self):
        """Returns a comma separated list of estimate items."""
        return ', '.join([item.description for item in self.items.all()])

    def parts_total(self):
        """Returns the sum of all part prices."""
        total = sum(item.part_price for item in self.items.all())
        return total

    def labor_total(self):
        """Returns the sum of all labor prices."""
        total = sum(item.labor_price for item in self.items.all())
        return total

    def estimate_subtotal(self):
        """Returns the sum of all part and labor prices."""
        total = sum(item.estimate_item_total() for item in self.items.all())
        return total

    def sales_tax_total(self):
        """Returns the sales tax amount based on 5.5% sales tax."""
        return self.estimate_subtotal() * Decimal(0.055)

    def estimate_total(self):
        """Returns the sum of all parts, labor, and tax."""
        return self.estimate_subtotal() + self.sales_tax_total()

    def total_estimate_items(self):
        """Returns the number of estimate items."""
        return self.items.count()

    def __str__(self):
        """Returns 'Estimate for <Vehicle> | Updated at: <updated_at>'."""
        return f'Estimate for {self.vehicle.year} {self.vehicle.make} {self.vehicle.model} | Updated at: {self.updated_at}'


class EstimateItem(models.Model):
    """EstimateItem is a single piece of work for an estimate."""
    estimate = models.ForeignKey(Estimate, on_delete=models.CASCADE, related_name='items')
    description = models.CharField(max_length=200)
    part_price = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    labor_price = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)

    def save(self, *args, **kwargs):
        """Override save method to standardize decimal placements for part and labor prices."""
        if self.part_price is not None:
            self.part_price = Decimal(self.part_price)
            self.part_price = self.part_price.quantize(Decimal('0.01'))

        if self.labor_price is not None:
            self.labor_price = Decimal(self.labor_price)
            self.labor_price = self.labor_price.quantize(Decimal('0.01'))

        super(EstimateItem, self).save(*args, **kwargs)

    def estimate_item_total(self):
        """Returns the sum of the part and labor price."""
        return self.part_price + self.labor_price

    def __str__(self):
        """
        Returns a multiline string containing the estimate item description, part price, labor price, and total price.
        """
        return f'''
            Description: {self.description}
            Part Price: {self.part_price}
            Labor Price: {self.labor_price}
            Total Price: {self.estimate_item_total()}
        '''


class Service(models.Model):
    """Service model is scheduled vehicle work."""
    TIME_CHOICES = (
        ('1 hr', '1 hr'),
        ('2 hrs', '2 hrs'),
        ('3 hrs', '3 hrs'),
        ('4 hrs', '4 hrs'),
        ('5 hrs', '5 hrs'),
        ('6 hrs', '6 hrs'),
        ('7 hrs', '7 hrs'),
        ('8 hrs', '8 hrs'),
        ('1+ day', '1+ day'),
    )

    SERVICE_CHOICES = (
        ('Oil lube and filter', 'Oil lube and filter'),
        ('Diagnostic', 'Diagnostic'),
        ('Tire rotation', 'Tire rotation'),
        ('Brake replacement', 'Brake replacement'),
        ('Alignment', 'Alignment'),
        ('Transmission', 'Transmission'),
        ('Electrical systems', 'Electrical systems'),
        ('Other', 'Other'),
    )

    STATUS_CHOICES = (
        ('Scheduled', 'Scheduled'),
        ('Waiting for vehicle', 'Waiting for vehicle'),
        ('Vehicle ready for repair', 'Vehicle ready for repair'),
        ('In Progress', 'In Progress'),
        ('Contact Customer - Approval', 'Contact Customer - Approval'),
        ('Contact Customer - Pickup', 'Contact Customer - Pickup'),
        ('Waiting on Pickup', 'Waiting on Pickup'),
        ('Waiting on Parts', 'Waiting on Parts'),
        ('Completed', 'Completed'),
        ('Canceled', 'Canceled'),
    )

    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='services')
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='services')
    datetime = models.DateTimeField()
    estimated_time = models.CharField(choices=TIME_CHOICES, max_length=30, blank=True, default='')
    internal_notes = models.TextField(blank=True, default='')
    customer_notes = models.TextField(blank=True, default='')
    mileage = models.PositiveIntegerField(blank=True, null=True)
    status = models.CharField(choices=STATUS_CHOICES, max_length=30, blank=False, default='Scheduled')
    estimate = models.ForeignKey(Estimate, related_name='service', on_delete=models.SET_NULL, blank=True, null=True)

    def service_items_str(self):
        """Returns a comma separated list of service items."""
        return ', '.join([item.description for item in self.items.all()])

    def parts_total(self):
        """Returns the sum of all part prices."""
        total = sum(item.part_price for item in self.items.all())
        return total

    def labor_total(self):
        """Returns the sum of all labor prices."""
        total = sum(item.labor_price for item in self.items.all())
        return total

    def service_subtotal(self):
        """Returns the sum of all part and labor prices."""
        total = sum(item.service_item_total() for item in self.items.all())
        return total

    def sales_tax_total(self):
        """Returns the sales tax amount based on 5.5% sales tax."""
        return self.service_subtotal() * Decimal(0.055)

    def service_total(self):
        """Returns the sum of all parts, labor, and tax."""
        return self.service_subtotal() + self.sales_tax_total()

    def total_service_items(self):
        """Returns the number of service items."""
        return self.items.count()

    def __str__(self):
        """Returns a string that states the vehicle ID and the datetime of the service."""
        return f'Service for vehicle ID {self.vehicle.id} on {self.datetime}'


class ServiceItem(models.Model):
    """ServiceItem is a single piece of work that is scheduled in a service."""
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='items')
    description = models.CharField(max_length=200)
    part_price = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    labor_price = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)

    def save(self, *args, **kwargs):
        """Override save method to standardize decimal placements for part and labor prices."""
        if self.part_price is not None:
            self.part_price = Decimal(self.part_price)
            self.part_price = self.part_price.quantize(Decimal('0.01'))

        if self.labor_price is not None:
            self.labor_price = Decimal(self.labor_price)
            self.labor_price = self.labor_price.quantize(Decimal('0.01'))

        super(ServiceItem, self).save(*args, **kwargs)

    def service_item_total(self):
        """Returns the sum of the part and labor price."""
        return self.part_price + self.labor_price

    def __str__(self):
        """
        Returns a multiline string containing the service item description, part price, labor price, and total price.
        """
        return f'''
            Description: {self.description}
            Part Price: {self.part_price}
            Labor Price: {self.labor_price}
            Total Price: {self.service_item_total()}
        '''


class Vendor(models.Model):
    """Vendor model is a customer of the auto shop."""
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='vendors')
    vendor_name = models.CharField(max_length=50)
    vendor_code = models.CharField(max_length=50)
    phone = PhoneNumberField(blank=True, default='', unique=True)
    email = models.EmailField(blank=True, default='', max_length=254)
    website = models.CharField(blank=True, max_length=200)
    notes = models.TextField(blank=True, default='')

    def __str__(self):
        vendor = self.vendor_name
        if self.vendor_code:
            vendor += f' ({self.vendor_code})'
        return vendor