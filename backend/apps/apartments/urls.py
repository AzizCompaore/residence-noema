from rest_framework.routers import DefaultRouter
from .serializers import ApartmentViewSet

router = DefaultRouter()
router.register(r'', ApartmentViewSet, basename='apartment')

urlpatterns = router.urls
