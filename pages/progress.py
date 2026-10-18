from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.signing import BadSignature, SignatureExpired, TimestampSigner


TOKEN_SALT = 'susorsafe.progress-sync'


def make_progress_sync_token(user):
    return TimestampSigner(salt=TOKEN_SALT).sign(str(user.pk))


def user_from_progress_token(token):
    if not token:
        return None
    try:
        user_id = TimestampSigner(salt=TOKEN_SALT).unsign(
            token,
            max_age=settings.PROGRESS_SYNC_TOKEN_MAX_AGE,
        )
        return get_user_model().objects.get(pk=int(user_id), is_active=True)
    except (BadSignature, SignatureExpired, TypeError, ValueError, get_user_model().DoesNotExist):
        return None
