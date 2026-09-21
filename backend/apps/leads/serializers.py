from rest_framework import serializers, generics, permissions
from rest_framework.response import Response
from .models import Lead


class LeadSerializer(serializers.ModelSerializer):
    """
    Reçoit la soumission du simulateur / des formulaires de financement.
    Le frontend envoie `interested_apartment_id` (voir types.ts::LeadSubmission) ;
    on l'expose ici pour ne pas imposer un renommage côté React.
    """
    interested_apartment_id = serializers.PrimaryKeyRelatedField(
        source='interested_apartment', queryset=Lead._meta.get_field('interested_apartment').related_model.objects.all(),
        required=False, allow_null=True
    )
    simulation = serializers.JSONField(source='simulation_data', required=False)

    class Meta:
        model = Lead
        fields = [
            'id', 'first_name', 'last_name', 'phone_whatsapp', 'email', 'residence_country',
            'age', 'employment_status', 'professional_seniority_years',
            'project_purpose', 'funds_availability',
            'monthly_net_income', 'has_co_borrower', 'co_borrower_monthly_income',
            'additional_monthly_income', 'down_payment', 'existing_monthly_loans',
            'desired_duration_years', 'interested_apartment_id', 'interested_apartment_ref',
            'interested_apartment_price', 'simulation', 'ai_conversation_summary', 'notes',
            'utm_source', 'utm_medium', 'utm_campaign',
            'consent_marketing', 'consent_data_processing',
            'pipeline_stage', 'created_at',
        ]
        read_only_fields = ['id', 'pipeline_stage', 'created_at']


class LeadCreateView(generics.CreateAPIView):
    """
    Endpoint public (formulaire de simulation / rappel) : création uniquement.
    La consultation des prospects reste réservée au back-office Django Admin.
    """
    serializer_class = LeadSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Lead.objects.all()

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    def get(self, request, *args, **kwargs):
        leads = self.get_queryset().select_related('interested_apartment')
        serializer = self.get_serializer(leads, many=True)
        return Response({'success': True, 'data': serializer.data})

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data
        email = validated_data.get('email', '').lower().strip()
        phone = ''.join(character for character in validated_data.get('phone_whatsapp', '') if character.isdigit())
        existing_lead = next(
            (
                lead for lead in Lead.objects.all()
                if lead.email.lower().strip() == email
                or ''.join(character for character in lead.phone_whatsapp if character.isdigit()) == phone
            ),
            None,
        )
        if existing_lead:
            for field, value in validated_data.items():
                if field not in {'pipeline_stage', 'notes'} and value not in (None, '', {}):
                    setattr(existing_lead, field, value)
            existing_lead.follow_up_count += 1
            existing_lead.save()
            lead = existing_lead
        else:
            lead = serializer.save()
        return Response(
            {'success': True, 'message': 'Votre demande a bien été enregistrée. Un conseiller Uriel Group vous recontacte très prochainement.', 'data': {'id': lead.id}},
            status=201
        )
