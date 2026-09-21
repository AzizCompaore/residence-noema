from django.contrib import admin
import csv
from django.http import HttpResponse
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
        'project_purpose',
        'pipeline_stage', 
        'interested_apartment', 
        'utm_source',
        'follow_up_count'
    )
    list_filter = ('pipeline_stage', 'project_purpose', 'utm_source', 'residence_country', 'consent_marketing', 'created_at')
    search_fields = ('first_name', 'last_name', 'phone_whatsapp', 'email', 'notes')
    list_editable = ('pipeline_stage',)
    readonly_fields = ('created_at', 'updated_at', 'utm_source', 'utm_medium', 'utm_campaign', 'simulation_data', 'ai_conversation_summary')
   
    fieldsets = (
        ("État Civil & Contact", {
            'fields': ('first_name', 'last_name', 'phone_whatsapp', 'email', 'residence_country', 'age', 'employment_status', 'professional_seniority_years')
        }),
        ("Projet Diaspora", {
            'fields': ('project_purpose', 'funds_availability')
        }),
        ("Pipeline Commercial & Suivi", {
            'fields': ('pipeline_stage', 'interested_apartment', 'interested_apartment_ref', 'interested_apartment_price', 'follow_up_count', 'notes')
        }),
        ("Capacité Financière & Simulation", {
            'fields': ('monthly_net_income', 'has_co_borrower', 'co_borrower_monthly_income', 'additional_monthly_income', 'down_payment', 'existing_monthly_loans', 'desired_duration_years', 'simulation_data', 'ai_conversation_summary')
        }),
        ("Attribution Campagnes & UTM", {
            'fields': ('utm_source', 'utm_medium', 'utm_campaign')
        }),
        ("Consentements & Conformité", {
            'fields': ('consent_data_processing', 'consent_marketing', 'created_at', 'updated_at')
        }),
    )

    actions = ['mark_as_qualified', 'mark_as_contacted', 'mark_as_meeting_scheduled', 'mark_as_reserved', 'export_csv']

    @admin.action(description="Exporter les prospects sélectionnés en CSV")
    def export_csv(self, request, queryset):
        response = HttpResponse(content_type='text/csv; charset=utf-8')
        response['Content-Disposition'] = 'attachment; filename="prospects-noema.csv"'
        response.write('\ufeff')
        writer = csv.writer(response)
        writer.writerow([
            'ID', 'Créé le', 'Prénom', 'Nom', 'Email', 'Téléphone', 'Pays',
            'Objectif', 'Appartement', 'Statut', 'Source UTM', 'Campagne UTM',
            'Revenus mensuels', 'Apport', 'Consentement traitement', 'Consentement marketing'
        ])
        for lead in queryset.select_related('interested_apartment'):
            writer.writerow([
                lead.id, lead.created_at.isoformat(), lead.first_name, lead.last_name,
                lead.email, lead.phone_whatsapp, lead.residence_country,
                lead.project_purpose, lead.interested_apartment_ref or getattr(lead.interested_apartment, 'reference', ''),
                lead.get_pipeline_stage_display(), lead.utm_source, lead.utm_campaign,
                lead.monthly_net_income, lead.down_payment,
                lead.consent_data_processing, lead.consent_marketing
            ])
        return response

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
