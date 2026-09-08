from django.db import migrations, models


def update_catalogue(apps, schema_editor):
    Apartment = apps.get_model('apartments', 'Apartment')
    t2 = Apartment.objects.filter(apartment_type='t2').order_by('display_order', 'id').first()
    t3 = Apartment.objects.filter(apartment_type='t3').order_by('display_order', 'id').first()

    if t2:
        t2.name = 'T2 étage courant'
        t2.surface_sqm = 50.01
        t2.balcony_surface_sqm = 0
        t2.rooms_count = 2
        t2.bedrooms_count = 1
        t2.bathrooms_count = 1
        t2.price_fcfa = 59000000
        t2.price_launch_fcfa = 59000000
        t2.price_structure_fcfa = 65000000
        t2.price_closed_fcfa = 69000000
        t2.description = "T2 de 50,01 m² comprenant séjour et coin repas, cuisine, buanderie, dégagement, toilette et chambre avec salle d'eau. Lot sans balcon."
        t2.key_features = ['Séjour + coin repas', 'Cuisine et buanderie', '1 chambre avec salle d’eau', 'Aucun balcon']
        t2.composition = ['Séjour + coin repas', 'Cuisine', 'Buanderie', 'Dégagement', 'Toilette', '1 chambre', '1 salle d’eau chambre']
        t2.commercial_segment = 'standard'
        t2.save()

    if t3:
        t3.name = 'T3 étage courant'
        t3.surface_sqm = 100.10
        t3.balcony_surface_sqm = 4.56
        t3.rooms_count = 3
        t3.bedrooms_count = 2
        t3.bathrooms_count = 2
        t3.price_fcfa = 109000000
        t3.price_launch_fcfa = 109000000
        t3.price_structure_fcfa = 115000000
        t3.price_closed_fcfa = 129000000
        t3.description = "T3 de 100,10 m² comprenant séjour et coin repas, balcon de 4,56 m², cuisine, buanderie, dégagement, toilette et deux chambres avec salle d'eau privative."
        t3.key_features = ['Séjour + coin repas', 'Balcon de 4,56 m²', 'Cuisine et buanderie', '2 chambres avec salle d’eau']
        t3.composition = ['Séjour + coin repas', 'Balcon', 'Cuisine', 'Buanderie', 'Dégagement', 'Toilette', '2 chambres avec salle d’eau chacune']
        t3.commercial_segment = 'standard'
        t3.save()


def update_residence(apps, schema_editor):
    Residence = apps.get_model('residences', 'Residence')
    residence = Residence.objects.order_by('id').first()
    if residence:
        residence.total_units = 30
        residence.delivery_date_estimated = '30 mois'
        residence.save(update_fields=['total_units', 'delivery_date_estimated'])


class Migration(migrations.Migration):
    dependencies = [
        ('apartments', '0001_initial'),
        ('residences', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='apartment', name='commercial_segment',
            field=models.CharField(choices=[('standard', 'Standard (RDC à R+2)'), ('premium', 'Premium (R+3 à R+6)'), ('prestige', 'Prestige (R+7)'), ('penthouse', 'Penthouse (interne)')], default='standard', max_length=20, verbose_name='Segment commercial'),
        ),
        migrations.AddField(
            model_name='apartment', name='is_public',
            field=models.BooleanField(default=True, verbose_name='Publier sur le site'),
        ),
        migrations.AddField(
            model_name='apartment', name='price_launch_fcfa',
            field=models.DecimalField(blank=True, decimal_places=0, max_digits=12, null=True, verbose_name='Prix lancement (FCFA)'),
        ),
        migrations.AddField(
            model_name='apartment', name='price_structure_fcfa',
            field=models.DecimalField(blank=True, decimal_places=0, max_digits=12, null=True, verbose_name='Prix gros œuvre (FCFA)'),
        ),
        migrations.AddField(
            model_name='apartment', name='price_closed_fcfa',
            field=models.DecimalField(blank=True, decimal_places=0, max_digits=12, null=True, verbose_name="Prix hors d'eau / air (FCFA)"),
        ),
        migrations.AddField(
            model_name='apartment', name='composition',
            field=models.JSONField(blank=True, default=list, verbose_name='Composition des pièces (liste)'),
        ),
        migrations.AddField(
            model_name='apartment', name='parking_notes',
            field=models.CharField(blank=True, max_length=255, verbose_name='Parking / stationnement'),
        ),
        migrations.AddField(
            model_name='apartment', name='orientation_notes',
            field=models.CharField(blank=True, max_length=255, verbose_name='Orientation (à vérifier)'),
        ),
        migrations.AddField(
            model_name='apartment', name='view_notes',
            field=models.CharField(blank=True, max_length=255, verbose_name='Vue (à vérifier)'),
        ),
        migrations.RunPython(update_catalogue, migrations.RunPython.noop),
        migrations.RunPython(update_residence, migrations.RunPython.noop),
    ]
