from rest_framework import serializers, viewsets
from rest_framework.permissions import IsAdminUser
from .models import ConstructionMilestone


class ConstructionMilestoneSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField(read_only=True)

    class Meta:
        model = ConstructionMilestone
        fields = '__all__'


class ConstructionMilestoneViewSet(viewsets.ModelViewSet):
    queryset = ConstructionMilestone.objects.all().order_by('stage_number', 'display_order')
    serializer_class = ConstructionMilestoneSerializer
    pagination_class = None

    def get_permissions(self):
        return [] if self.request.method in ('GET', 'HEAD', 'OPTIONS') else [IsAdminUser()]