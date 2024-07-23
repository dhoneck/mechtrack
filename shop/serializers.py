from rest_framework import serializers
from shop.models import Vehicle, Customer, CustomerVehicle, Service, Estimate, EstimateItem


class EstimateItemSerializer(serializers.ModelSerializer):
    estimate_item_total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    part_price = serializers.DecimalField(max_digits=8, decimal_places=2)
    labor_price = serializers.DecimalField(max_digits=8, decimal_places=2)
    estimate = serializers.PrimaryKeyRelatedField(queryset=Estimate.objects.all())

    class Meta:
        model = EstimateItem
        fields = ['id', 'estimate', 'description', 'part_price', 'labor_price', 'estimate_item_total']


class EstimateSerializer(serializers.ModelSerializer):
    estimate_items = EstimateItemSerializer(many=True, read_only=True, source='items')
    parts_total = serializers.DecimalField(max_digits=8, decimal_places=2)
    labor_total = serializers.DecimalField(max_digits=8, decimal_places=2)
    estimate_subtotal = serializers.DecimalField(max_digits=8, decimal_places=2)
    sales_tax_total = serializers.DecimalField(max_digits=8, decimal_places=2)
    estimate_total = serializers.DecimalField(max_digits=8, decimal_places=2)
    total_estimate_items = serializers.ReadOnlyField()

    class Meta:
        model = Estimate
        fields = ['id', 'vehicle', 'updated_at', 'estimate_items', 'estimate_items_str', 'parts_total', 'labor_total', 'estimate_subtotal', 'sales_tax_total', 'estimate_total', 'total_estimate_items']


class ServiceSerializer(serializers.ModelSerializer):
    services = serializers.ListField(child=serializers.CharField())

    class Meta:
        model = Service
        fields = '__all__'


class VehicleSerializer(serializers.ModelSerializer):
    list_owners = serializers.ReadOnlyField()
    owner_count = serializers.ReadOnlyField()
    service_count = serializers.ReadOnlyField()
    services = ServiceSerializer(many=True, read_only=True)
    estimates = EstimateSerializer(many=True, read_only=True)

    class Meta:
        model = Vehicle
        fields = '__all__'


class CustomerSerializer(serializers.ModelSerializer):
    vehicles = VehicleSerializer(many=True, read_only=True)

    class Meta:
        model = Customer
        fields = '__all__'


class CustomerVehicleSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomerVehicle
        fields = '__all__'
