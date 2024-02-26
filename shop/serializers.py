from rest_framework import serializers
from shop.models import Vehicle, Customer, CustomerVehicle, Invoice


class VehicleSerializer(serializers.ModelSerializer):
    list_owners = serializers.ReadOnlyField()
    owner_count = serializers.ReadOnlyField()

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


class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = '__all__'
