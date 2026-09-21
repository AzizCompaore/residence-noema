from django.db import migrations


def set_estimated_delivery_date(apps, schema_editor):
    Residence = apps.get_model('residences', 'Residence')
    Residence.objects.filter(delivery_date_estimated='28 mois restants').update(
        delivery_date_estimated='15 janvier 2029'
    )


class Migration(migrations.Migration):
    dependencies = [
        ('residences', '0006_update_delivery_period'),
    ]

    operations = [migrations.RunPython(set_estimated_delivery_date, migrations.RunPython.noop)]