from django.db import models

class Residence(models.Model):
    name = models.CharField(max_length=150, default="Résidence NOEMA", verbose_name="Nom de la résidence")
    tagline = models.CharField(max_length=255, verbose_name="Slogan / Proposition de valeur")
    city = models.CharField(max_length=100, default="Abidjan")
    district = models.CharField(max_length=150, default="Angré Djorogobité")
    country = models.CharField(max_length=100, default="Côte d'Ivoire")
    description = models.TextField(verbose_name="Description architecturale")
    architectural_concept = models.TextField(verbose_name="Concept architectural")
    total_units = models.PositiveIntegerField(default=30, verbose_name="Nombre total de logements")
    floors = models.CharField(max_length=50, default="R+7", verbose_name="Niveaux / Étages")
    delivery_date_estimated = models.CharField(max_length=100, default="2029-02-09", verbose_name="Livraison prévisionnelle")
    status = models.CharField(max_length=100, default="Chantier en cours", verbose_name="Statut du programme")
    hero_image = models.ImageField(upload_to='residences/', null=True, blank=True, verbose_name="Photo principale de la résidence")
    whatsapp_number = models.CharField(max_length=50, default="+2250789001122", verbose_name="Numéro WhatsApp commercial")
    phone_number = models.CharField(max_length=50, default="+225 27 22 00 11 22", verbose_name="Téléphone fixe")
    email_contact = models.EmailField(default="contact@laresidencenoema.com", verbose_name="Email commercial")
    financing_partners = models.TextField(default="BHCI — partenariat VEFA confirmé. Autres banques à vérifier.", verbose_name="Banques partenaires")
    financing_notes = models.TextField(default="Taux, apport minimum, durée de prêt et seuil d'endettement à confirmer.", verbose_name="Informations financement à confirmer")
    indicative_interest_rate = models.FloatField(default=6.5, verbose_name="Taux d'intérêt indicatif moyen (%)")
    indicative_debt_ratio_limit = models.FloatField(default=33.0, verbose_name="Seuil d'endettement max indicatif (%)")
    address_details = models.TextField(verbose_name="Détails adresse & accès")
    latitude = models.DecimalField(max_digits=9, decimal_places=6, default=5.399806, verbose_name="Latitude GPS")
    longitude = models.DecimalField(max_digits=9, decimal_places=6, default=-3.943556, verbose_name="Longitude GPS")

    class Meta:
        verbose_name = "Paramètres de la Résidence"
        verbose_name_plural = "Paramètres de la Résidence"

    def __str__(self):
        return f"{self.name} — {self.district}, {self.city}"
