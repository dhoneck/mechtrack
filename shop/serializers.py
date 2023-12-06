from rest_framework import serializers
from shop.models import Vehicle, Customer, Owner, Invoice


class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = ['id', 'make', 'model', 'year', 'color', 'license', 'vin', 'notes']


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'first_name', 'last_name', 'phone', 'email', 'accepts_texts', 'accepts_emails', 'flagged', 'notes']


class OwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Owner
        fields = ['id', 'customer', 'car']


class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = ['id', 'customer', 'date', 'description', 'amount']
