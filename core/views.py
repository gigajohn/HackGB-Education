from pathlib import Path

from django.conf import settings
from django.contrib.auth import login
from django.contrib.auth.forms import UserCreationForm
from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect, render
from django.templatetags.static import static


def home(request):
    return app_page(request, "home")


def app_page(request, page):
    page_titles = {
        "home": "SusOrSafe — Cybersecurity you can play",
        "lessons": "Lessons · SusOrSafe",
        "games": "Games · SusOrSafe",
        "toolkit": "Safety toolkit · SusOrSafe",
        "parents": "Parents & teachers · SusOrSafe",
        "install": "Install SusOrSafe",
        "about": "About SusOrSafe",
    }
    return render(request, "home.html", {
        "page": page,
        "page_title": page_titles[page],
    })


def signup(request):
    if request.user.is_authenticated:
        return redirect("home")

    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user, backend="django.contrib.auth.backends.ModelBackend")
            return redirect("home")
    else:
        form = UserCreationForm()

    return render(request, "registration/signup.html", {"form": form})


def support_hub(request):
    return render(request, "support/hub.html")


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
        "description": "A cybersecurity playground for ages 8 to 88. Seven short lessons on attacks, fake sites, passwords, 2FA, privacy, and Wi-Fi.",
        "start_url": "/?source=pwa",
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
    response = JsonResponse(data, content_type="application/manifest+json")
    response["Cache-Control"] = "public, max-age=3600"
    return response


def service_worker(request):
    path = Path(settings.BASE_DIR) / "static" / "susorsafe" / "sw.js"
    response = HttpResponse(
        path.read_text(encoding="utf-8"),
        content_type="application/javascript",
    )
    response["Service-Worker-Allowed"] = "/"
    response["Cache-Control"] = "no-cache, no-store, must-revalidate"
    return response
