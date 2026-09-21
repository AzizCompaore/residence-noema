from django.contrib import admin
from .models import Residence

@admin.register(Residence)
class ResidenceAdmin(admin.ModelAdmin):
    list_display = ('name', 'district', 'city', 'delivery_date_estimated', 'whatsapp_number', 'indicative_interest_rate')
    fieldsets = (
        ("Informations Générales", {
            'fields': ('name', 'tagline', 'district', 'city', 'country', 'status', 'delivery_date_estimated', 'hero_image')
        }),
        ("Concept & Capacité", {
            'fields': ('total_units', 'floors', 'description', 'architectural_concept', 'address_details', 'latitude', 'longitude')
        }),
        ("Contact Commercial", {
            'fields': ('whatsapp_number', 'phone_number', 'email_contact')
        }),
        ("Financement & Partenaires", {
            'fields': ('financing_partners', 'financing_notes'),
        }),
        ("Paramètres du Simulateur de Financement", {
            'fields': ('indicative_interest_rate', 'indicative_debt_ratio_limit')
        }),
    )
