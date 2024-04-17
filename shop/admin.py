from django.contrib import admin

from .models import Vehicle, Customer, CustomerVehicle, Service, Estimate, EstimateItem


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


class ServiceAdmin(admin.ModelAdmin):
    list_display = ('vehicle', 'datetime', 'estimated_time', 'services', 'internal_notes', 'customer_notes', 'mileage', 'completed',)


class EstimateItemInline(admin.TabularInline):
    model = EstimateItem
    extra = 1


class EstimateAdmin(admin.ModelAdmin):
    list_display = ('vehicle', 'updated_at', 'get_total', 'get_total_items')
    inlines = [EstimateItemInline]

    def get_total(self, obj):
        return '$' + str(obj.get_total())

    def get_total_items(self, obj):
        return obj.get_total_items()

    get_total.short_description = 'Estimate Total'
    get_total_items.short_description = '# of Items'


admin.site.register(Vehicle, VehicleAdmin)
admin.site.register(Customer, CustomerAdmin)
admin.site.register(CustomerVehicle, CustomerVehicleAdmin)
admin.site.register(Service, ServiceAdmin)
admin.site.register(Estimate, EstimateAdmin)
