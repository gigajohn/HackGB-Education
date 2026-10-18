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
        editable=True,
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
    game_progress = models.JSONField(default=dict, blank=True)
    lesson_progress = models.JSONField(default=dict, blank=True)
    state_data = models.JSONField(default=dict, blank=True)
    last_place = models.CharField(max_length=64, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_state_dict(self):
        """Constructs complete frontend state dictionary for SusOrSafe app."""
        base = {
            'mode': self.age_mode or 'kid',
            'coins': self.coins,
            'lessons': self.lesson_progress or {},
            'arcade': self.game_progress or {},
            'avatar': {'color': 'mint', 'accessory': 'none', 'pet': 'pip'},
            'stagesByMode': {'kid': 'primary', 'teen': 'high', 'adult': 'working'},
            'last_place': self.last_place or '',
            'username': self.user.get_username(),
            'name': self.user.get_full_name() or self.user.username,
        }
        if isinstance(self.state_data, dict):
            base.update(self.state_data)
        base['coins'] = self.coins
        base['mode'] = self.age_mode or base.get('mode', 'kid')
        if not isinstance(base.get('stagesByMode'), dict):
            base['stagesByMode'] = {'kid': 'primary', 'teen': 'high', 'adult': 'working'}
        if self.lesson_progress:
            base['lessons'] = self.lesson_progress
        if self.game_progress:
            base['arcade'] = self.game_progress
        base['last_place'] = self.last_place
        return base

    def update_from_state(self, data):
        """Updates profile attributes from frontend state JSON."""
        if not isinstance(data, dict):
            return
        if 'coins' in data:
            try:
                self.coins = max(0, int(data['coins']))
            except (ValueError, TypeError):
                pass
        if 'mode' in data and data['mode'] in ('kid', 'teen', 'adult'):
            self.age_mode = data['mode']
        if 'lessons' in data and isinstance(data['lessons'], dict):
            self.lesson_progress = data['lessons']
            self.lessons_completed = [int(k) for k in data['lessons'].keys() if str(k).isdigit()]
        if 'arcade' in data and isinstance(data['arcade'], dict):
            self.game_progress = data['arcade']
        if 'last_place' in data and isinstance(data['last_place'], str):
            self.last_place = data['last_place'][:64]
        if 'avatar' in data and isinstance(data['avatar'], dict):
            color = data['avatar'].get('color')
            if color:
                self.avatar = str(color)[:255]
        self.state_data = data
        self.save()

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
    from allauth.account.signals import user_signed_up, user_logged_in
    from allauth.socialaccount.signals import social_account_added

    def _sync_social_profile(user):
        if not user or not user.is_authenticated:
            return
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

    @receiver(user_signed_up)
    def populate_profile_from_social(request, user, **kwargs):
        _sync_social_profile(user)

    @receiver(social_account_added)
    def populate_profile_on_social_added(request, sociallogin, **kwargs):
        if sociallogin and sociallogin.user:
            _sync_social_profile(sociallogin.user)

    @receiver(user_logged_in)
    def populate_profile_on_login(request, user, **kwargs):
        _sync_social_profile(user)
except (ImportError, RuntimeError):
    pass
