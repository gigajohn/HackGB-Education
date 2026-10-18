from pathlib import Path
from django.conf import settings
from django.contrib.auth import login
from django.contrib.auth.forms import UserCreationForm
from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect, render
from django.templatetags.static import static
from pages.progress import make_progress_sync_token
from django.urls import reverse


def home(request):
    return app_page(request, "home")

def profile(request):
    return render(request, "profile.html", {
        "page": "profile",
        "page_title": "My profile · SusOrSafe",
    })


def app_page(request, page):
    if page in {"toolkit", "parents", "install"}:
        page = "about"

    page_titles = {
        "home": "SusOrSafe — Cybersecurity you can play",
        "lessons": "Lessons & games · SusOrSafe",
        "about": "About & help · SusOrSafe",
        "profile": "My profile · SusOrSafe",
    }
    import json
    from pages.models import Profile

    just_logged_out = request.GET.get('logged_out') == '1' or request.session.pop('just_logged_out', False)
    context = {
        "page": page,
        "page_title": page_titles.get(page, "SusOrSafe"),
        "just_logged_out": just_logged_out,
    }

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

    response = render(request, "home.html", context)
    if just_logged_out:
        response.set_cookie('susorsafe_clear_client', '1', max_age=15, samesite='Lax')
    return response



def games_page(request):
    return redirect(f"{reverse('lessons')}#games")


def about_section(request, section):
    return redirect(f"{reverse('about')}#{section}")


def signup(request):
    if request.user.is_authenticated:
        return redirect("home")

    if request.method == "POST":
        form = UserCreationForm(request.POST)

        if form.is_valid():
            user = form.save()

            login(
                request,
                user,
                backend="django.contrib.auth.backends.ModelBackend",
            )

            return redirect("home")
    else:
        form = UserCreationForm()

    return render(
        request,
        "registration/signup.html",
        {"form": form},
    )


def support_hub(request):
    return redirect(f"{reverse('about')}#support")


def support_subscribe(request):
    return render(request, "support/subscribe.html")


def support_donate(request):
    return render(request, "support/donate.html")


def favicon(request):
    favicon_path = Path(settings.BASE_DIR) / "static" / "susorsafe" / "icons" / "favicon.png"
    if not favicon_path.exists():
        favicon_path = Path(settings.BASE_DIR) / "staticfiles" / "susorsafe" / "icons" / "favicon.png"
    if favicon_path.exists():
        response = HttpResponse(favicon_path.read_bytes(), content_type="image/png")
        response["Cache-Control"] = "public, max-age=86400"
        return response
    return HttpResponse(status=404)


def manifest(request):
    icons = [
        {
            "src": static("susorsafe/icons/favicon.png"),
            "sizes": "64x64",
            "type": "image/png",
            "purpose": "any"
        },
        {
            "src": static("susorsafe/icons/icon-192.png"),
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "any"
        },
        {
            "src": static("susorsafe/icons/icon-512.png"),
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "any"
        },
        {
            "src": static("susorsafe/icons/maskable-512.png"),
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
        },
    ]

    data = {
        "id": "/?source=pwa",
        "name": "SusOrSafe — Cybersecurity you can play",
        "short_name": "SusOrSafe",
        "description": (
            "Seven short, playful cybersecurity lessons "
            "for ages 8 to 88."
        ),
        "start_url": "/",
        "scope": "/",
        "display": "standalone",
        "display_override": ["window-controls-overlay", "standalone", "minimal-ui"],
        "orientation": "any",
        "background_color": "#080b1c",
        "theme_color": "#080b1c",
        "lang": "en",
        "dir": "ltr",
        "categories": ["education", "security", "kids", "games"],
        "icons": icons,
        "shortcuts": [
            {
                "name": "Seven Lessons",
                "short_name": "Lessons",
                "description": "Start or resume cybersecurity lessons",
                "url": "/lessons/",
                "icons": [{"src": static("susorsafe/icons/icon-192.png"), "sizes": "192x192"}]
            },
            {
                "name": "Games Hub",
                "short_name": "Games",
                "description": "Play interactive cybersecurity challenges",
                "url": "/games/",
                "icons": [{"src": static("susorsafe/icons/icon-192.png"), "sizes": "192x192"}]
            },
            {
                "name": "Safety Toolkit",
                "short_name": "Toolkit",
                "description": "Practical checks and security guides",
                "url": "/toolkit/",
                "icons": [{"src": static("susorsafe/icons/icon-192.png"), "sizes": "192x192"}]
            }
        ]
    }

    return JsonResponse(
        data,
        content_type="application/manifest+json",
    )


def service_worker(request):
    path = (
        Path(settings.BASE_DIR)
        / "static"
        / "susorsafe"
        / "sw.js"
    )

    response = HttpResponse(
        path.read_text(encoding="utf-8"),
        content_type="application/javascript",
    )

    response["Service-Worker-Allowed"] = "/"
    response["Cache-Control"] = "no-cache"

    return response
