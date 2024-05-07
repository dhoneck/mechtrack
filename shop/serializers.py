from rest_framework import serializers
from shop.models import Vehicle, Customer, CustomerVehicle, Service, Estimate, EstimateItem

class EstimateItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstimateItem
        fields = ['id', 'description', 'price']


class EstimateSerializer(serializers.ModelSerializer):
    estimate_items = serializers.ReadOnlyField()
    estimate_total = serializers.ReadOnlyField()
    total_estimate_items = serializers.ReadOnlyField()

    class Meta:
        model = Estimate
        fields = ['id', 'vehicle', 'updated_at', 'estimate_items', 'estimate_items_str', 'estimate_total', 'total_estimate_items']


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
