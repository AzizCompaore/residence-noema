from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leads', '0002_lead_additional_monthly_income_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lead',
            name='email',
            field=models.EmailField(db_index=True, max_length=254, verbose_name='Email'),
        ),
        migrations.AlterField(
            model_name='lead',
            name='phone_whatsapp',
            field=models.CharField(db_index=True, max_length=50, verbose_name='Téléphone / WhatsApp'),
        ),
        migrations.AddIndex(
            model_name='lead',
            index=models.Index(fields=['pipeline_stage', '-created_at'], name='lead_stage_created_idx'),
        ),
        migrations.AddIndex(
            model_name='lead',
            index=models.Index(fields=['utm_source', '-created_at'], name='lead_source_created_idx'),
        ),
    ]