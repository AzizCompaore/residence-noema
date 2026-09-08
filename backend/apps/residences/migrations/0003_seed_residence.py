from django.db import migrations


def seed_residence(apps, schema_editor):
    Residence = apps.get_model('residences', 'Residence')
    if Residence.objects.exists():
        return
    Residence.objects.create(
        name='Résidence NOEMA',
        tagline="Une signature architecturale contemporaine au cœur d'Angré Djorogobité.",
        city='Abidjan',
        district='Angré Djorogobité',
        country="Côte d'Ivoire",
        description="Résidence neuve en VEFA à Angré Djorogobité, avec des appartements T2 et T3 commercialisés et trois lots penthouse conservés par la maîtrise d’ouvrage.",
        architectural_concept='Architecture contemporaine R+7, espaces communs soignés et logements lumineux.',
        total_units=30,
        floors='R+7 avec stationnement au rez-de-chaussée',
        delivery_date_estimated='30 mois',
        status='Chantier en cours',
        whatsapp_number='',
        phone_number='',
        email_contact='',
        financing_partners='BHCI — partenariat VEFA confirmé. Autres banques à vérifier.',
        financing_notes="Taux, apport minimum, durée de prêt et seuil d'endettement à confirmer.",
        address_details='Angré Djorogobité, Cocody — Abidjan, Côte d’Ivoire. Adresse et coordonnées GPS à confirmer.',
    )


class Migration(migrations.Migration):
    dependencies = [('residences', '0002_financing_details')]
    operations = [migrations.RunPython(seed_residence, migrations.RunPython.noop)]
