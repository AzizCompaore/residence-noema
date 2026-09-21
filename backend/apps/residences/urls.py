"""
URLs for Residences app
"""
from rest_framework.routers import DefaultRouter
from .api import ResidenceViewSet

router = DefaultRouter()
router.register(r'', ResidenceViewSet, basename='residence')
urlpatterns = router.urls
