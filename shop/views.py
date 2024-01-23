from rest_framework import filters, generics
from shop.models import Vehicle, Customer, Owner
from shop.serializers import VehicleSerializer, CustomerSerializer, OwnerSerializer


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


class OwnerList(generics.ListCreateAPIView):
    """
    List all owners, or create a new owner.
    """
    queryset = Owner.objects.all()
    serializer_class = OwnerSerializer


class OwnerDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete an owner instance.
    """
    queryset = Owner.objects.all()
    serializer_class = OwnerSerializer
