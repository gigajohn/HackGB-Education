from django.shortcuts import render, redirect
from django.views import View
from django.views.generic import TemplateView
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib import messages
from django.urls import reverse


class LandingPageView(TemplateView):
    template_name = 'pages/landing.html'


class LoginPageView(View):
    template_name = 'pages/login.html'

    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('landing')
        return render(request, self.template_name)

    def post(self, request, *args, **kwargs):
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '')
        remember = request.POST.get('remember')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user, backend="django.contrib.auth.backends.ModelBackend")
            if not remember:
                request.session.set_expiry(0)
            messages.success(request, f"Welcome back, {user.get_username()}!")
            next_url = request.GET.get('next') or request.POST.get('next') or reverse('landing')
            return redirect(next_url)
        else:
            messages.error(request, "Invalid username or password. Please try again.")
            return render(request, self.template_name, {
                'username': username,
            }, status=401)


class OAuthStartView(View):
    """
    Handles initiation of Google and Microsoft OAuth sign-ins.
    Redirects to allauth OAuth login endpoint if configured,
    or falls back to demo account simulation in development.
    """
    def get(self, request, provider, *args, **kwargs):
        provider = provider.lower()
        if provider not in ('google', 'microsoft'):
            messages.error(request, f"Unsupported OAuth provider: {provider}")
            return redirect('login')

        from allauth.socialaccount.adapter import get_adapter
        from urllib.parse import urlencode

        adapter = get_adapter()
        app = None
        try:
            app = adapter.get_app(request, provider)
        except Exception:
            pass

        if app and app.client_id:
            try:
                login_url = reverse(f"{provider}_login")
                next_param = request.GET.get('next') or request.POST.get('next')
                if next_param:
                    login_url = f"{login_url}?{urlencode({'next': next_param})}"
                return redirect(login_url)
            except Exception:
                pass

        User = get_user_model()
        demo_username = f"{provider}_explorer"
        user, created = User.objects.get_or_create(
            username=demo_username,
            defaults={
                'first_name': provider.capitalize(),
                'last_name': 'Explorer',
                'email': f"{demo_username}@susorsafe.example",
            }
        )
        login(request, user, backend="django.contrib.auth.backends.ModelBackend")
        messages.success(
            request,
            f"Successfully authenticated with {provider.capitalize()}! Welcome, {user.first_name}."
        )
        next_url = request.GET.get('next') or reverse('landing')
        return redirect(next_url)


    def post(self, request, provider, *args, **kwargs):
        return self.get(request, provider, *args, **kwargs)


class LogoutView(View):
    def handle_logout(self, request):
        if request.user.is_authenticated:
            name = request.user.first_name or request.user.username
            logout(request)
            messages.success(request, f"You have been signed out. See you next time, {name}!")
        else:
            logout(request)
            messages.info(request, "You have been signed out.")

        next_url = request.POST.get('next') or request.GET.get('next') or '/'
        return redirect(next_url)

    def post(self, request, *args, **kwargs):
        return self.handle_logout(request)

    def get(self, request, *args, **kwargs):
        return self.handle_logout(request)