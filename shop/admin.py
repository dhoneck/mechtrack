from django.contrib import admin

from .models import Vehicle, Customer, Owner, Invoice


# Register your models here.
class VehicleAdmin(admin.ModelAdmin):
    all_fields = ('make', 'model', 'year', 'color', 'license', 'vin', 'notes',)
    list_display = all_fields
    search_fields = all_fields


class CustomerAdmin(admin.ModelAdmin):
    all_fields = ('first_name', 'last_name', 'phone', 'accepts_texts', 'email', 'accepts_emails', 'flagged', 'notes',)
    list_display = all_fields
    search_fields = all_fields


class OwnerAdmin(admin.ModelAdmin):
    list_display = ('customer', 'vehicle',)
    search_fields = ('customer__first_name', 'customer__last_name', 'vehicle__make', 'vehicle__model',)


class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('customer', 'date', 'description', 'amount',)
    search_fields = ('customer__first_name', 'customer__last_name', 'date', 'description', 'amount',)


admin.site.register(Vehicle, VehicleAdmin)
admin.site.register(Customer, CustomerAdmin)
admin.site.register(Owner, OwnerAdmin)
admin.site.register(Invoice, InvoiceAdmin)
