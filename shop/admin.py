from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import Business, CustomUser, Vehicle, Customer, CustomerVehicle, Service, ServiceItem, Estimate, EstimateItem, Vendor
from .forms import CustomUserCreationForm, CustomUserChangeForm


class BusinessAdmin(admin.ModelAdmin):
    all_fields = ('name', 'address', 'phone', 'email', 'website')
    list_display = all_fields
    search_fields = all_fields


class CustomUserAdmin(BaseUserAdmin):
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm

    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'is_superuser')
    list_filter = ('is_staff', 'is_superuser')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_staff', 'is_superuser')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'password1', 'password2'),
        }),
    )
    search_fields = ('email',)
    ordering = ('email',)
    filter_horizontal = ()

    def save_model(self, request, obj, form, change):
        if form.cleaned_data.get('password'):
            obj.set_password(form.cleaned_data['password'])
        super().save_model(request, obj, form, change)


class VehicleAdmin(admin.ModelAdmin):
    all_fields = ('make', 'model', 'year', 'color', 'license', 'vin', 'notes',)
    list_display = all_fields
    search_fields = all_fields


class CustomerAdmin(admin.ModelAdmin):
    all_fields = ('first_name', 'last_name', 'phone', 'email', 'accepts_texts', 'accepts_emails', 'flagged', 'notes',)
    list_display = all_fields
    search_fields = all_fields


class CustomerVehicleAdmin(admin.ModelAdmin):
    list_display = ('customer', 'vehicle',)


class ServiceItemInline(admin.TabularInline):
    model = ServiceItem
    extra = 1


class ServiceAdmin(admin.ModelAdmin):
    list_display = ('vehicle', 'datetime', 'estimated_time', 'internal_notes', 'customer_notes', 'mileage', 'status',)
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
    list_display = ('vehicle', 'updated_at', 'estimate_items_str', 'total_estimate_items', 'estimate_total',)
    inlines = [EstimateItemInline]

    def estimate_items_str(self, obj):
        return obj.estimate_items_str()

    def estimate_total(self, obj):
        """Display the estimate total with a dollar sign."""
        return f'${obj.estimate_total():,.2f}'

    def total_estimate_items(self, obj):
        """Display the total number of estimate items."""
        return obj.total_estimate_items()

    estimate_items_str.short_description = 'Description'
    estimate_total.short_description = 'Total Estimate'
    total_estimate_items.short_description = 'Number of Service Items'


class VendorAdmin(admin.ModelAdmin):
    all_fields = ('vendor_name', 'vendor_code', 'phone', 'email', 'website', 'notes',)
    list_display = all_fields
    search_fields = all_fields


admin.site.register(Business, BusinessAdmin)
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Vehicle, VehicleAdmin)
admin.site.register(Customer, CustomerAdmin)
admin.site.register(CustomerVehicle, CustomerVehicleAdmin)
admin.site.register(Service, ServiceAdmin)
admin.site.register(Estimate, EstimateAdmin)
admin.site.register(Vendor, VendorAdmin)
