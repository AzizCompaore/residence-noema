"""
URLs for Construction app
"""
from rest_framework.routers import DefaultRouter
from .api import ConstructionMilestoneViewSet

router = DefaultRouter()
router.register(r'', ConstructionMilestoneViewSet, basename='construction')
urlpatterns = router.urls
