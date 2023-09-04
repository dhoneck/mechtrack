from django.contrib import admin

from .models import Business, Branch, Car, Customer, Owner, Invoice


# Register your models here.
class BusinessAdmin(admin.ModelAdmin):
    list_display = ('name',)


class BranchAdmin(admin.ModelAdmin):
    list_display = ('business', 'address', 'phone', 'email',)


class CarAdmin(admin.ModelAdmin):
    list_display = ('make', 'model', 'year', 'vin', 'license',)


class CustomerAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'phone', 'email',)


class OwnerAdmin(admin.ModelAdmin):
    list_display = ('customer', 'car',)


class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('customer', 'date', 'description', 'amount',)


admin.site.register(Business, BusinessAdmin)
admin.site.register(Branch, BranchAdmin)
admin.site.register(Car, CarAdmin)
admin.site.register(Customer, CustomerAdmin)
admin.site.register(Owner, OwnerAdmin)
admin.site.register(Invoice, InvoiceAdmin)
