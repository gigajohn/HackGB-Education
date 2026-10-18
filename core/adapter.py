import logging
from django.contrib import messages
from django.shortcuts import redirect
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.core.exceptions import ImmediateHttpResponse

logger = logging.getLogger(__name__)


class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    """
    Custom social account adapter that logs OAuth authentication errors
    and provides clear diagnostic messages to users instead of a blank 401 error.
    """

    def on_authentication_error(
        self,
        request,
        provider,
        error=None,
        exception=None,
        extra_context=None,
    ):
        provider_name = getattr(provider, 'name', str(provider))
        provider_id = getattr(provider, 'id', str(provider))
        error_detail = str(exception) if exception else str(error)

        logger.error(
            "Social authentication error for %s (%s): error=%s, exception=%s, extra_context=%s",
            provider_name,
            provider_id,
            error,
            exception,
            extra_context,
        )

        user_friendly_msg = f"{provider_name} sign-in could not be completed."
        if exception:
            exc_str = str(exception)
            if "Invalid client secret" in exc_str or "AADSTS7000215" in exc_str:
                user_friendly_msg += " (Error: The client secret in your server configuration is invalid or is the Secret ID instead of the Secret Value)."
            elif "redirect_uri" in exc_str.lower():
                user_friendly_msg += f" (Error: Redirect URI mismatch. Expected: {request.build_absolute_uri()})."
            else:
                user_friendly_msg += f" ({exc_str})"

        messages.error(request, user_friendly_msg)
        raise ImmediateHttpResponse(redirect('login'))
