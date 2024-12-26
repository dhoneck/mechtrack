from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from shop.models import CustomUser, Vehicle, Customer, CustomerVehicle, Service, ServiceItem, Estimate, EstimateItem, Vendor


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        return token


class CustomUserSerializer(serializers.ModelSerializer):
    business_name = serializers.ReadOnlyField()
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'last_name', 'full_name', 'business_id', 'business_id', 'business_name',]


class EstimateItemSerializer(serializers.ModelSerializer):
    estimate_item_total = serializers.ReadOnlyField()

    class Meta:
        model = EstimateItem
        fields = '__all__'


class EstimateSerializer(serializers.ModelSerializer):
    estimate_items = EstimateItemSerializer(many=True, read_only=True, source='items')
    estimate_items_str = serializers.ReadOnlyField()
    scheduled = serializers.ReadOnlyField()
    parts_total = serializers.ReadOnlyField()
    labor_total = serializers.ReadOnlyField()
    estimate_subtotal = serializers.ReadOnlyField()
    sales_tax_total = serializers.ReadOnlyField()
    estimate_total = serializers.ReadOnlyField()
    total_estimate_items = serializers.ReadOnlyField()

    class Meta:
        model = Estimate
        fields = '__all__'


class ServiceItemSerializer(serializers.ModelSerializer):
    service_item_total = serializers.ReadOnlyField()

    class Meta:
        model = ServiceItem
        fields = '__all__'


class ServiceSerializer(serializers.ModelSerializer):
    service_items = ServiceItemSerializer(many=True, read_only=True, source='items')
    service_items_str = serializers.ReadOnlyField()
    parts_total = serializers.ReadOnlyField()
    labor_total = serializers.ReadOnlyField()
    service_subtotal = serializers.ReadOnlyField()
    sales_tax_total = serializers.ReadOnlyField()
    service_total = serializers.ReadOnlyField()
    total_service_items = serializers.ReadOnlyField()

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


class VendorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Vendor
        fields = '__all__'
