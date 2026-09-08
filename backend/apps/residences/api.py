from rest_framework import serializers, viewsets
from rest_framework.permissions import IsAdminUser
from .models import Residence


class ResidenceSerializer(serializers.ModelSerializer):
    hero_image = serializers.ImageField(read_only=True)

    class Meta:
        model = Residence
        fields = '__all__'


class ResidenceViewSet(viewsets.ModelViewSet):
    queryset = Residence.objects.all().order_by('id')
    serializer_class = ResidenceSerializer
    pagination_class = None

    def get_permissions(self):
        return [] if self.request.method in ('GET', 'HEAD', 'OPTIONS') else [IsAdminUser()]