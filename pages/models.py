import uuid
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.apps import apps


def generate_user_id():
    """Generates a clean, unique user identifier, e.g. usr_9f8a12bc4e"""
    return f"usr_{uuid.uuid4().hex[:10]}"


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    explorer_id = models.CharField(
        max_length=32,
        unique=True,
        default=generate_user_id,
        editable=False,
        help_text="Unique public user/explorer identifier"
    )

    @property
    def uid(self):
        return self.explorer_id

    provider = models.CharField(
        max_length=30,
        blank=True,
        default='local',
        help_text="Authentication provider (google, microsoft, local)"
    )
    coins = models.PositiveIntegerField(default=0)
    age_mode = models.CharField(
        max_length=10,
        choices=[('kid', 'Kids'), ('teen', 'Teens'), ('adult', 'Adults')],
        default='kid'
    )
    avatar = models.CharField(max_length=255, blank=True, default='shield')
    lessons_completed = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} ({self.explorer_id})"


@receiver(post_save, sender=User)
def create_or_save_user_profile(sender, instance, created, **kwargs):
    """Automatically creates a Profile for each new User."""
    if created:
        Profile.objects.get_or_create(user=instance)
    else:
        if hasattr(instance, 'profile'):
            instance.profile.save()


# Connect allauth signal safely with lazy import
try:
    from allauth.account.signals import user_signed_up

    @receiver(user_signed_up)
    def populate_profile_from_social(request, user, **kwargs):
        profile, _ = Profile.objects.get_or_create(user=user)
        if apps.is_installed('allauth.socialaccount'):
            from allauth.socialaccount.models import SocialAccount
            social_acc = SocialAccount.objects.filter(user=user).first()
            if social_acc:
                profile.provider = social_acc.provider
                extra = social_acc.extra_data or {}
                if social_acc.provider == 'google':
                    profile.avatar = extra.get('picture', profile.avatar)
                elif social_acc.provider == 'microsoft':
                    profile.avatar = 'microsoft'
                profile.save()
except (ImportError, RuntimeError):
    pass
