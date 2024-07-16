from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, generics, status
from rest_framework.decorators import api_view
from rest_framework.filters import OrderingFilter
from rest_framework.response import Response

from shop.models import Vehicle, Customer, CustomerVehicle, Service, Estimate, EstimateItem
from shop.serializers import VehicleSerializer, CustomerSerializer, CustomerVehicleSerializer, ServiceSerializer, \
    EstimateSerializer, EstimateItemSerializer
from .filters import ServiceFilter


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
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = ServiceFilter
    ordering_fields = ['datetime']
    ordering = ['datetime']


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
        """
        Custom create method that will also trigger the creation of estimate item objects
        """
        print('request.data')
        print(request.data)

        vehicle_id = request.data.pop('vehicle_id')
        estimate_items_data = request.data.pop('estimate_items')

        if not estimate_items_data:
            return Response({'error': 'No estimate items'}, status=status.HTTP_400_BAD_REQUEST)

        estimate = Estimate.objects.create(vehicle_id=vehicle_id, **request.data)
        for item_data in estimate_items_data:
            if item_data['part_price'] is None or item_data['part_price'] == '':
                item_data['part_price'] = 0
            if item_data['labor_price'] is None or item_data['labor_price'] == '':
                item_data['labor_price'] = 0
            EstimateItem.objects.create(estimate=estimate, **item_data)
        serializer = self.get_serializer(estimate)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


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
