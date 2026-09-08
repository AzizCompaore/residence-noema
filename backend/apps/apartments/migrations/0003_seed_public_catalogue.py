from django.db import migrations


def seed_catalogue(apps, schema_editor):
    Apartment = apps.get_model('apartments', 'Apartment')
    if Apartment.objects.exists():
        return

    common = {
        'status': 'available',
        'is_public': True,
        'is_featured': True,
        'commercial_segment': 'standard',
        'floor': 'Selon lot — étage et orientation à confirmer',
        'parking_notes': 'Nombre de places par lot à confirmer.',
        'orientation_notes': 'À vérifier lot par lot.',
        'view_notes': 'À vérifier lot par lot.',
        'photos': [],
    }
    Apartment.objects.create(
        reference='NOEMA-T2-ETC-01',
        name='T2 étage courant',
        apartment_type='t2',
        rooms_count=2,
        bedrooms_count=1,
        bathrooms_count=1,
        surface_sqm=50.01,
        balcony_surface_sqm=0,
        price_fcfa=59000000,
        price_launch_fcfa=59000000,
        price_structure_fcfa=65000000,
        price_closed_fcfa=69000000,
        description="T2 de 50,01 m² comprenant séjour et coin repas, cuisine, buanderie, dégagement, toilette et chambre avec salle d'eau. Lot sans balcon.",
        key_features=['Séjour + coin repas', 'Cuisine et buanderie', '1 chambre avec salle d’eau', 'Aucun balcon'],
        composition=['Séjour + coin repas', 'Cuisine', 'Buanderie', 'Dégagement', 'Toilette', '1 chambre', '1 salle d’eau chambre'],
        display_order=1,
        **common,
    )
    Apartment.objects.create(
        reference='NOEMA-T3-ETC-01',
        name='T3 étage courant',
        apartment_type='t3',
        rooms_count=3,
        bedrooms_count=2,
        bathrooms_count=2,
        surface_sqm=100.10,
        balcony_surface_sqm=4.56,
        price_fcfa=109000000,
        price_launch_fcfa=109000000,
        price_structure_fcfa=115000000,
        price_closed_fcfa=129000000,
        description="T3 de 100,10 m² comprenant séjour et coin repas, balcon de 4,56 m², cuisine, buanderie, dégagement, toilette et deux chambres avec salle d'eau privative.",
        key_features=['Séjour + coin repas', 'Balcon de 4,56 m²', 'Cuisine et buanderie', '2 chambres avec salle d’eau'],
        composition=['Séjour + coin repas', 'Balcon', 'Cuisine', 'Buanderie', 'Dégagement', 'Toilette', '2 chambres avec salle d’eau chacune'],
        display_order=2,
        **common,
    )


class Migration(migrations.Migration):
    dependencies = [('apartments', '0002_catalogue_real_estate_details')]
    operations = [migrations.RunPython(seed_catalogue, migrations.RunPython.noop)]
