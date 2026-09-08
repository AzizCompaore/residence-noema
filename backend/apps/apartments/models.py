from django.db import models

class Apartment(models.Model):
    STATUS_CHOICES = [
        ('available', 'Disponible'),
        ('option', 'Option'),
        ('reserved', 'Réservé'),
        ('sold', 'Vendu'),
    ]

    TYPE_CHOICES = [
        ('t2', 'T2'),
        ('t3', 'T3'),
    ]

    SEGMENT_CHOICES = [
        ('standard', 'Standard (RDC à R+2)'),
        ('premium', 'Premium (R+3 à R+6)'),
        ('prestige', 'Prestige (R+7)'),
        ('penthouse', 'Penthouse (interne)'),
    ]

    reference = models.CharField(max_length=50, unique=True, verbose_name="Référence Lot")
    name = models.CharField(max_length=150, verbose_name="Nom Commercial")
    apartment_type = models.CharField(max_length=30, choices=TYPE_CHOICES, default='t2', verbose_name="Typologie")
    commercial_segment = models.CharField(max_length=20, choices=SEGMENT_CHOICES, default='standard', verbose_name="Segment commercial")
    is_public = models.BooleanField(default=True, verbose_name="Publier sur le site")
    rooms_count = models.PositiveSmallIntegerField(default=3, verbose_name="Nombre de pièces")
    bedrooms_count = models.PositiveSmallIntegerField(default=2, verbose_name="Chambres")
    bathrooms_count = models.PositiveSmallIntegerField(default=2, verbose_name="Salles d'eau")
    surface_sqm = models.FloatField(verbose_name="Surface habitable (m²)")
    balcony_surface_sqm = models.FloatField(default=0, verbose_name="Surface terrasse / balcon (m²)")
    floor = models.CharField(max_length=100, verbose_name="Étage / Position")
    price_fcfa = models.DecimalField(max_digits=12, decimal_places=0, verbose_name="Prix (FCFA)")
    price_launch_fcfa = models.DecimalField(max_digits=12, decimal_places=0, null=True, blank=True, verbose_name="Prix lancement (FCFA)")
    price_structure_fcfa = models.DecimalField(max_digits=12, decimal_places=0, null=True, blank=True, verbose_name="Prix gros œuvre (FCFA)")
    price_closed_fcfa = models.DecimalField(max_digits=12, decimal_places=0, null=True, blank=True, verbose_name="Prix hors d'eau / air (FCFA)")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available', verbose_name="Statut Commercial")
    description = models.TextField(verbose_name="Description détaillée")
    key_features = models.JSONField(default=list, blank=True, verbose_name="Points forts (liste)")
    composition = models.JSONField(default=list, blank=True, verbose_name="Composition des pièces (liste)")
    parking_notes = models.CharField(max_length=255, blank=True, verbose_name="Parking / stationnement")
    orientation_notes = models.CharField(max_length=255, blank=True, verbose_name="Orientation (à vérifier)")
    view_notes = models.CharField(max_length=255, blank=True, verbose_name="Vue (à vérifier)")
    photos = models.JSONField(default=list, blank=True, verbose_name="Photos (liste d'URLs ou chemins média)")
    floor_plan_image = models.ImageField(upload_to='apartments/plans/', null=True, blank=True, verbose_name="Plan de l'appartement")
    display_order = models.PositiveIntegerField(default=0, verbose_name="Ordre d'affichage")
    is_featured = models.BooleanField(default=True, verbose_name="Mettre en avant")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Appartement"
        verbose_name_plural = "Appartements"
        ordering = ['display_order', 'price_fcfa']

    def __str__(self):
        return f"{self.reference} — {self.name} ({self.get_status_display()})"
