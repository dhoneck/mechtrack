from rest_framework.response import Response
from rest_framework import filters, generics, status
from rest_framework.decorators import api_view

from shop.models import Vehicle, Customer, CustomerVehicle, Service, Estimate, EstimateItem
from shop.serializers import VehicleSerializer, CustomerSerializer, CustomerVehicleSerializer, ServiceSerializer, EstimateSerializer, EstimateItemSerializer


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
    List all vehicles, or create a new vehicle.
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
    List all customer/vehicle pairs, or create a new customer/vehicle pair.
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
    List all services, or create a new service.
    """
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer


class ServiceDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a service instance.
    """
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer


class EstimateList(generics.ListCreateAPIView):
    """
    List all estimates, or create a new estimate.
    """
    queryset = Estimate.objects.all()
    serializer_class = EstimateSerializer

    def create(self, request, *args, **kwargs):
        print('request.data')
        print(request.data)

        vehicle_id = request.data.pop('vehicle_id')
        estimate_items = request.data.pop('estimate_items')
        estimate = Estimate.objects.create(vehicle_id=vehicle_id)
        for item in estimate_items:
            EstimateItem.objects.create(estimate_id=estimate.id, description=item['description'], part_price=item['part_price'], labor_price=item['labor_price'])
        return Response(status=status.HTTP_201_CREATED)


class EstimateDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete an estimate instance.
    """
    queryset = Estimate.objects.all()
    serializer_class = EstimateSerializer


class EstimateItemList(generics.ListCreateAPIView):
    """
    List all estimate items, or create a new estimate item.
    """
    queryset = EstimateItem.objects.all()
    serializer_class = EstimateItemSerializer


class EstimateItemDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete an estimate item instance.
    """
    queryset = EstimateItem.objects.all()
    serializer_class = EstimateItemSerializer


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
