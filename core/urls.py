from django.contrib import admin
from django.urls import path, include

from core import views

urlpatterns = [
    path("", views.home, name="home"),
    path("profile/", views.profile, name="profile"),
    path("lessons/", views.app_page, {"page": "lessons"}, name="lessons"),
    path("games/", views.games_page, name="games"),
    path("toolkit/", views.about_section, {"section": "toolkit"}, name="toolkit"),
    path("parents/", views.about_section, {"section": "parents"}, name="parents"),
    path("install/", views.about_section, {"section": "install"}, name="install"),
    path("about/", views.app_page, {"page": "about"}, name="about"),
    path("manifest.webmanifest", views.manifest, name="manifest"),
    path("sw.js", views.service_worker, name="service-worker"),
    path("landing/", include("pages.urls")),
    path("admin/", admin.site.urls),
    path("support/", views.support_hub, name="support"),
    path("support/subscribe/", views.support_subscribe, name="subscribe"),
    path("support/donate/", views.support_donate, name="donate"),
    path("signup/", views.signup, name="signup"),
    path("signup/", views.signup, name="page_signup"),
    

]
