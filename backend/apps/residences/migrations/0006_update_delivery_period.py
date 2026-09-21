from django.db import migrations


def update_delivery_period(apps, schema_editor):
    Residence = apps.get_model('residences', 'Residence')
    Residence.objects.filter(delivery_date_estimated__in=['30 mois', '2029-02-09']).update(
        delivery_date_estimated='28 mois restants'
    )

    FAQItem = apps.get_model('faq', 'FAQItem')
    FAQItem.objects.filter(question__icontains='livraison').filter(
        answer__icontains='30 mois'
    ).update(
        answer='La durée totale annoncée pour la Résidence NOEMA est de 30 mois. Deux mois étant déjà réalisés, la période restante est de 28 mois. Le planning est suivi par la direction des travaux.'
    )


class Migration(migrations.Migration):
    dependencies = [
        ('faq', '0001_initial'),
        ('residences', '0005_alter_residence_delivery_date_estimated'),
    ]

    operations = [migrations.RunPython(update_delivery_period, migrations.RunPython.noop)]