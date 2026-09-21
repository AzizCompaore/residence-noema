from django.db import migrations, models


def set_estimated_delivery_month(apps, schema_editor):
    Residence = apps.get_model('residences', 'Residence')
    Residence.objects.filter(delivery_date_estimated='15 janvier 2029').update(
        delivery_date_estimated='janvier 2029'
    )


class Migration(migrations.Migration):

    dependencies = [
        ('residences', '0008_alter_residence_delivery_date_estimated'),
    ]

    operations = [
        migrations.RunPython(set_estimated_delivery_month, migrations.RunPython.noop),
        migrations.AlterField(
            model_name='residence',
            name='delivery_date_estimated',
            field=models.CharField(default='janvier 2029', max_length=100, verbose_name='Livraison prévisionnelle'),
        ),
    ]