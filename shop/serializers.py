from rest_framework import serializers
from shop.models import Business, Branch, Car, Customer, Owner, Invoice


class BusinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = ['id', 'name']


class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = ['id', 'business', 'address', 'phone', 'email']


class CarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Car
        fields = ['id', 'make', 'model', 'year', 'color', 'vin', 'license']


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'branch', 'first_name', 'last_name', 'phone', 'email', 'notes']


class OwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Owner
        fields = ['id', 'customer', 'car']


class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = ['id', 'customer', 'date', 'description', 'amount']
