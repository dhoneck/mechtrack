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
    path('customer-vehicle/delete-by-filter/', views.delete_by_filter, name='delete_by_filter'),
    path('export/customers/csv/', views.export_customers_csv, name='export_customers_csv'),
    path('export/customers/pdf/', views.export_customers_pdf, name='export_customers_pdf'),
    path('services/', views.ServiceList.as_view()),
    path('services/<int:pk>/', views.ServiceDetail.as_view()),
    path('estimates/', views.EstimateList.as_view()),
    path('estimates/<int:pk>/', views.EstimateDetail.as_view()),
    path('estimate-items/', views.EstimateItemList.as_view()),
    path('estimate-items/<int:pk>/', views.EstimateItemDetail.as_view()),
    path('vendors/', views.VendorList.as_view()),
    path('vendors/<int:pk>/', views.VendorDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
