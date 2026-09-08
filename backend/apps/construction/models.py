from django.db import models

class ConstructionMilestone(models.Model):
    STATUS_CHOICES = [
        ('completed', 'Achevé'),
        ('in_progress', 'En cours'),
        ('upcoming', 'À venir'),
    ]

    stage_number = models.PositiveSmallIntegerField(default=1, verbose_name="Étape n°")
    title = models.CharField(max_length=200, verbose_name="Intitulé de l'étape")
    description = models.TextField(verbose_name="Description détaillée des travaux")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='upcoming', verbose_name="Statut")
    progress_percent = models.PositiveSmallIntegerField(default=0, verbose_name="Progression (%)")
    date_display = models.CharField(max_length=100, verbose_name="Date / Période affichée")
    photo = models.ImageField(upload_to='construction/', null=True, blank=True, verbose_name="Photo de chantier réelle")
    is_3d_render = models.BooleanField(default=False, verbose_name="Est un rendu 3D (Transparence acquéreur)")
    video_url = models.URLField(blank=True, verbose_name="Lien vidéo de suivi (optionnel)")
    display_order = models.PositiveIntegerField(default=0, verbose_name="Ordre chronologique")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Avancement Chantier"
        verbose_name_plural = "Avancement Chantier"
        ordering = ['stage_number', 'display_order']

    def __str__(self):
        return f"Étape {self.stage_number} : {self.title} ({self.progress_percent}%)"
