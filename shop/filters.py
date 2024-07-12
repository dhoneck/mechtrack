import django_filters
from .models import Service


class ServiceFilter(django_filters.FilterSet):
    service_date = django_filters.DateFilter(field_name='datetime', lookup_expr='date')

    class Meta:
        model = Service
        fields = ['service_date']
