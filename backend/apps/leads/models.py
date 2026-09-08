from django.db import models
from apps.apartments.models import Apartment

class Lead(models.Model):
    STAGE_CHOICES = [
        ('new', 'Nouveau prospect'),
        ('qualified', 'Qualifié'),
        ('contacted', 'Contacté'),
        ('meeting_scheduled', 'Rendez-vous planifié'),
        ('file_review', 'Étude du dossier'),
        ('reserved', 'Réservation'),
        ('sold', 'Vente conclue'),
    ]

    first_name = models.CharField(max_length=100, verbose_name="Prénom")
    last_name = models.CharField(max_length=100, verbose_name="Nom")
    phone_whatsapp = models.CharField(max_length=50, verbose_name="Téléphone / WhatsApp")
    email = models.EmailField(verbose_name="Email")
    residence_country = models.CharField(max_length=100, verbose_name="Pays de résidence")
    age = models.PositiveSmallIntegerField(null=True, blank=True, verbose_name="Âge")
    employment_status = models.CharField(max_length=100, blank=True, verbose_name="Situation professionnelle")
    
    # Financial data
    monthly_net_income = models.DecimalField(max_digits=12, decimal_places=0, null=True, blank=True, verbose_name="Revenus mensuels nets")
    down_payment = models.DecimalField(max_digits=12, decimal_places=0, null=True, blank=True, verbose_name="Apport personnel disponible")
    existing_monthly_loans = models.DecimalField(max_digits=12, decimal_places=0, null=True, blank=True, verbose_name="Crédits / charges existantes")
    desired_duration_years = models.PositiveSmallIntegerField(null=True, blank=True, verbose_name="Durée souhaitée (ans)")

    # Relation to apartment
    interested_apartment = models.ForeignKey(Apartment, on_delete=models.SET_NULL, null=True, blank=True, related_name='leads', verbose_name="Appartement ciblé")
    interested_apartment_ref = models.CharField(max_length=50, blank=True, verbose_name="Référence appartement")

    # Simulation summary
    simulation_data = models.JSONField(default=dict, blank=True, verbose_name="Données de simulation")

    # UTM & Campaign Attribution
    utm_source = models.CharField(max_length=100, blank=True, verbose_name="Source UTM (ex: instagram, tiktok)")
    utm_medium = models.CharField(max_length=100, blank=True, verbose_name="Medium UTM (ex: cpc, social)")
    utm_campaign = models.CharField(max_length=100, blank=True, verbose_name="Campagne UTM")
    
    # Pipeline & CRM
    pipeline_stage = models.CharField(max_length=30, choices=STAGE_CHOICES, default='new', verbose_name="Statut Pipeline CRM")
    notes = models.TextField(blank=True, verbose_name="Notes & Historique commercial")
    follow_up_count = models.PositiveIntegerField(default=0, verbose_name="Nombre de relances")
    
    # GDPR & Consent
    consent_marketing = models.BooleanField(default=False, verbose_name="Consentement relances marketing")
    consent_data_processing = models.BooleanField(default=True, verbose_name="Consentement traitement données (RGPD)")

    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Dernière mise à jour")

    class Meta:
        verbose_name = "Prospect / Lead CRM"
        verbose_name_plural = "Prospects / Leads CRM"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.phone_whatsapp}) — {self.get_pipeline_stage_display()}"
