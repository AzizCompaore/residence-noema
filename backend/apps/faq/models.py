from django.db import models

class FAQItem(models.Model):
    CATEGORY_CHOICES = [
        ('projet', 'Projet & Architecture'),
        ('financement', 'Financement & Apport'),
        ('diaspora', 'Acquéreurs Diaspora & Étranger'),
        ('reservation', 'Réservation & Juridique'),
        ('chantier', 'Suivi de Chantier & Livraison'),
    ]

    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default='projet', verbose_name="Catégorie")
    question = models.CharField(max_length=255, verbose_name="Question fréquente")
    answer = models.TextField(verbose_name="Réponse détaillée")
    display_order = models.PositiveIntegerField(default=0, verbose_name="Ordre")
    is_published = models.BooleanField(default=True, verbose_name="Publiée en ligne")

    class Meta:
        verbose_name = "Question / Réponse FAQ"
        verbose_name_plural = "Questions / Réponses FAQ"
        ordering = ['display_order', 'id']

    def __str__(self):
        return f"[{self.get_category_display()}] {self.question}"
