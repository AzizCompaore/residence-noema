from django.db import migrations


def encode_catalogue_photo_paths(apps, schema_editor):
    Apartment = apps.get_model('apartments', 'Apartment')
    for apartment in Apartment.objects.all():
        apartment.photos = [photo.replace('#', '%23') for photo in apartment.photos]
        apartment.save(update_fields=['photos'])


class Migration(migrations.Migration):
    dependencies = [
        ('apartments', '0005_seed_catalogue_photos'),
    ]

    operations = [migrations.RunPython(encode_catalogue_photo_paths, migrations.RunPython.noop)]