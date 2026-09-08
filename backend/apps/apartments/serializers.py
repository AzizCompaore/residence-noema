from rest_framework import serializers, viewsets
from rest_framework.permissions import IsAdminUser
from .models import Apartment

class ApartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Apartment
        fields = '__all__'

class ApartmentViewSet(viewsets.ModelViewSet):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentSerializer
    pagination_class = None
    filterset_fields = ['apartment_type', 'status', 'is_featured']
    search_fields = ['name', 'reference', 'description']

    def get_permissions(self):
        return [] if self.request.method in ('GET', 'HEAD', 'OPTIONS') else [IsAdminUser()]

    def get_queryset(self):
        queryset = super().get_queryset()
        if not self.request.user.is_authenticated or not self.request.user.is_staff:
            queryset = queryset.filter(is_public=True)
        return queryset
