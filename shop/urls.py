from django.urls import path
from shop import views

urlpatterns = [
    path('customers/', views.customer_list),
    path('customers/<int:pk>/', views.customer_detail),
]
