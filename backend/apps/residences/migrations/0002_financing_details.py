from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [('residences', '0001_initial')]

    operations = [
        migrations.AddField(
            model_name='residence', name='financing_partners',
            field=models.TextField(default='BHCI — partenariat VEFA confirmé. Autres banques à vérifier.', verbose_name='Banques partenaires'),
        ),
        migrations.AddField(
            model_name='residence', name='financing_notes',
            field=models.TextField(default="Taux, apport minimum, durée de prêt et seuil d'endettement à confirmer.", verbose_name='Informations financement à confirmer'),
        ),
    ]