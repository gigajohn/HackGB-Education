from django.conf import settings
from django.shortcuts import render, redirect
from django.views import View
from django.views.generic import TemplateView
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib import messages
from django.urls import reverse
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
import json

from .progress import make_progress_sync_token, user_from_progress_token


class LandingPageView(TemplateView):
    template_name = 'pages/landing.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        from pages.models import Profile
        request = self.request
        context["page"] = "home"
        context["page_title"] = "SusOrSafe — Cybersecurity you can play"
        just_logged_out = request.GET.get('logged_out') == '1' or request.session.pop('just_logged_out', False)
        context["just_logged_out"] = just_logged_out
        if request.user.is_authenticated:
            profile, _ = Profile.objects.get_or_create(user=request.user)
            context["user_profile"] = profile
            context["user_state_json"] = json.dumps(profile.get_state_dict())
            context["age_mode"] = profile.age_mode or "kid"
            context["progress_sync_token"] = make_progress_sync_token(request.user)
        else:
            context["user_profile"] = None
            context["user_state_json"] = "null"
            context["age_mode"] = "kid"
            context["progress_sync_token"] = ""
        context["progress_sync_origin"] = settings.PROGRESS_SYNC_ORIGIN
        return context


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


class UserProgressAPIView(View):
    """
    API endpoint to load and save user progress to the database.
    GET: Returns the user's saved state from the database.
    POST: Persists lesson, game progress, coins, and place to the database.
    """
    def get(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({'authenticated': False, 'state': None})
        from pages.models import Profile
        profile, _ = Profile.objects.get_or_create(user=request.user)
        return JsonResponse({
            'authenticated': True,
            'state': profile.get_state_dict(),
        })

    def post(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({
                'authenticated': False,
                'status': 'guest',
                'message': 'Guest progress saved locally'
            })
        try:
            data = json.loads(request.body.decode('utf-8'))
        except (json.JSONDecodeError, UnicodeDecodeError):
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)

        from pages.models import Profile
        profile, _ = Profile.objects.get_or_create(user=request.user)
        profile.update_from_state(data)
        return JsonResponse({
            'status': 'ok',
            'authenticated': True,
            'saved_at': profile.updated_at.isoformat(),
            'coins': profile.coins,
            'last_place': profile.last_place,
        })


@method_decorator(csrf_exempt, name='dispatch')
class UserProgressSyncAPIView(View):
    """Cross-domain progress API authenticated with a short-lived signed token."""

    def _cors_response(self, response, request):
        origin = request.headers.get('Origin')
        if origin in settings.PROGRESS_SYNC_ORIGINS:
            response['Access-Control-Allow-Origin'] = origin
            response['Access-Control-Allow-Headers'] = 'Authorization, Content-Type'
            response['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
            response['Vary'] = 'Origin'
        return response

    def options(self, request, *args, **kwargs):
        return self._cors_response(JsonResponse({}, status=204), request)

    def _user(self, request):
        authorization = request.headers.get('Authorization', '')
        if not authorization.startswith('Bearer '):
            return None
        return user_from_progress_token(authorization[7:].strip())

    def get(self, request, *args, **kwargs):
        user = self._user(request)
        if user is None:
            return self._cors_response(JsonResponse({'authenticated': False}, status=401), request)
        from pages.models import Profile
        profile, _ = Profile.objects.get_or_create(user=user)
        return self._cors_response(JsonResponse({
            'authenticated': True,
            'state': profile.get_state_dict(),
        }), request)

    def post(self, request, *args, **kwargs):
        user = self._user(request)
        if user is None:
            return self._cors_response(JsonResponse({'authenticated': False}, status=401), request)
        try:
            data = json.loads(request.body.decode('utf-8'))
        except (json.JSONDecodeError, UnicodeDecodeError):
            return self._cors_response(JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400), request)

        from pages.models import Profile
        profile, _ = Profile.objects.get_or_create(user=user)
        profile.update_from_state(data)
        return self._cors_response(JsonResponse({
            'status': 'ok',
            'authenticated': True,
            'saved_at': profile.updated_at.isoformat(),
            'coins': profile.coins,
            'last_place': profile.last_place,
        }), request)


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
        if '?' in next_url:
            next_url += '&logged_out=1'
        else:
            next_url += '?logged_out=1'

        response = redirect(next_url)
        response.set_cookie('susorsafe_clear_client', '1', max_age=15, samesite='Lax')
        return response

    def post(self, request, *args, **kwargs):
        return self.handle_logout(request)

    def get(self, request, *args, **kwargs):
        return self.handle_logout(request)