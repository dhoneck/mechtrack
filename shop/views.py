from rest_framework.response import Response
from rest_framework import filters, generics, status
from rest_framework.decorators import api_view

from shop.models import Vehicle, Customer, CustomerVehicle, Service
from shop.serializers import VehicleSerializer, CustomerSerializer, CustomerVehicleSerializer, ServiceSerializer


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


class ServiceList(generics.ListCreateAPIView):
    """
    List all services, or create a new vehicles.
    """
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['make', 'model', 'year', 'color', 'license', 'vin', 'notes']


class ServiceDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a service instance.
    """
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer


@api_view(['DELETE'])
def delete_by_filter(request):
    # Assuming you want to filter by a specific field value
    customer = request.GET.get('customer')  # Get the value from the query parameters
    vehicle = request.GET.get('vehicle')  # Get the value from the query parameters

    try:
        instance = CustomerVehicle.objects.get(customer_id=customer, vehicle_id=vehicle)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except CustomerVehicle.DoesNotExist:
        return Response({'error': 'Object not found'}, status=status.HTTP_404_NOT_FOUND)
