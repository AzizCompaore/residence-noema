from rest_framework import serializers, viewsets
from rest_framework.permissions import IsAdminUser
from .models import FAQItem


class FAQItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQItem
        fields = '__all__'


class FAQItemViewSet(viewsets.ModelViewSet):
    queryset = FAQItem.objects.all().order_by('display_order', 'id')
    serializer_class = FAQItemSerializer
    pagination_class = None

    def get_permissions(self):
        return [] if self.request.method in ('GET', 'HEAD', 'OPTIONS') else [IsAdminUser()]