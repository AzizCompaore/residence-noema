from django.db import migrations


def normalize_catalogue_photo_paths(apps, schema_editor):
    Apartment = apps.get_model('apartments', 'Apartment')
    replacements = {
        'Rendus salon F2 modifi%23U00e9': 'Rendus salon F2 modifie',
        'Salon F3 modifi%23U00e9': 'Salon F3 modifie',
        "Rendus F3'": 'Rendus F3',
        'Entr%23U00e9e.webp': 'Entree.webp',
    }
    for apartment in Apartment.objects.all():
        photos = apartment.photos
        for old, new in replacements.items():
            photos = [photo.replace(old, new) for photo in photos]
        apartment.photos = photos
        apartment.save(update_fields=['photos'])


class Migration(migrations.Migration):
    dependencies = [
        ('apartments', '0006_encode_catalogue_photo_paths'),
    ]

    operations = [migrations.RunPython(normalize_catalogue_photo_paths, migrations.RunPython.noop)]