"""
URLs for FAQ app
"""
from rest_framework.routers import DefaultRouter
from .api import FAQItemViewSet

router = DefaultRouter()
router.register(r'', FAQItemViewSet, basename='faq')
urlpatterns = router.urls
