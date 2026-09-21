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

    # Les 5 profils diaspora identifiés par la promotrice (le financement est transversal, pas un 6e profil)
    # Les valeurs correspondent mot pour mot aux libellés du sélecteur du simulateur (frontend/src/components/SimulatorModal.tsx)
    PROJECT_PURPOSE_CHOICES = [
        ('Je prépare mon retour à Abidjan', "Je prépare mon retour à Abidjan"),
        ('Je construis mon patrimoine en Afrique', "Je construis mon patrimoine en Afrique"),
        ('J’investis pour générer des revenus', "J’investis pour générer des revenus"),
        ('Je veux mon pied-à-terre à Abidjan et le rentabiliser', "Je veux mon pied-à-terre à Abidjan et le rentabiliser"),
        ('Je constitue un patrimoine pour ma famille', "Je constitue un patrimoine pour ma famille"),
    ]

    FUNDS_AVAILABILITY_CHOICES = [
        ('Disponible immédiatement', 'Disponible immédiatement'),
        ('Disponible sous 1 à 3 mois', 'Disponible sous 1 à 3 mois'),
        ('À étudier avec un conseiller', "À étudier avec un conseiller"),
    ]

    first_name = models.CharField(max_length=100, verbose_name="Prénom")
    last_name = models.CharField(max_length=100, verbose_name="Nom")
    phone_whatsapp = models.CharField(max_length=50, db_index=True, verbose_name="Téléphone / WhatsApp")
    email = models.EmailField(db_index=True, verbose_name="Email")
    residence_country = models.CharField(max_length=100, verbose_name="Pays de résidence")
    age = models.PositiveSmallIntegerField(null=True, blank=True, verbose_name="Âge")
    employment_status = models.CharField(max_length=100, blank=True, verbose_name="Situation professionnelle")
    professional_seniority_years = models.PositiveSmallIntegerField(null=True, blank=True, verbose_name="Ancienneté professionnelle (ans)")

    # Projet & objectif diaspora (transversal au financement)
    project_purpose = models.CharField(max_length=80, choices=PROJECT_PURPOSE_CHOICES, blank=True, verbose_name="Objectif du projet (profil diaspora)")
    funds_availability = models.CharField(max_length=40, choices=FUNDS_AVAILABILITY_CHOICES, blank=True, verbose_name="Disponibilité des fonds")

    # Financial data
    monthly_net_income = models.DecimalField(max_digits=12, decimal_places=0, null=True, blank=True, verbose_name="Revenus mensuels nets")
    has_co_borrower = models.BooleanField(default=False, verbose_name="Co-emprunteur")
    co_borrower_monthly_income = models.DecimalField(max_digits=12, decimal_places=0, null=True, blank=True, verbose_name="Revenus mensuels co-emprunteur")
    additional_monthly_income = models.DecimalField(max_digits=12, decimal_places=0, null=True, blank=True, verbose_name="Revenus complémentaires")
    down_payment = models.DecimalField(max_digits=12, decimal_places=0, null=True, blank=True, verbose_name="Apport personnel disponible")
    existing_monthly_loans = models.DecimalField(max_digits=12, decimal_places=0, null=True, blank=True, verbose_name="Crédits / charges existantes")
    desired_duration_years = models.PositiveSmallIntegerField(null=True, blank=True, verbose_name="Durée souhaitée (ans)")

    # Relation to apartment
    interested_apartment = models.ForeignKey(Apartment, on_delete=models.SET_NULL, null=True, blank=True, related_name='leads', verbose_name="Appartement ciblé")
    interested_apartment_ref = models.CharField(max_length=50, blank=True, verbose_name="Référence appartement")
    interested_apartment_price = models.DecimalField(max_digits=12, decimal_places=0, null=True, blank=True, verbose_name="Prix appartement ciblé (au moment de la demande)")

    # Simulation summary
    simulation_data = models.JSONField(default=dict, blank=True, verbose_name="Données de simulation")
    ai_conversation_summary = models.TextField(blank=True, verbose_name="Résumé assistant commercial (le cas échéant)")

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
        indexes = [
            models.Index(fields=['pipeline_stage', '-created_at'], name='lead_stage_created_idx'),
            models.Index(fields=['utm_source', '-created_at'], name='lead_source_created_idx'),
        ]

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.phone_whatsapp}) — {self.get_pipeline_stage_display()}"
