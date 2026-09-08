from django.contrib import admin
from .models import Lead

@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = (
        'created_at',
        'first_name', 
        'last_name', 
        'phone_whatsapp', 
        'email', 
        'residence_country',
        'pipeline_stage', 
        'interested_apartment', 
        'utm_source',
        'follow_up_count'
    )
    list_filter = ('pipeline_stage', 'utm_source', 'residence_country', 'consent_marketing', 'created_at')
    search_fields = ('first_name', 'last_name', 'phone_whatsapp', 'email', 'notes')
    list_editable = ('pipeline_stage',)
    readonly_fields = ('created_at', 'updated_at', 'utm_source', 'utm_medium', 'utm_campaign', 'simulation_data')

    fieldsets = (
        ("État Civil & Contact", {
            'fields': ('first_name', 'last_name', 'phone_whatsapp', 'email', 'residence_country', 'age', 'employment_status')
        }),
        ("Pipeline Commercial & Suivi", {
            'fields': ('pipeline_stage', 'interested_apartment', 'interested_apartment_ref', 'follow_up_count', 'notes')
        }),
        ("Capacité Financière & Simulation", {
            'fields': ('monthly_net_income', 'down_payment', 'existing_monthly_loans', 'desired_duration_years', 'simulation_data')
        }),
        ("Attribution Campagnes & UTM", {
            'fields': ('utm_source', 'utm_medium', 'utm_campaign')
        }),
        ("Consentements & Conformité", {
            'fields': ('consent_data_processing', 'consent_marketing', 'created_at', 'updated_at')
        }),
    )

    actions = ['mark_as_qualified', 'mark_as_contacted', 'mark_as_meeting_scheduled', 'mark_as_reserved']

    @admin.action(description="Passer en statut: Qualifié")
    def mark_as_qualified(self, request, queryset):
        queryset.update(pipeline_stage='qualified')

    @admin.action(description="Passer en statut: Contacté")
    def mark_as_contacted(self, request, queryset):
        queryset.update(pipeline_stage='contacted')

    @admin.action(description="Passer en statut: RDV planifié")
    def mark_as_meeting_scheduled(self, request, queryset):
        queryset.update(pipeline_stage='meeting_scheduled')

    @admin.action(description="Passer en statut: Réservation")
    def mark_as_reserved(self, request, queryset):
        queryset.update(pipeline_stage='reserved')
