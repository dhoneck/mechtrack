from django.contrib import admin

from .models import Business, Branch, Car, Customer, Owner, Invoice


# Register your models here.
class BusinessAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


class BranchAdmin(admin.ModelAdmin):
    list_display = ('business', 'address', 'phone', 'email',)
    search_fields = ('business__name', 'address', 'phone', 'email',)


class CarAdmin(admin.ModelAdmin):
    list_display = ('make', 'model', 'year', 'vin', 'license',)
    search_fields = ('make', 'model', 'year', 'vin', 'license',)


class CustomerAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'phone', 'email',)
    search_fields = ('first_name', 'last_name', 'phone', 'email',)


class OwnerAdmin(admin.ModelAdmin):
    list_display = ('customer', 'car',)
    search_fields = ('customer__first_name', 'customer__last_name', 'car__make', 'car__model',)


class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('customer', 'date', 'description', 'amount',)
    search_fields = ('customer__first_name', 'customer__last_name', 'date', 'description', 'amount',)


admin.site.register(Business, BusinessAdmin)
admin.site.register(Branch, BranchAdmin)
admin.site.register(Car, CarAdmin)
admin.site.register(Customer, CustomerAdmin)
admin.site.register(Owner, OwnerAdmin)
admin.site.register(Invoice, InvoiceAdmin)
