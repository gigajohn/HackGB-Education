from pathlib import Path

from django.conf import settings
from django.contrib.auth import login
from django.contrib.auth.forms import UserCreationForm
from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect, render
from django.templatetags.static import static


def home(request):
    return render(request, "home.html")


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


def manifest(request):
    icons = [
        {"src": static("susorsafe/icons/icon-192.png"), "sizes": "192x192", "type": "image/png", "purpose": "any"},
        {"src": static("susorsafe/icons/icon-512.png"), "sizes": "512x512", "type": "image/png", "purpose": "any"},
        {"src": static("susorsafe/icons/maskable-512.png"), "sizes": "512x512", "type": "image/png", "purpose": "maskable"},
    ]
    data = {
        "name": "SusorSafe — Cybersecurity you can play",
        "short_name": "SusorSafe",
        "description": "Seven short, playful cybersecurity lessons for ages 8 to 88.",
        "start_url": "/",
        "scope": "/",
        "display": "standalone",
        "background_color": "#080b1c",
        "theme_color": "#080b1c",
        "lang": "en",
        "categories": ["education", "security", "kids"],
        "icons": icons,
    }
    return JsonResponse(data, content_type="application/manifest+json")


def service_worker(request):
    path = Path(settings.BASE_DIR) / "static" / "susorsafe" / "sw.js"
    response = HttpResponse(
        path.read_text(encoding="utf-8"),
        content_type="application/javascript",
    )
    response["Service-Worker-Allowed"] = "/"
    response["Cache-Control"] = "no-cache"
    return response
