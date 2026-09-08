from django.contrib import admin
from .models import Apartment

@admin.register(Apartment)
class ApartmentAdmin(admin.ModelAdmin):
    list_display = (
        'reference', 
        'name', 
        'apartment_type', 
        'commercial_segment',
        'surface_sqm', 
        'price_fcfa', 
        'status', 
        'is_public',
        'floor', 
        'is_featured', 
        'display_order'
    )
    list_filter = ('status', 'apartment_type', 'commercial_segment', 'is_public', 'is_featured')
    search_fields = ('reference', 'name', 'description')
    list_editable = ('price_fcfa', 'status', 'display_order', 'is_featured')
    ordering = ('display_order', 'price_fcfa')
    
    fieldsets = (
        ("Identification du Lot", {
            'fields': ('reference', 'name', 'apartment_type', 'commercial_segment', 'is_public', 'is_featured', 'display_order')
        }),
        ("Tarification & Disponibilité", {
            'fields': ('price_fcfa', 'price_launch_fcfa', 'price_structure_fcfa', 'price_closed_fcfa', 'status')
        }),
        ("Surfaces & Composition", {
            'fields': ('surface_sqm', 'balcony_surface_sqm', 'floor', 'rooms_count', 'bedrooms_count', 'bathrooms_count', 'composition')
        }),
        ("Informations à confirmer", {
            'fields': ('parking_notes', 'orientation_notes', 'view_notes'),
            'description': "Ne renseignez ces champs qu'après confirmation lot par lot.",
        }),
        ("Descriptif Commercial & Prestations", {
            'fields': ('description', 'key_features', 'photos', 'floor_plan_image')
        }),
    )

    actions = ['mark_as_available', 'mark_as_option', 'mark_as_reserved', 'mark_as_sold']

    @admin.action(description="Marquer comme Disponible")
    def mark_as_available(self, request, queryset):
        queryset.update(status='available')

    @admin.action(description="Marquer comme sous Option")
    def mark_as_option(self, request, queryset):
        queryset.update(status='option')

    @admin.action(description="Marquer comme Réservé")
    def mark_as_reserved(self, request, queryset):
        queryset.update(status='reserved')

    @admin.action(description="Marquer comme Vendu")
    def mark_as_sold(self, request, queryset):
        queryset.update(status='sold')
