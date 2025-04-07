from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework_simplejwt.views import TokenRefreshView

from shop import views

urlpatterns = [
    path('users/', views.CustomUserGet.as_view()),
    path('users/get-current-branch/', views.GetCurrentBranchView.as_view(), name='get-current-branch'),
    path('users/update-current-branch/', views.UpdateCurrentBranchView.as_view(), name='update-current-branch'),
    path('branches/<int:branch_id>/pricing/', views.GetBranchPricingView.as_view(), name='get-pricing'),
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
    path('status-choices/', views.get_status_choices, name='status-choices'),
    path('token/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('protected/', views.protected_view, name='protected'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
