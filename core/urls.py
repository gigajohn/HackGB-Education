from django.contrib import admin
from django.urls import path, include

from core import views

urlpatterns = [
    path("", views.home, name="home"),
    path("manifest.webmanifest", views.manifest, name="manifest"),
    path("sw.js", views.service_worker, name="service-worker"),
    path("signup/", views.signup, name="page_signup"),
    path("support/", views.support_hub, name="support"),
    path("support/subscribe/", views.support_subscribe, name="subscribe"),
    path("support/donate/", views.support_donate, name="donate"),
    path("accounts/", include("allauth.urls")),
    path("", include("pages.urls")),
    path("admin/", admin.site.urls),
]
