from rest_framework import filters, generics
from shop.models import Vehicle, Customer, CustomerVehicle
from shop.serializers import VehicleSerializer, CustomerSerializer, CustomerVehicleSerializer


# Create your views here.
class CustomerList(generics.ListCreateAPIView):
    """
    List all customers, or create a new customer.
    """
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['first_name', 'last_name', 'phone']


class CustomerDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a customer instance.
    """
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class VehicleList(generics.ListCreateAPIView):
    """
    List all vehicles, or create a new vehicles.
    """
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['make', 'model', 'year', 'color', 'license', 'vin', 'notes']


class VehicleDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a vehicle instance.
    """
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer


class CustomerVehicleList(generics.ListCreateAPIView):
    """
    List all customer/vehicle pairs, or create a new pairs.
    """
    queryset = CustomerVehicle.objects.all()
    serializer_class = CustomerVehicleSerializer


class CustomerVehicleDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a customer/vehicle pair instance.
    """
    queryset = CustomerVehicle.objects.all()
    serializer_class = CustomerVehicleSerializer
