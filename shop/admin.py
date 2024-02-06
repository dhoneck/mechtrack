from django.contrib import admin

from .models import Vehicle, Customer, Invoice, CustomerVehicle


# Register your models here.
class VehicleAdmin(admin.ModelAdmin):
    all_fields = ('make', 'model', 'year', 'color', 'license', 'vin', 'notes',)
    list_display = all_fields
    search_fields = all_fields


class CustomerAdmin(admin.ModelAdmin):
    all_fields = ('first_name', 'last_name', 'phone', 'accepts_texts', 'email', 'accepts_emails', 'flagged', 'notes',)
    list_display = all_fields
    search_fields = all_fields


class CustomerVehicleAdmin(admin.ModelAdmin):
    list_display = ('customer', 'vehicle',)


class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('customer', 'date', 'description', 'amount',)
    search_fields = ('customer__first_name', 'customer__last_name', 'date', 'description', 'amount',)


admin.site.register(Vehicle, VehicleAdmin)
admin.site.register(Customer, CustomerAdmin)
admin.site.register(CustomerVehicle, CustomerVehicleAdmin)
admin.site.register(Invoice, InvoiceAdmin)
