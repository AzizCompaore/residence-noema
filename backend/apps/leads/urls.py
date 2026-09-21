"""
URLs for Leads app
"""
from django.urls import path
from .serializers import LeadCreateView

urlpatterns = [
    path('', LeadCreateView.as_view(), name='lead-create'),
]
