from pathlib import Path

from django.conf import settings
from django.contrib.auth import login
from django.contrib.auth.forms import UserCreationForm
from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect, render
from django.templatetags.static import static
from django.urls import reverse


def home(request):
    return app_page(request, "home")


def app_page(request, page):
    if page in {"toolkit", "parents", "install"}:
        page = "about"

    page_titles = {
        "home": "SusOrSafe — Cybersecurity you can play",
        "lessons": "Lessons & games · SusOrSafe",
        "about": "About & help · SusOrSafe",
    }
    return render(request, "home.html", {
        "page": page,
        "page_title": page_titles[page],
    })


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
            login(request, user, backend="django.contrib.auth.backends.ModelBackend")
            return redirect("home")
    else:
        form = UserCreationForm()

    return render(request, "registration/signup.html", {"form": form})


def support_hub(request):
    return redirect(f"{reverse('about')}#support")


def support_subscribe(request):
    return render(request, "support/subscribe.html")


def support_donate(request):
    return render(request, "support/donate.html")


def manifest(request):
    icons = [
        {"src": static("susorsafe/icons/icon-192.png"), "sizes": "192x192", "type": "image/png", "purpose": "any"},
        {"src": static("susorsafe/icons/icon-512.png"), "sizes": "512x512", "type": "image/png", "purpose": "any"},
        {"src": static("susorsafe/icons/maskable-512.png"), "sizes": "512x512", "type": "image/png", "purpose": "maskable"},
    ]
    data = {
        "name": "SusOrSafe — Cybersecurity you can play",
        "short_name": "SusOrSafe",
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
