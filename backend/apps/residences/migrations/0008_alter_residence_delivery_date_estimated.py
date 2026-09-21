from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('residences', '0007_set_estimated_delivery_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='residence',
            name='delivery_date_estimated',
            field=models.CharField(default='15 janvier 2029', max_length=100, verbose_name='Livraison prévisionnelle'),
        ),
    ]