"""
URL Configuration for Résidence NOEMA Project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

admin.site.site_header = "Résidence NOEMA — Administration & CRM"
admin.site.site_title = "NOEMA Back-Office"
admin.site.index_title = "Gestion Commerciale, Stocks & Prospects"
admin.site.index_template = "admin/noema_index.html"

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/residence/', include('apps.residences.urls')),
    path('api/apartments/', include('apps.apartments.urls')),
    path('api/construction/', include('apps.construction.urls')),
    path('api/faq/', include('apps.faq.urls')),
    path('api/leads/', include('apps.leads.urls')),
    path('api/auth/', include('apps.accounts.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
