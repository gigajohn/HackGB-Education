from django.contrib import admin
from django.urls import path, include

from core import views

urlpatterns = [
    path("", views.home, name="home"),
    path("manifest.webmanifest", views.manifest, name="manifest"),
    path("sw.js", views.service_worker, name="service-worker"),
    path("landing/", include("pages.urls")),
    path("admin/", admin.site.urls),
]
