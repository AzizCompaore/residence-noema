from django.db import migrations


def seed_penthouses(apps, schema_editor):
    Apartment = apps.get_model('apartments', 'Apartment')
    if Apartment.objects.filter(commercial_segment='penthouse').exists():
        return

    common = {
        'commercial_segment': 'penthouse',
        'is_public': False,
        'is_featured': False,
        'status': 'reserved',
        'floor': 'Penthouse — niveau et orientation à confirmer',
        'price_fcfa': 0,
        'parking_notes': 'Nombre de places à confirmer.',
        'orientation_notes': 'À vérifier lot par lot.',
        'view_notes': 'À vérifier lot par lot.',
        'photos': [],
        'key_features': ['Lot conservé par la maîtrise d’ouvrage', 'Non commercialisé'],
        'display_order': 90,
    }
    Apartment.objects.create(
        reference='NOEMA-PH-T3-01', name='Penthouse T3 — interne', apartment_type='t3',
        rooms_count=3, bedrooms_count=2, bathrooms_count=2, surface_sqm=122.02,
        balcony_surface_sqm=17.56,
        description="Penthouse T3 de 122,02 m² avec séjour, cuisine, balcon de 17,56 m² et deux chambres avec salle d'eau. Lot conservé par la maîtrise d'ouvrage.",
        composition=['Séjour', 'Cuisine', 'Balcon de 17,56 m²', '2 chambres avec salle d’eau'], **common,
    )
    Apartment.objects.create(
        reference='NOEMA-PH-T2-01', name='Penthouse T2 — interne', apartment_type='t2',
        rooms_count=2, bedrooms_count=1, bathrooms_count=1, surface_sqm=84.18,
        balcony_surface_sqm=12.68,
        description="Penthouse T2 de 84,18 m² avec séjour et salle à manger, cuisine, balcon de 12,68 m² et chambre avec salle d'eau. Lot conservé par la maîtrise d’ouvrage.",
        composition=['Séjour + salle à manger', 'Cuisine', 'Balcon de 12,68 m²', '1 chambre avec salle d’eau'], **common,
    )
    Apartment.objects.create(
        reference='NOEMA-PH-T7-01', name='Penthouse T7 — réservé promotrice', apartment_type='t3',
        rooms_count=7, bedrooms_count=6, bathrooms_count=6, surface_sqm=321.08,
        balcony_surface_sqm=59.15,
        description="Grand appartement T7 de 321,08 m² réservé à la promotrice, avec grande terrasse de 50,32 m² et balcon de 8,83 m² pour la chambre principale. Non commercialisé.",
        composition=['Séjour / salle à manger / cuisine', 'Grande terrasse de 50,32 m²', 'Chambre principale avec dressing, salle d’eau et balcon de 8,83 m²', '5 chambres supplémentaires avec salle d’eau', 'Toilette visiteur'], **common,
    )


class Migration(migrations.Migration):
    dependencies = [('apartments', '0003_seed_public_catalogue')]
    operations = [migrations.RunPython(seed_penthouses, migrations.RunPython.noop)]
