from django.contrib import messages
from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import redirect, render
from django.urls import reverse
from django.utils.http import url_has_allowed_host_and_scheme
from django.views import View
from django.views.generic import TemplateView


def safe_next_url(request, default="home"):
    """Only allow redirects back to this website."""
    next_url = (
        request.POST.get("next")
        or request.GET.get("next")
    )

    if next_url and url_has_allowed_host_and_scheme(
        url=next_url,
        allowed_hosts={request.get_host()},
        require_https=request.is_secure(),
    ):
        return next_url

    return reverse(default)


class LandingPageView(TemplateView):
    template_name = "pages/landing.html"


class LoginPageView(View):
    template_name = "registration/login.html"

    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect("home")

        form = AuthenticationForm(request=request)

        return render(
            request,
            self.template_name,
            {
                "form": form,
                "next": safe_next_url(request),
            },
        )

    def post(self, request, *args, **kwargs):
        form = AuthenticationForm(
            request=request,
            data=request.POST,
        )

        if form.is_valid():
            user = form.get_user()

            login(
                request,
                user,
                backend="django.contrib.auth.backends.ModelBackend",
            )

            if request.POST.get("remember"):
                request.session.set_expiry(
                    request.session.get_session_cookie_age()
                )
            else:
                request.session.set_expiry(0)

            messages.success(
                request,
                f"Welcome back, {user.get_username()}!",
            )

            return redirect(safe_next_url(request))

        return render(
            request,
            self.template_name,
            {
                "form": form,
                "next": safe_next_url(request),
            },
        )


class OAuthStartView(View):
    """
    Placeholder until real Google and Microsoft
    authentication is connected.
    """

    def get(self, request, provider, *args, **kwargs):
        provider = provider.lower()

        if provider not in ("google", "microsoft"):
            messages.error(
                request,
                "Unsupported sign-in provider.",
            )
            return redirect("login")

        messages.info(
            request,
            f"{provider.capitalize()} sign-in is not connected yet. "
            "Please use your SusorSafe username and password.",
        )

        return redirect("login")

    def post(self, request, provider, *args, **kwargs):
        return self.get(
            request,
            provider,
            *args,
            **kwargs,
        )


class LogoutView(View):
    def get(self, request, *args, **kwargs):
        # Show the landing page without changing the session.
        return redirect("landing")

    def post(self, request, *args, **kwargs):
        logout(request)

        messages.info(
            request,
            "You have been signed out.",
        )

        return redirect("landing")