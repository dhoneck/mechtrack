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
