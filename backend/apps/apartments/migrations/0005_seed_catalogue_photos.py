from django.db import migrations


def seed_catalogue_photos(apps, schema_editor):
    Apartment = apps.get_model('apartments', 'Apartment')

    Apartment.objects.filter(apartment_type='t2').update(photos=[
        '/images/Dossier T2/Rendus salon F2 modifi#U00e9/Salon 1.webp',
        '/images/Dossier T2/Rendus salon F2 modifi#U00e9/Salon 2.webp',
        '/images/Dossier T2/Rendus F2/Chambre 1.webp',
        '/images/Dossier T2/Rendus F2/Cuisine 1.webp',
        '/images/Dossier T2/Rendus F2/Douche.webp',
        '/images/Dossier T2/Rendus F2/Entr#U00e9e.webp',
    ])

    Apartment.objects.filter(apartment_type='t3').update(photos=[
        "/images/Dossier T3/Salon F3 modifi#U00e9/Salon 1.webp",
        "/images/Dossier T3/Salon F3 modifi#U00e9/Salon 2.webp",
        "/images/Dossier T3/Rendus F3'/Chambre Master 1 F3'.webp",
        "/images/Dossier T3/Rendus F3'/Chambre 2 F3'.webp",
        "/images/Dossier T3/Rendus F3'/Cuisine 1.webp",
        "/images/Dossier T3/Rendus F3'/Douche Suite Master 1 F3'.webp",
    ])


class Migration(migrations.Migration):
    dependencies = [
        ('apartments', '0004_seed_internal_penthouses'),
    ]

    operations = [migrations.RunPython(seed_catalogue_photos, migrations.RunPython.noop)]