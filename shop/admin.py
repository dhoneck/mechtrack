from django.contrib import admin

from .models import Vehicle, Customer, CustomerVehicle, Service, ServiceItem, Estimate, EstimateItem


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


class ServiceItemInline(admin.TabularInline):
    model = ServiceItem
    extra = 1


class ServiceAdmin(admin.ModelAdmin):
    list_display = ('vehicle', 'datetime', 'estimated_time', 'internal_notes', 'customer_notes', 'mileage', 'completed',)
    inlines = [ServiceItemInline]

    def service_items(self, obj):
        return obj.estimate_items_str()

    def service_total(self, obj):
        return '$' + str(obj.service_total())

    def service_items(self, obj):
        return obj.service_items()


class EstimateItemInline(admin.TabularInline):
    model = EstimateItem
    extra = 1


class EstimateAdmin(admin.ModelAdmin):
    list_display = ('vehicle', 'updated_at', 'estimate_items_str', 'estimate_total', 'total_estimate_items')
    inlines = [EstimateItemInline]

    def estimate_items(self, obj):
        return obj.estimate_items_str()

    def estimate_total(self, obj):
        return '$' + str(obj.estimate_total())

    def total_estimate_items(self, obj):
        return obj.total_estimate_items()


admin.site.register(Vehicle, VehicleAdmin)
admin.site.register(Customer, CustomerAdmin)
admin.site.register(CustomerVehicle, CustomerVehicleAdmin)
admin.site.register(Service, ServiceAdmin)
admin.site.register(Estimate, EstimateAdmin)
