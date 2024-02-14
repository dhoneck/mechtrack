from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from shop import views

urlpatterns = [
    path('customers/', views.CustomerList.as_view()),
    path('customers/<int:pk>/', views.CustomerDetail.as_view()),
    path('vehicles/', views.VehicleList.as_view()),
    path('vehicles/<int:pk>/', views.VehicleDetail.as_view()),
    path('customer-vehicle/', views.CustomerVehicleList.as_view()),
    path('customer-vehicle/<int:pk>/', views.CustomerVehicleDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
