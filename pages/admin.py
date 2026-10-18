from django.contrib import admin
from .models import Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'explorer_id', 'provider', 'coins', 'age_mode', 'created_at')
    list_filter = ('provider', 'age_mode', 'created_at')
    search_fields = ('user__username', 'user__email', 'explorer_id')
    readonly_fields = ('explorer_id', 'created_at', 'updated_at')

