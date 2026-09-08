from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [('residences', '0003_seed_residence')]

    operations = [
        migrations.AlterField(
            model_name='residence', name='total_units',
            field=models.PositiveIntegerField(default=30, verbose_name='Nombre total de logements'),
        ),
        migrations.AlterField(
            model_name='residence', name='delivery_date_estimated',
            field=models.CharField(default='30 mois', max_length=100, verbose_name='Livraison prévisionnelle'),
        ),
    ]
