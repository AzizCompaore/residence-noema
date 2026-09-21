from django.contrib import admin
from .models import FAQItem

@admin.register(FAQItem)
class FAQItemAdmin(admin.ModelAdmin):
    list_display = ('question', 'category', 'display_order', 'is_published')
    list_filter = ('category', 'is_published')
    search_fields = ('question', 'answer')
    list_editable = ('display_order', 'is_published')
    ordering = ('display_order',)
