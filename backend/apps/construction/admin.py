from django.contrib import admin
from .models import ConstructionMilestone

@admin.register(ConstructionMilestone)
class ConstructionMilestoneAdmin(admin.ModelAdmin):
    list_display = ('stage_number', 'title', 'status', 'progress_percent', 'date_display', 'is_3d_render')
    list_editable = ('status', 'progress_percent', 'date_display')
    list_filter = ('status', 'is_3d_render')
    ordering = ('stage_number',)
