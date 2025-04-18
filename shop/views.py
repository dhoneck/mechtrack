import csv
from django.http import HttpResponse, JsonResponse
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.filters import OrderingFilter
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from datetime import datetime
from reportlab.pdfgen import canvas

from shop.models import Business, Branch, CustomUser, Vehicle, Customer, CustomerVehicle, Service, ServiceItem, Estimate, EstimateItem, Vendor
from shop.serializers import VehicleSerializer, CustomerSerializer, CustomerVehicleSerializer, ServiceSerializer, \
    EstimateSerializer, EstimateItemSerializer, ServiceItemSerializer, VendorSerializer, \
    CustomTokenObtainPairSerializer, CustomUserSerializer, CurrentBranchSerializer, PricingSerializer
from .filters import ServiceFilter

def generate_timestamp():
    return datetime.now().strftime('%Y-%m-%d')


@api_view(['GET'])
def protected_view(request):
    return Response({"message": "This is a protected view"}, status=200)


@api_view(['GET'])
def get_status_choices(request):
    print('In the get_status_choices function')
    choices = Service.STATUS_CHOICES
    print(choices)
    return Response(choices)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class CustomUserGet(generics.RetrieveAPIView):
    """
    Retrieve a user profile.
    """
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    def get_object(self):
        return self.request.user


class GetCurrentBranchView(generics.RetrieveAPIView):
    """
    Get the current branch of the custom user.
    """
    serializer_class = CurrentBranchSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class UpdateCurrentBranchView(generics.UpdateAPIView):
    """
    Update the current branch of the custom user.
    """
    serializer_class = CurrentBranchSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class GetBranchPricingView(APIView):
    def get(self, request, branch_id):
        try:
            branch = Branch.objects.get(id=branch_id)
            serializer = PricingSerializer(branch)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Branch.DoesNotExist:
            return Response({'error': 'Branch not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CustomerList(generics.ListCreateAPIView):
    """
    List all customers, or create a new customer.
    """
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['first_name', 'last_name', 'phone']

    def get_queryset(self):
        """
        This view should return a list of all the customers
        for the business that the authenticated user belongs to.
        """
        business_id = self.request.user.business_id
        return Customer.objects.filter(business_id=business_id)

    def perform_create(self, serializer):
        """
        Override this method to include the business ID from the authenticated user.
        """
        business_id = self.request.user.business_id
        serializer.save(business_id=business_id)


class CustomerDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a customer instance.
    """
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

@api_view(['GET'])
def export_customers_csv(request):
    print('In the export_customers_csv function')

    # Generate the timestamp
    timestamp = datetime.now().strftime('%Y-%m-%d')

    # Create a HttpResponse object with CSV headers
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="customer-export-{timestamp}.csv"'

    writer = csv.writer(response)
    writer.writerow(['First Name', 'Last Name', 'Phone', 'Email', 'Accepts Texts', 'Accepts Emails', 'Flagged', 'Notes', 'Vehicles'])

    # Fetch data from the Customer model
    customers = Customer.objects.all().values_list(
        'first_name',
        'last_name',
        'phone',
        'email',
        'accepts_texts',
        'accepts_emails',
        'flagged',
        'notes',
        'vehicles',
    )
    for customer in customers:
        writer.writerow(customer)

    return response


@api_view(['GET'])
def export_customers_pdf(request):
    # Create a HttpResponse object with PDF headers
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="customer-export-{generate_timestamp()}.pdf"'

    # Create the PDF object
    p = canvas.Canvas(response)
    p.drawString(25, 800, f'Customer Export - {generate_timestamp()}')

    # Fetch data from the Customer model
    customers = Customer.objects.all()

    y = 750  # Initial Y position
    for customer in customers:
        customerInfo = f'{customer.first_name} {customer.last_name} | {customer.phone} | {customer.email} | {customer.accepts_texts} | {customer.accepts_emails} | {customer.vehicles}'
        p.drawString(25, y, customerInfo)
        y -= 30  # Move the cursor down for each entry

    p.showPage()
    p.save()

    return response


class VehicleList(generics.ListCreateAPIView):
    """
    List all vehicles, or create a new vehicle.
    """
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['make', 'model', 'year', 'color', 'license', 'vin', 'notes']

    def get_queryset(self):
        """
        This view should return a list of all the vehicles
        for the business that the authenticated user belongs to.
        """
        business_id = self.request.user.business_id
        return Vehicle.objects.filter(business_id=business_id)

    def perform_create(self, serializer):
        """
        Override this method to include the business ID from the authenticated user.
        """
        business_id = self.request.user.business_id
        serializer.save(business_id=business_id)



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

    def create(self, request, *args, **kwargs):
        """
        Custom create method that will also trigger the creation of service item objects
        """
        print('request.data')
        print(request.data)

        vehicle_id = request.data.pop('vehicle_id')
        service_items_data = request.data.pop('service_items')

        if not service_items_data:
            return Response({'error': 'No service items'}, status=status.HTTP_400_BAD_REQUEST)

        service = Service.objects.create(vehicle_id=vehicle_id, **request.data)
        print('service_items_data')
        print(service_items_data)
        for item_data in service_items_data:
            print('Item data')
            print(item_data)
            if item_data['part_price'] is None or item_data['part_price'] == '':
                item_data['part_price'] = 0
            if item_data['labor_price'] is None or item_data['labor_price'] == '':
                item_data['labor_price'] = 0
            ServiceItem.objects.create(service=service, **item_data)
        serializer = self.get_serializer(service)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ServiceDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a service instance.
    """
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer


class ServiceItemList(generics.ListCreateAPIView):
    """
    List all service items, or create a new service item.
    """
    queryset = ServiceItem.objects.all()
    serializer_class = ServiceItemSerializer


class ServiceItemDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete an service item instance.
    """
    queryset = ServiceItem.objects.all()
    serializer_class = ServiceItemSerializer


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

        try:
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
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
            # return JsonResponse({'error': e + 'Internal Server Error'}, status=500)


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


class VendorList(generics.ListCreateAPIView):
    """
    List all vendor, or create a new vendor.
    """
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['vendor_name', 'vendor_code']

    def get_queryset(self):
        """
        This view should return a list of all the vendors
        for the business that the authenticated user belongs to.
        """
        business_id = self.request.user.business_id
        return Vendor.objects.filter(business_id=business_id)

    def perform_create(self, serializer):
        """
        Override this method to include the business ID from the authenticated user.
        """
        business_id = self.request.user.business_id
        serializer.save(business_id=business_id)


class VendorDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a vendor instance.
    """
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
