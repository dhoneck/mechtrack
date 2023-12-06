from django.contrib import admin

from .models import Vehicle, Customer, Owner, Invoice


# Register your models here.
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('make', 'model', 'year', 'color', 'license', 'vin', 'notes',)
    search_fields = ('make', 'model', 'year', 'color', 'license', 'vin', 'notes',)


class CustomerAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'phone', 'accepts_texts', 'email', 'accepts_emails', 'flagged', 'notes',)
    search_fields = ('first_name', 'last_name', 'phone', 'accepts_texts', 'email', 'accepts_emails', 'flagged', 'notes',)


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
