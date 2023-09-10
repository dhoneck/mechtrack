from rest_framework.views import APIView
from rest_framework import status
from rest_framework import generics
from rest_framework.response import Response
from shop.models import Business, Branch, Car, Customer, Owner, Invoice
from shop.serializers import (BusinessSerializer,
                              BranchSerializer,
                              CarSerializer,
                              CustomerSerializer,
                              OwnerSerializer,
                              InvoiceSerializer)


# Create your views here.
class CustomerList(generics.ListCreateAPIView):
    """
    List all customers, or create a new customer.
    """
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class CustomerDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a customer instance.
    """
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class CarList(generics.ListCreateAPIView):
    """
    List all cars, or create a new car.
    """
    queryset = Car.objects.all()
    serializer_class = CarSerializer


class CarDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a car instance.
    """
    queryset = Car.objects.all()
    serializer_class = CarSerializer


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
