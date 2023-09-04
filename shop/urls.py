from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from shop import views

urlpatterns = [
    path('customers/', views.customer_list),
    path('customers/<int:pk>/', views.customer_detail),
]

urlpatterns = format_suffix_patterns(urlpatterns)
